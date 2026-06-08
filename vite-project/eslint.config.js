import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],

    plugins: {
      js,
      react: pluginReact,
      import: importPlugin,
    },

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // =========================
            // AUTH
            // =========================

            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
            },

            // =========================
            // EMPLOYEE
            // =========================

            {
              target: "./src/features/employee",
              from: "./src/features",
              except: ["./employee"],
            },

            // =========================
            // ATTENDANCE
            // =========================

            {
              target: "./src/features/attendance",
              from: "./src/features",
              except: ["./attendance"],
            },

            // =========================
            // INTERVIEW
            // =========================

            {
              target: "./src/features/interview",
              from: "./src/features",
              except: ["./interview"],
            },

            // =========================
            // SHARED CANNOT IMPORT FEATURES
            // =========================

            {
              target: "./src/shared",
              from: "./src/features",
            },

            // =========================
            // SHARED CANNOT IMPORT APP
            // =========================

            {
              target: "./src/shared",
              from: "./src/app",
            },

            // =========================
            // FEATURES CANNOT IMPORT APP
            // =========================

            {
              target: "./src/features",
              from: "./src/app",
            },
          ],
        },
      ],
    },
  },
]);
