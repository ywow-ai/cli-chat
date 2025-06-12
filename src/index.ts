import { Elysia, t } from "elysia";
import type { ElysiaWS } from "elysia/dist/ws";
import { staticPlugin } from "@elysiajs/static";
import env from "./env";
import { auth } from "./auth";

const clients = new Set<ElysiaWS>();

const userSchema = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const app = new Elysia()
  .use(staticPlugin())
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        return session ?? status(401);
      },
    },
  })
  .post(
    "/sign-up",
    async ({ body, set }) => {
      try {
        const data = await auth.api.signUpEmail({
          body: { email: `x${Date.now()}@x.id`, ...body },
        });
        set.status = 201;
        return data;
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { message: String(error) };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        username: t.String(),
        password: t.String(),
      }),
      response: {
        201: t.Object({
          token: t.String(),
          user: userSchema,
        }),
        500: t.Object({ message: t.String() }),
      },
    }
  )
  .post(
    "/sign-in",
    async ({ body, set }) => {
      try {
        const data = await auth.api.signInUsername({ body });
        return (
          data ??
          (() => {
            set.status = 400;
            return { message: "username / password invalid" };
          })()
        );
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { message: String(error) };
      }
    },
    {
      body: t.Object({ password: t.String(), username: t.String() }),
      response: {
        200: t.Object({
          token: t.String(),
          user: userSchema,
        }),
        400: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
    }
  )
  .get(
    "/get-previous-chat",
    ({ user }) => {
      try {
      } catch (error) {
        console.error(error);
      }
    },
    { auth: true }
  )
  .ws("/chat", {
    auth: true,
    message: (ws, message) => {
      for (const client of clients) {
        if (client.id !== ws.id)
          client.send({ name: ws.data.user.name, text: message });
      }
    },
    open: (ws) => {
      clients.add(ws);
    },
    close: (ws) => {
      clients.delete(ws);
    },
    body: t.String(),
  })
  .listen(env.APP_PORT ?? env.DEFAULT_APP_PORT);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
