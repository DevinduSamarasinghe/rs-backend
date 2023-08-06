import express, {Express, Request, Response, urlencoded} from "express"
import { connectDb } from "./config/db";
import cors from "cors";
import UserRouter from "./routes/user.routes";
import ChatRouter from "./routes/chat.routes";
import MessageRouter from "./routes/messages.routes";

const app:Express = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions));

//Routes
app.use('/users',UserRouter);
app.use('/chats',ChatRouter);
app.use('/messages',MessageRouter);


connectDb();
app.listen(PORT, ()=>{
    console.log(`Server Running on PORT: ${PORT}`);
});