import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: {} }, presets: [require("@card-settlement/ui/tailwind")] };
export default config;
