import { createFileRoute } from "@tanstack/react-router";
import { FareApp } from "@/components/fare-app";

export const Route = createFileRoute("/")({ component: FareApp });
