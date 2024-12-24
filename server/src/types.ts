import type { Env } from "hono";
import type { auth } from "./auth";

export interface Context extends Env {
  Bindings: {
    MY_VAR: string;
    JWT_SECRET: string;
    DB: D1Database;
  };
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}
