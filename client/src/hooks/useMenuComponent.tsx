import { useState, useCallback } from "react";

export function useMenuComponent() {
  const [open, setOpen] = useState(false); // меню открыто/закрыто

  // открытие меню
  const openMenu = useCallback(() => setOpen(true), []);

  // закрытие меню
  const closeMenu = useCallback(() => setOpen(false), []);

  // переключение меню (например, по кнопке)
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    setOpen, // можно управлять напрямую
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
