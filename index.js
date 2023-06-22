const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;
app.get('/',(req,res)=>{
    res.send("Server Working huh!");
})

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT: ${PORT}`);
});