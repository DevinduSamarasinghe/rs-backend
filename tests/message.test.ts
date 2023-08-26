import {main} from "../api";
import {Server} from "http";
import {Express} from "express";
import {sessionCreation} from "./user.test";
import { deserealizeUser } from "../middleware/deserialization";
import request from "supertest";

describe("MESSAGES",()=>{
    let server: Server;
    let app: Express;

    beforeAll(()=>{
        const {server: srv, app: ap} = main();
        server = srv;
        app = ap;
    })
    jest.setTimeout(10000);

    afterAll(() => {
        return new Promise<void>((resolve) => {
            console.log("closing server");
            server.close(() => {
                resolve();
            });
        });
    });

    describe("POST /messages/",()=>{
        
        describe("given a valid access token and chatId with content",()=>{
            test("message_id should be defined",async()=>{

                const {accessToken, refreshToken} = sessionCreation();
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
            })
        })
    })
})