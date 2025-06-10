import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import env from "./env";

const app = new Elysia()
  .use(staticPlugin())
  .ws("/chat", { message: () => "" })
  .listen(env.APP_PORT ?? env.DEFAULT_APP_PORT);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
