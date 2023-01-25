import express from 'express';

const app = express();
const port = 5000;


app.listen(5000, () => {
    console.log(`App started at port ${port}`)
})

app.get("/", (req,res) => {
    return res.send("This is server for hotel app");
})