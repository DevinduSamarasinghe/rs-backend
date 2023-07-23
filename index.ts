import express, {Express, Request, Response, urlencoded} from "express"
import { connectDb } from "./config/db";
import cors from "cors";
import UserRouter from "./routes/user.routes";

const app:Express = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Routes
app.use('/users',UserRouter);


connectDb();
app.listen(PORT, ()=>{
    console.log(`Server Running on PORT: ${PORT}`);
});