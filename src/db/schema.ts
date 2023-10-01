import {
  bigint,
  boolean,
  date,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const scripts = mysqlTable("scripts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("isActive").notNull().default(false),
  script: text("script").notNull(),
});
