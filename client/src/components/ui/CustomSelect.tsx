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
        className={`focus:outline-none focus:border-[#888] focus:ring-1 focus:ring-white/20 relative w-full min-h-[38px] flex items-center justify-between px-3 gap-2 !bg-[#242424] border-[0.5px] border-[#d0d0d05a]/60 hover:border-[#888] rounded-lg cursor-pointer outline-none box-border pr-7 ${
          open ? "ring-1 ring-[#ff648b]/30 border-[#ff648b]" : ""
        }`}
      >
        <div className="flex items-center justify-start gap-2 overflow-hidden text-sm">
          {current ? (
            <>
              {current.icon ? (
                <span
                  className={`${current.icon} shrink-0 text-xs opacity-70`}
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

          <span className="truncate text-white/90">
            {current ? current.label : placeholder}
          </span>
        </div>
        <span
          className={`absolute top-[25%] right-[10px] transition-transform duration-200 ${
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
            className="!bg-[#222] border border-[#88888833] rounded-lg list-none p-1 shadow-2xl overflow-y-auto box-border  outline-none  min-w-[12em] max-h-[15rem]"
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
                className={`py-2 px-3 flex items-center gap-2 rounded-md cursor-pointer text-sm outline-none
                      ${
                        activeIndex === index
                          ? "bg-white/10 text-white"
                          : "text-white/80"
                      }
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
