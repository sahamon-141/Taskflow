import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dashboard } from "../pages/Dashboard";
import { Icon } from "../components/Icon";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "TaskFlow | Dashboard" },
      { name: "description", content: "Your TaskFlow dashboard — pending tasks, filters, and deep work focus." },
    ],
  }),
  component: DashboardGuard,
});

function DashboardGuard() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center gap-3">
        <Icon name="progress_activity" className="animate-spin text-primary" size={40} />
        <span className="text-[14px]">Verifying authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard />;
}