import express, {Request, Response, NextFunction} from "express";
import dotenv from "dotenv"
import v1Router from "./routes/v1/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use("/api/v1",v1Router);

app.listen(PORT || 8080,()=>{
    console.log("Server is listening on the PORT: ",PORT);
});