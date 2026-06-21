import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const { login, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      await login(email, password);
      // Success redirect to dashboard
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      console.error(err);
      setShake(true);
      setTimeout(() => setShake(false), 400);

      // Handle typical Axios/backend errors
      if (err.response) {
        setApiError(
          err.response.data?.message || 
          err.response.data?.error || 
          "Invalid email or password. Please try again."
        );
      } else if (err.request) {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        setApiError(`Server is unreachable. Please verify the backend is running at ${apiBaseUrl}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface flex flex-col justify-between min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary-container blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-secondary-container blur-[120px]" />
      </div>

      {/* Header with Dark Mode Toggle */}
      <header className="w-full py-4 px-6 relative z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link to="/" className="text-[18px] font-bold text-primary tracking-tight">
            TaskFlow
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors"
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={20} />
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="relative z-10 w-full max-w-[420px] mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-extrabold text-primary tracking-tight mb-1">
              Sign In
            </h1>
            <p className="text-on-surface-variant text-[14px]">
              Access your workspace tasks.
            </p>
          </div>

          <div
            className={`bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl transition-all duration-300 ${
              shake ? "animate-shake" : ""
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {apiError && (
                <div className="flex items-start gap-2 bg-error-container/20 border border-error/30 p-4 rounded-lg text-error">
                  <Icon name="error" className="shrink-0 mt-0.5" size={18} />
                  <p className="text-[13px] font-medium leading-tight">{apiError}</p>
                </div>
              )}

              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Icon
                    name="mail"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    size={20}
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setApiError(null);
                    }}
                    placeholder="name@company.com"
                    disabled={loading}
                    className={`w-full bg-surface-container border ${
                      emailError ? "border-error focus:ring-error/20" : "border-outline-variant focus:ring-primary/20"
                    } rounded-lg pl-12 pr-4 py-2.5 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 transition-all text-[14px]`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] font-semibold text-error mt-0.5 flex items-center gap-1">
                    <Icon name="error" size={12} /> {emailError}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    size={20}
                  />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setApiError(null);
                    }}
                    placeholder="••••••••"
                    disabled={loading}
                    className={`w-full bg-surface-container border ${
                      passwordError ? "border-error focus:ring-error/20" : "border-outline-variant focus:ring-primary/20"
                    } rounded-lg pl-12 pr-4 py-2.5 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 transition-all text-[14px]`}
                  />
                </div>
                {passwordError && (
                  <p className="text-[11px] font-semibold text-error mt-0.5 flex items-center gap-1">
                    <Icon name="error" size={12} /> {passwordError}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-on-primary py-3 rounded-lg text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-75 shadow-md shadow-primary/5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Icon name="progress_activity" className="animate-spin" size={18} /> Authenticating...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
                <Link
                  to="/"
                  className="text-on-surface-variant text-[12px] font-semibold py-2 rounded-lg hover:text-on-surface flex items-center justify-center gap-1 transition-colors"
                >
                  <Icon name="arrow_back" size={18} />
                  Back to Home
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-[14px] text-on-surface-variant">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer space */}
      <footer className="py-4 relative z-10" />
    </div>
  );
}
