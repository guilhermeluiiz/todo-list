import type { Task } from "@/generated/prisma/client";
import { TaskItem } from "./task-item";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhuma tarefa ainda. Crie a primeira!</p>;
  }
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}