import express, {Express, Request, Response} from "express"

const app:Express = express();
const PORT = process.env.PORT || 8080;
app.get('/',(req:Request,res:Response)=>{
    res.send("Server Working huh!");
})

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT: ${PORT}`);
});