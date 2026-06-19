import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaskFlow | Deep Work Task Management" },
      { name: "description", content: "Precision task management for deep work professionals. No fluff, no distractions—just pure, systematic efficiency." },
      { property: "og:title", content: "TaskFlow | Deep Work Task Management" },
      { property: "og:description", content: "Precision task management for deep work professionals." },
    ],
  }),
  component: Home,
});

