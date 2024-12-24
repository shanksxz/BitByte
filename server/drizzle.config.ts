import type { Config } from "drizzle-kit";

export default {
	dialect: "sqlite",
	driver: "d1-http",
	schema: "./src/database/schema*",
	out: "./drizzle",
} satisfies Config;
