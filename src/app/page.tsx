import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/tasks");

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Organize suas tarefas</h1>
      <p className="mt-3 text-muted-foreground">Crie sua conta e gerencie suas tarefas com segurança.</p>
      <Button asChild className="mt-6"><Link href="/sign-up">Começar</Link></Button>
    </div>
  );
}