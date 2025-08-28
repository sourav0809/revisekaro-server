/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import AuthRoutes from "./auth.routes";
import UserRoutes from "./user.routes";
import { envConfig } from "../config/envConfig";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

const devAndTestRoutes: any = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (envConfig.server.env !== "production") {
  devAndTestRoutes.forEach((route: any) => {
    router.use(route.path, route.route);
  });
}

export default router;
