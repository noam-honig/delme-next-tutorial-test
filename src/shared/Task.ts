import { Allow, Entity, Fields, remult, Validators } from "remult"
import { Roles } from "./Roles"

@Entity("tasks", {
  allowApiCrud: () => {
    console.log({ user: remult.user })
    return remult.authenticated()
  },
  allowApiInsert: Roles.admin,
  allowApiDelete: Roles.admin
})
export class Task {
  @Fields.autoIncrement()
  id = 0
  @Fields.string<Task>({
    validate: task => {
      if (task.title.length < 3)
        throw Error("Too short")
    },
    allowApiUpdate: Roles.admin
  })
  title = ''
  @Fields.boolean()
  completed = false
}