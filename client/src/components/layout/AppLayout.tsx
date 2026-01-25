import { useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-[100dvh] w-full bg-white dark:bg-[#1f1f1f] transition-colors duration-300 overflow-hidden">
      {/* Toggle button */}
      <div
        className={`fixed top-2 z-[999] cursor-pointer 
          flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] 
          hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? "left-2" : "left-[calc(100%-3rem)] sm:left-[19.5em]"}
        `}
        onClick={() => setCollapsed((v) => !v)}
      >
        <span
          className={`text-[1.3em] ${
            collapsed ? "icon-icons8-menu-bar" : "icon-icons8-close"
          }`}
        />
      </div>

      <Sidebar collapsed={collapsed} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-[24px] bg-white dark:bg-[#1f1f1f] text-black dark:text-white">
        {children}
      </main>
    </div>
  );
}
