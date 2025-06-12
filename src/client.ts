import { Treaty, treaty } from "@elysiajs/eden";
import { App } from ".";
import env from "./env";
import { createInterface } from "readline";

const hostname = env.APP_URL ?? env.DEFAULT_APP_URL;
const port = env.APP_PORT ?? env.DEFAULT_APP_PORT;

const client = treaty<App>(`${hostname}:${port}`);

const chat = client.chat.subscribe();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username: string | null = null;
// const frames = ["|", "/", "-", "\\"] as const;
const now = () => new Date().toISOString().replace("T", " ").substring(0, 19);
const prefix = () => {
  const max: number = 10;
  process.stdout.write(
    `[${now()} ${
      (username?.length ?? 0) > max
        ? `${(username ?? "").slice(0, max - 3)}...`
        : (username ?? "").padStart(max, " ")
    }]: `
  );
};
const requestForName = () => {
  rl.question("who are you: ", (name) => {
    username = name.trim();

    return username ? prefix() : requestForName();
  });
};
requestForName();

chat.subscribe((message) => {
  const { data } = message as Treaty.OnMessage<{
    name: string;
    text: string;
  }>;
  process.stdout.write(`${data.text}\n`);
  prefix();
});
rl.on("line", (line) => {
  chat.send(line);
  prefix();
});
rl.on("close", () => {
  process.stdout.write("Bye!\n");
  process.exit(0);
});
