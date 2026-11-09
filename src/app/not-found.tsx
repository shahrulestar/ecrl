"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export default function NotFound() {
  const { m } = useI18n();

  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-3 px-4 py-16">
      <h1 className="type-page-title">{m.notFound.title}</h1>
      <p className="text-muted-foreground">{m.notFound.body}</p>
      <Link href="/trip" className="font-medium text-primary underline-offset-4 hover:underline">
        {m.notFound.home}
      </Link>
    </main>
  );
}
