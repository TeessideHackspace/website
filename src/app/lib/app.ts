import serverless from "serverless-http";
import express, { Request } from "express";
import cors from "cors";

import { expressjwt, Request as JWTRequest } from "express-jwt";

import { MembershipApiService } from "./service/service";
import { GocardlessHandler } from "./controller/gocardless";
import { AccountHandler } from "./controller/account";
import { InfrastructureHandler } from "./controller/infra";
import { SlackHandler } from "./controller/slack";
import { StatsHandler } from "./controller/stats";
import { SignupHandler } from "./controller/signup";

const service = new MembershipApiService();
const gocardlessHandler = new GocardlessHandler(service);
const accountHandler = new AccountHandler(service);
const signupHandler = new SignupHandler(service);
const infrastructureHandler = new InfrastructureHandler(service);
const statsHandler = new StatsHandler(service);
const slackHandler = new SlackHandler();

export type RequestWithUser = JWTRequest;
export const app = express();

app.use(cors());
app.use(
  expressjwt({
    secret: process.env.AUTH0_SECRET!,
    algorithms: ["HS256"],
  }).unless({
    path: ["/gocardless_webhook", "/stats", "/slack-invite", /infra\/(.*)/],
  })
);

app.post("/signup", signupHandler.signup);
app.post("/gocardless_confirm", gocardlessHandler.confirm);
app.post("/gocardless_webhook", gocardlessHandler.webhook);
app.get("/account", accountHandler.get);
app.post("/account/rfid", accountHandler.addRfid);
app.post("/change_amount", accountHandler.changeAmount);
app.post("/cancel", accountHandler.cancel);
app.get("/stats", statsHandler.get);
app.get("/infra/users", infrastructureHandler.getUsers);
app.get("/infra/users/:id", infrastructureHandler.getUser);
app.post("/slack-invite", slackHandler.invite);
