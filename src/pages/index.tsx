import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";

const taskRepo = remult.repo(Task);

async function fetchTasks() {
  return taskRepo.find({
    orderBy: {
      completed: "asc",
    },
    where: {
      completed: undefined,
    },
  });
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { data: session } = useSession();

  async function addTask(e: FormEvent) {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (err: any) {
      alert(err.message);
    }
  }

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
    fetchTasks().then(setTasks);
  };

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);
  if (!session)
    return (
      <div className="flex items-center flex-col h-screen justify-center bg-gray-50 text-lg">
        <h3 className="text-6xl text-red-500 italic">Todos</h3>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-base text-white font-semibold py-1 px-4 rounded-full"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </div>
    );
  return (
    <div className="flex items-center flex-col h-screen justify-center bg-gray-50 text-lg">
      <h3 className="text-6xl text-red-500 italic">Todos</h3>
      <main className="bg-white border rounded-lg shadow-lg m-5 max-w-md w-screen flex flex-col">
        <div className="flex justify-between px-6 p-2">
          Hello {session.user!.name}
          <button
            onClick={() => signOut()}
            className="bg-blue-500 hover:bg-blue-700 text-base text-white font-semibold py-1 px-4 rounded-full"
          >
            Sign out
          </button>
        </div>
        <form onSubmit={addTask} className="border-b-2 p-2 px-6 flex">
          <input
            className="w-full placeholder:italic focus:outline-none"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button className="text-4xl">+</button>
        </form>
        {tasks.map((task) => {
          const setTask = (value: Task) =>
            setTasks(tasks.map((t) => (t === task ? value : t)));

          const setCompleted = async (completed: boolean) =>
            setTask(await taskRepo.save({ ...task, completed }));

          const setTitle = async (title: string) => setTask({ ...task, title });

          const saveTask = async () => {
            try {
              setTask(await taskRepo.save(task));
            } catch (err: any) {
              alert(err.message);
            }
          };
          const deleteTask = async () => {
            await taskRepo.delete(task);
            setTasks(tasks.filter((t) => t !== task));
          };

          return (
            <div key={task.id} className="flex border px-6 py-2 gap-2">
              <input
                className="w-6 mr-2"
                type="checkbox"
                checked={task.completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <input
                className="w-full outline-none"
                value={task.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={saveTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
              <button onClick={deleteTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          );
        })}
        <div className="flex justify-center border-t-4 p-4 gap-4 flex-wrap">
          <button
            onClick={() => setAllCompleted(true)}
            className="bg-blue-500 hover:bg-blue-700 text-base text-white font-semibold py-1 px-4 rounded-full"
          >
            Set all completed
          </button>
          <button
            onClick={() => setAllCompleted(false)}
            className="bg-blue-500 hover:bg-blue-700 text-base text-white font-semibold py-1 px-4 rounded-full"
          >
            Set all uncompleted
          </button>
        </div>
      </main>
    </div>
  );
}
