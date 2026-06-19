import { createFileRoute } from "@tanstack/react-router";
import { Login } from "../pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | TaskFlow" },
      { name: "description", content: "Sign in to your TaskFlow workspace." },
    ],
  }),
  component: Login,
});