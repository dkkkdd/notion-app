import { useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex w-full h-full">
      <div
        className={`sidebar-toggle tip ${collapsed ? "collapsed" : ""}`}
        onClick={() => setCollapsed((v) => !v)}
      >
        <span
          className={collapsed ? "icon-icons8-menu-bar" : "icon-icons8-close"}
        ></span>
      </div>

      <Sidebar collapsed={collapsed} />

      <main className=" flex-1 p-[24px] bg-[#1f1f1f] text-[#fff] overflow-auto h-[100vh]">
        {children}
      </main>
    </div>
  );
}
