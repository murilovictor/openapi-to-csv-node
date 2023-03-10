import "reflect-metadata";
import express, {NextFunction, Request, Response} from "express";
import "express-async-errors";
import cors from "cors";
import {router} from "./routes";
import bodyParser from "body-parser";

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.use(bodyParser.json({limit: '100mb'}));

app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        return response.status(500).json({
            status: "Internal Server Error",
            message: err.message,
            stack: err.stack
        });
    }
);

app.listen(3000, () => console.log("Server is running. Port: 3000"));
