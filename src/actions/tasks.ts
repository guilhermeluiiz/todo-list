"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { taskSchema, type TaskInput } from "@/lib/validations";

export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  return userId;
}

export async function createTask(input: TaskInput): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        userId,
      },
    });
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao criar a tarefa" };
  }
}

export async function updateTask(id: string, input: TaskInput): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await prisma.task.updateMany({
      where: { id, userId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
      },
    });
    if (result.count === 0) return { success: false, error: "Tarefa não encontrada" };
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar a tarefa" };
  }
}

export async function toggleTask(id: string, completed: boolean): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const result = await prisma.task.updateMany({
      where: { id, userId },
      data: { completed },
    });
    if (result.count === 0) return { success: false, error: "Tarefa não encontrada" };
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao alterar o status" };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const result = await prisma.task.deleteMany({ where: { id, userId } });
    if (result.count === 0) return { success: false, error: "Tarefa não encontrada" };
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao excluir a tarefa" };
  }
}