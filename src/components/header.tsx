import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">Todo List</Link>
        {userId ? (
          <div className="flex items-center gap-3">
            <Link href="/tasks" className="text-sm">Minhas tarefas</Link>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link href="/sign-in">Entrar</Link></Button>
            <Button asChild><Link href="/sign-up">Cadastrar</Link></Button>
          </div>
        )}
      </div>
    </header>
  );
}