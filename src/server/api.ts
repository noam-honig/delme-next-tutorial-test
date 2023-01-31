import { remultNext } from "remult/remult-next";
import { getUserFromNextAuth } from "../pages/api/auth/[...nextauth]";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";
import { createPostgresConnection } from "remult/postgres";

export const api = remultNext({
  dataProvider: createPostgresConnection({
    connectionString: process.env["DATABASE_URL"] || "postgres://postgres:MASTERKEY@localhost/postgres"
  }),
  getUser: getUserFromNextAuth,
  entities: [Task],
  controllers: [TasksController]
})