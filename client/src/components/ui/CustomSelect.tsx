import type { Option } from "../features/CustomSelect";
import { FloatingPortal } from "@floating-ui/react";
interface CustomSelectUiProps {
  // Состояние
  open: boolean;
  activeIndex: number | null;
  value: string | number | null;
  current: Option | null;
  options: Option[];

  // Конфиг
  placeholder?: string;
  symbol?: string;

  // Floating UI пропсы
  refs: any;
  floatingStyles: React.CSSProperties;
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => any;
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  border?: boolean;

  // Рефы и функции
  listItemsRef: React.MutableRefObject<(HTMLLIElement | null)[]>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setOpen: (open: boolean) => void;
  onChange: (v: any) => void;
}

export const CustomSelectUi = ({
  open,
  activeIndex,
  value,
  current,
  options,
  placeholder,
  symbol,
  refs,
  border,
  floatingStyles,
  getFloatingProps,
  getReferenceProps,
  getItemProps,
  listItemsRef,
  handleKeyDown,
  setOpen,
  onChange,
}: CustomSelectUiProps) => {
  return (
    <>
      <button
        onClick={(e) => e.stopPropagation()}
        ref={refs.setReference}
        {...getReferenceProps({
          onKeyDown: handleKeyDown,
        })}
        type="button"
        className={`
          focus:outline-none relative w-full min-h-[38px]
          flex items-center justify-between gap-2 p-2 pr-7
          rounded cursor-pointer box-border 
          bg-transparent text-gray-700
          hover:bg-black/5 dark:hover:bg-[#333] m-0
          ${
            border !== false
              ? "border-[0.5px] border-black/20 dark:border-[#444] hover:border-gray-400 dark:hover:border-[#555]"
              : "border-none"
          }
          ${open ? "ring-1 ring-[#ff648b]/30 bg-black/5 dark:bg-[#333]" : ""}
        `}
      >
        <div className="flex items-center justify-start gap-2 overflow-hidden ">
          {current ? (
            <>
              {current.icon ? (
                <span
                  className={`${current.icon} shrink-0 opacity-70  text-gray-700 dark:text-white`}
                />
              ) : current.color ? (
                <span
                  className={
                    symbol === "dot"
                      ? "w-2.5 h-2.5 rounded-full shrink-0"
                      : `${symbol} shrink-0 text-xs`
                  }
                  style={{
                    [symbol === "dot" ? "backgroundColor" : "color"]:
                      current.color,
                  }}
                />
              ) : null}
            </>
          ) : null}

          <span className="truncate  text-gray-700 dark:text-white">
            {current ? current.label : placeholder}
          </span>
        </div>
        <span
          className={`absolute top-[25%] right-[10px] transition-transform duration-200 text-[10px text-gray-700${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <FloatingPortal>
          <ul
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              width: refs.domReference.current?.clientWidth,
              zIndex: 9999,
            }}
            {...getFloatingProps()}
            className="bg-white dark:!bg-[#232323] border border-black/10 dark:border-[#444] rounded-md list-none p-1 shadow-2xl overflow-y-auto box-border outline-none min-w-[12em] max-h-[15rem]"
          >
            {options.map((o, index) => (
              <li
                key={String(o.value)}
                ref={(el) => {
                  listItemsRef.current[index] = el;
                }}
                {...getItemProps({
                  onClick() {
                    onChange(o.value);
                    setOpen(false);
                  },
                })}
                className={`py-2 px-3 flex items-center gap-2 rounded cursor-pointer text-sm outline-none transition-colors
                      ${
                        activeIndex === index
                          ? "bg-black/5 dark:bg-[#333] text-black dark:text-white"
                          : "text-gray-700 dark:text-white"
                      }
                      hover:bg-black/5 dark:hover:bg-[#333]
                      ${value === o.value ? "!text-[#9d174d] font-bold" : ""}
                    `}
              >
                {o.icon ? (
                  <span className={`${o.icon} shrink-0 text-xs opacity-70`} />
                ) : (
                  o.color && (
                    <span
                      className={
                        symbol === "dot"
                          ? "w-2 h-2 rounded-full shrink-0"
                          : `${symbol} shrink-0`
                      }
                      style={{
                        [symbol === "dot" ? "backgroundColor" : "color"]:
                          o.color,
                      }}
                    />
                  )
                )}
                <span className="truncate">{o.label}</span>
              </li>
            ))}
          </ul>
        </FloatingPortal>
      )}
    </>
  );
};
