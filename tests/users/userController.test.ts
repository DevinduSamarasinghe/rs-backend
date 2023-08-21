import { app } from "../..";
import request,{Request} from "supertest";
import { deserealizeUser } from "../../middleware/deserialization";
import { signJWT } from "../../config/jwt.config";
import { createSession } from "../../repository/users";

const sessionCreation = () => {
  const session = createSession(
    "6498325d147031dca9fb734b",
    "Devindu",
    "Samarasinghe",
    "devindu99@gmail.com",
    "customer"
  );
  const refreshPayload = {
    sessionId: session.sessionId,
  };

  const accessToken = signJWT(session, "30m");
  const refreshToken = signJWT(refreshPayload, "7d");
  return { accessToken, refreshToken };
};

//LOGIN CONTROLLER
describe("POST /users/login", () => {
  describe("given an email and passowrd", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users/login").send({
        email: "devindu99@gmail.com",
        password: "123456",
      });
      expect(response.status).toBe(201);
    });

    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/users/login").send({
        email: "devindu99@gmail.com",
        password: "123456",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should return an object including the userId from database and session", async () => {
      const response = await request(app).post("/users/login").send({
        email: "devindu99@gmail.com",
        password: "123456",
      });
      expect(response.body.sessionId && response.body._id).toBeDefined();
    });
  });

  //MISSING VALIDATION PARAMETERS
  describe("email and password being missing", () => {
    const data = {
      email: null,
      password: null,
    };

    test("should respond with a 400 status code", async () => {
      const response = await request(app).post("/users/login").send(data);
      expect(response.status).toBe(400);
    });

    test("should return an error message", async () => {
      const response = await request(app).post("/users/login").send(data);
      expect(response.error).toBeTruthy();
    });
  });

  //INCORRECT EMAIL AND PASSWORD
  describe("email and password being incorrect", () => {
    test("Incorrect password should return status 400", async () => {
      const response = await request(app).post("/users/login").send({
        email: "devindu@gmail.com",
        password: "12346",
      });
      expect(response.error).toBeTruthy();
    });
  });
});

// SIGNUP CONTROLLER
describe("POST /users/signup", () => {
  describe("given an existing user", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).post("/users/register").send({
        firstName: "Devindu",
        lastName: "Samarasinghe",
        email: "devindu99@gmail.com ",
        password: "123456",
        role: "customer",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("given a user with missing parameters", () => {
    const data = {
      firstName: "Devindu",
      lastName: "Samarasinghe",
    };
    test("should respond with a 500 status code", async () => {
      const response = await request(app).post("/users/register").send(data);
      expect(response.status).toBe(500);
    });

    test("should return an error message", async () => {
      const response = await request(app).post("/users/register").send(data);
      expect(response.error).toBeTruthy();
    });
  });
});


//CURRENT USER CONTROLLER
describe("GET /users/current", () => {
  describe("Gets current user through authentication",()=>{
    test("returns status 200 when retrieving current user", async () => {
      //Setup
      const { accessToken, refreshToken } = sessionCreation();
      app.use(deserealizeUser);
      const response = await request(app)
        .get("/users/current")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ]);
  
      // Assertions
      expect(response.status).toBe(200);
    });
  
    test("asserting whether current users _id attribute and sessionId", async()=>{
      const {accessToken, refreshToken} = sessionCreation();
      app.use(deserealizeUser);
      const response = await request(app)
      .get("/users/current")
      .set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]);
      expect(response.body._id && response.body.sessionId).toBeDefined();
    })
  })
});

//GET ALL USERS CONTROLLER 
describe("GET /users/",()=>{
  describe("Gets all users through authentication", ()=>{

    test("returns status 200 when retrieving all users", async () => {
      //Setup
      const { accessToken, refreshToken } = sessionCreation();
      app.use(deserealizeUser);
      const response = await request(app)
        .get("/users/")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ]);
  
      // Assertions
      expect(response.status).toBe(200);
    });
  })
})

