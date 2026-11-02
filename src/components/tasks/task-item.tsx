"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Task } from "@/generated/prisma/client";
import { deleteTask, toggleTask, updateTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TaskItem({ task }: { task: Task }) {
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      const r = await toggleTask(task.id, checked);
      if (r.success) toast.success(checked ? "Tarefa concluída!" : "Tarefa reaberta!");
      else toast.error(r.error);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const r = await deleteTask(task.id);
      if (r.success) toast.success("Tarefa excluída!");
      else toast.error(r.error);
    });
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await updateTask(task.id, {
        title: String(fd.get("title") ?? ""),
        description: String(fd.get("description") ?? ""),
      });
      if (r.success) {
        toast.success("Tarefa atualizada!");
        setEditOpen(false);
        setErrors({});
      } else {
        setErrors(r.fieldErrors ?? {});
        toast.error(r.error);
      }
    });
  }

  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <Checkbox
          checked={task.completed}
          disabled={pending}
          onCheckedChange={(v) => handleToggle(v === true)}
          className="mt-1"
        />
        <div className="flex-1">
          <p className={task.completed ? "line-through text-muted-foreground" : "font-medium"}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={task.completed ? "secondary" : "outline"}>
              {task.completed ? "Concluída" : "Pendente"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild><Button variant="outline" size="sm">Editar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar tarefa</DialogTitle></DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1">
                <Input name="title" defaultValue={task.title} />
                {errors.title && <p className="text-sm text-destructive">{errors.title[0]}</p>}
              </div>
              <div className="space-y-1">
                <Textarea name="description" defaultValue={task.description ?? ""} />
                {errors.description && <p className="text-sm text-destructive">{errors.description[0]}</p>}
              </div>
              <Button type="submit" disabled={pending}>Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Excluir</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
              <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}