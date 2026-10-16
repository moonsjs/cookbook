import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import moons from "@moonsjs/vite";

export default defineConfig({
  plugins: [tailwindcss(), moons({ leakTest: { canary: "MOONS_COOKBOOK_CANARY_4e8b12" } })],
});
