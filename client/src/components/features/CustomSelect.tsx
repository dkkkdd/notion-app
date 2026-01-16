import type { Placement } from "@floating-ui/react";
import { CustomSelectUi } from "../ui/CustomSelect";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
} from "@floating-ui/react";

export type Option = {
  value: string | number | null;
  label: string;
  color?: string;
  icon?: string;
};

interface CustomSelectProps {
  symbol?: string;
  value: string | number | null;
  options: Option[];
  onChange: (v: any) => void;
  placeholder?: string;
  position: Placement | undefined;
}

export function CustomSelect({
  symbol,
  value,
  options,
  onChange,
  placeholder,
  position,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const restProps = { symbol, value, options, onChange, placeholder, position };
  // refs for keyboard nav
  const listItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const labels = useMemo(() => options.map((o) => o.label), [options]);
  const labelsRef = useRef(labels);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: position,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ fallbackPlacements: ["top-start", "bottom-end"] }),
      shift({ padding: 10 }),
    ],
  });

  const selectedIndex = options.findIndex((o) => o.value === value);

  // list navigation settings
  const listNav = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    selectedIndex: selectedIndex !== -1 ? selectedIndex : null,
    loop: true,
    virtual: true, // keep focus on button while navigating list
  });

  // allow typing to find options
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNav, typeahead]
  );

  // confirm selection on Enter
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && activeIndex !== null && open) {
      event.preventDefault();
      onChange(options[activeIndex].value);
      setOpen(false);
    }
  };

  // scroll to active item when using arrows
  useEffect(() => {
    if (open && activeIndex !== null && listItemsRef.current[activeIndex]) {
      listItemsRef.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, open]);

  const current = options.find((o) => o.value === value) || null;
  return (
    <CustomSelectUi
      {...restProps}
      open={open}
      setOpen={setOpen}
      activeIndex={activeIndex}
      current={current}
      refs={refs}
      floatingStyles={floatingStyles}
      getReferenceProps={getReferenceProps}
      getFloatingProps={getFloatingProps}
      getItemProps={getItemProps}
      listItemsRef={listItemsRef}
      handleKeyDown={handleKeyDown}
    />
  );
}
