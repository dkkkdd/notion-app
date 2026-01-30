export const PRIORITY_OPTIONS = [
  {
    value: 4,
    label: "High",
    color: "rgb(229, 57, 53)",
    bg: "rgba(229, 56, 53, 0.1)",
  },
  {
    value: 3,
    label: "Medium",
    color: "rgb(255, 171, 0)",
    bg: "rgba(255, 170, 0, 0.1)",
  },
  {
    value: 2,
    label: "Low",
    color: "rgb(44, 53, 183)",
    bg: "rgba(44, 53, 183, 0.1)",
  },
  {
    value: 1,
    label: "Default",
    color: "#8c8c8c",
    bg: "transparent",
  },
];

type ColorOption = { value: string; label: string };
export const OPTIONS: ColorOption[] = [
  { label: "Grey", value: "#8c8c8c" },
  { label: "Pink", value: "#ff69b4" },
  { label: "Red", value: "#ff4d4f" },
  { label: "Orange", value: "#fa8c16" },
  { label: "Yellow", value: "#fadb14" },
  { label: "Green", value: "#52c41a" },
  { label: "Teal", value: "#13c2c2" },
  { label: "Blue", value: "#1677ff" },
  { label: "Purple", value: "#722ed1" },
  { label: "Magenta", value: "#eb2f96" },
];
