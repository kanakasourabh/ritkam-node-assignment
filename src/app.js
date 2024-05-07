import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*",
    Credential: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import auth rutes
import authRouter from "./routes/auth.router.js";
import adminRouter from "./routes/admin.router.js";
import groupRouter from "./routes/group.router.js";
import messageRouter from "./routes/message.router.js";

//declaring routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/messages", messageRouter);

export { app };
