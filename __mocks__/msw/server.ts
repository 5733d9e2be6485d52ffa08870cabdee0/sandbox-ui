import * as express from "express";
import cors from "cors";
import { createMiddleware } from "@mswjs/http-middleware";
import { handlers } from "./handlers";

const app = express.default();
app.use(cors());
app.use(express.json());
app.use(createMiddleware(...handlers));

const port = 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on("error", console.error);
