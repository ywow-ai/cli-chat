const env = {
  DEFAULT_APP_URL: "localhost",
  DEFAULT_APP_PORT: "3000",

  APP_URL: process.env.APP_URL ?? null,
  APP_PORT: process.env.APP_PORT ?? null,
} as const satisfies Record<string, string | null>;

export default env;
