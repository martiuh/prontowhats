import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [],
  output: "static",
  vite: {
    define: {
      SEND_MESSAGE: process.env.NODE_ENV === "production",
    },

    plugins: [tailwindcss()],
  },
});
