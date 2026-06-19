import { createFileRoute } from "@tanstack/react-router";
import { Register } from "../pages/Register";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register | TaskFlow" },
      { name: "description", content: "Create your TaskFlow account and start your deep work practice." },
    ],
  }),
  component: Register,
});