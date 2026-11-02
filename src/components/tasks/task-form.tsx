"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      title: String(fd.get("title") ?? ""),
      description: String(fd.get("description") ?? ""),
    };

    startTransition(async () => {
      const result = await createTask(input);
      if (result.success) {
        toast.success("Tarefa criada com sucesso!");
        formRef.current?.reset();
        setErrors({});
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader><CardTitle>Nova tarefa</CardTitle></CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" placeholder="Ex.: Estudar Prisma" />
            {errors.title && <p className="text-sm text-destructive">{errors.title[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea id="description" name="description" />
            {errors.description && <p className="text-sm text-destructive">{errors.description[0]}</p>}
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Adicionar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}