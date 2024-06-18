import morgan from "morgan";
import cors from "cors";
import express = require("express");

const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

export { app };
