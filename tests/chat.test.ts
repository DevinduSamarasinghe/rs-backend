import request from "supertest";
import { main } from "../api";
import { deserealizeUser } from "../middleware/deserialization";
import { Server } from "http";
import { Express } from "express";
import { sessionCreation } from "./user.test";

describe("CHATS", () => {
    let server: Server;
    let app: Express;

    beforeAll(() => {
        const { server: srv, app: ap } = main();
        server = srv;
        app = ap;
    });

    jest.setTimeout(10000);

    describe("POST /chats/", () => {
        describe("given a valid access token and chatId", () => {
            test("should respond with a 200 status code", async () => {
                const { accessToken, refreshToken } = sessionCreation();
                app.use(deserealizeUser);
                const response = await request(app)
                    .post("/chats")
                    .send({
                        userId: "649836af27cb55d6ecb9704f",
                    })
                    .set("Cookie", [
                        `accessToken=${accessToken}`,
                        `refreshToken=${refreshToken}`,
                    ]);

                expect(response.status).toBe(200);
            });
        });

        describe("not passing any cookies", () => {
            test("should respond with a 401 status code", async () => {
                const response = await request(app).post("/chats").send({
                    userId: "649836af27cb55d6ecb9704f",
                });

                expect(response.status).toBe(401);
            });
        });

        describe("Should send an incorrect chatId", () => {
            test("should respond with a 400 status code", async () => {
                const { accessToken, refreshToken } = sessionCreation();
                app.use(deserealizeUser);
                const response = await request(app)
                    .post("/chats")
                    .send({
                        userId: "12345",
                    })
                    .set("Cookie", [
                        `accessToken=${accessToken}`,
                        `refreshToken=${refreshToken}`,
                    ]);

                expect(response.body.status).toBe(400);
            });

            test("should return an error message", async () => {
                const { accessToken, refreshToken } = sessionCreation();
                app.use(deserealizeUser);
                const response = await request(app)
                    .post("/chats")
                    .send({
                        userId: "12345",
                    })
                    .set("Cookie", [
                        `accessToken=${accessToken}`,
                        `refreshToken=${refreshToken}`,
                    ]);

                expect(response.body.data).toBeDefined();
            });
        });
    });

    describe("GET /chats/",()=>{
        describe("given a valid access token",()=>{

            
            test("chat _id should be defined",async()=>{
                const { accessToken, refreshToken } = sessionCreation();
                app.use(deserealizeUser);
                const response = await request(app)
                    .get("/chats")
                    .set("Cookie", [
                        `accessToken=${accessToken}`,
                        `refreshToken=${refreshToken}`,
                    ]);
                expect(response.body[0]._id).toBeDefined();
            })

            test("response should return status 200", ()=>{
                
            })

        })
    })


    afterAll(() => {
        return new Promise<void>((resolve) => {
            console.log("closing server");
            server.close(() => {
                resolve();
            });
        });
    });
});
