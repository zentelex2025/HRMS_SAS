import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],

    plugins: {
      js,
      react: pluginReact,
      import: importPlugin,
    },

    extends: ["js/recommended"],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // =========================
            // FEATURE ISOLATION
            // =========================

            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
            },

            {
              target: "./src/features/employee",
              from: "./src/features",
              except: ["./employee"],
            },

            {
              target: "./src/features/attendance",
              from: "./src/features",
              except: ["./attendance"],
            },

            {
              target: "./src/features/payroll",
              from: "./src/features",
              except: ["./payroll"],
            },

            {
              target: "./src/features/leave",
              from: "./src/features",
              except: ["./leave"],
            },

            {
              target: "./src/features/leave-approval",
              from: "./src/features",
              except: ["./leave-approval"],
            },

            {
              target: "./src/features/holiday",
              from: "./src/features",
              except: ["./holiday"],
            },

            {
              target: "./src/features/recruitment",
              from: "./src/features",
              except: ["./recruitment"],
            },

            {
              target: "./src/features/training",
              from: "./src/features",
              except: ["./training"],
            },

            {
              target: "./src/features/confirmation",
              from: "./src/features",
              except: ["./confirmation"],
            },

            {
              target: "./src/features/reports",
              from: "./src/features",
              except: ["./reports"],
            },

            // =========================
            // SHARED CANNOT IMPORT FEATURES
            // =========================

            {
              target: "./src/shared",
              from: "./src/features",
            },

            // =========================
            // CONFIG CANNOT IMPORT FEATURES
            // =========================

            {
              target: "./src/config",
              from: "./src/features",
            },

            // =========================
            // DATABASE CANNOT IMPORT FEATURES
            // =========================

            {
              target: "./src/database",
              from: "./src/features",
            },

            // =========================
            // APP CANNOT IMPORT SHARED SERVICES DIRECTLY
            // ONLY ROUTES / FEATURES
            // =========================

            {
              target: "./src/app",
              from: "./src/shared/services",
            },
          ],
        },
      ],
    },
  },
]);
