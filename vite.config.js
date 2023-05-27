import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      minify: false,
      target: "es2015",
    }
  };
});
