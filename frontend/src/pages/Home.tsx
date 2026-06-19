import { Link } from "@tanstack/react-router";
import { Icon } from "../components/Icon";
import { useTheme } from "../context/ThemeContext";

export function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Navbar */}
      <header className="w-full bg-surface-container-low border-b border-outline-variant py-4 px-6 md:px-12">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <Link to="/" className="text-[20px] font-bold text-primary tracking-tight">
            TaskFlow
          </Link>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 hover:bg-surface-variant rounded-full text-on-surface-variant hover:text-primary transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-outline-variant/30"
            >
              <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
            </button>
            
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider border border-outline text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all rounded-lg"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="functional-grid-bg absolute inset-0" />
        </div>

        <div className="text-center max-w-xl py-12 relative z-10">
          <h1 className="text-[48px] md:text-[64px] font-extrabold text-on-surface tracking-tight mb-4 leading-none">
            Task<span className="text-primary">Flow</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-on-surface-variant mb-10 max-w-md mx-auto">
            A simple task management application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-[14px] font-bold uppercase tracking-widest bg-primary text-on-primary hover:opacity-95 active:scale-[0.98] transition-all rounded-lg shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              Get Started
              <Icon name="arrow_forward" size={18} />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-[14px] font-bold uppercase tracking-widest border border-outline text-on-surface hover:bg-surface-variant/30 active:scale-[0.98] transition-all rounded-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-6 px-6 text-center text-[12px] text-on-surface-variant opacity-60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>TaskFlow © 2026. Minimal Task Management.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
