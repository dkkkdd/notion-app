import { useState, useCallback } from "react";

export function useMenuComponent() {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);

  const closeMenu = useCallback(() => setOpen(false), []);

  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    setOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
