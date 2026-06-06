import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  {
    plugins: {
      boundaries,
    },

    settings: {
      "boundaries/elements": [
        {
          type: "app",
          pattern: "src/app/*",
        },
        {
          type: "shared",
          pattern: "src/shared/*",
        },
        {
          type: "auth",
          pattern: "src/features/auth/*",
        },
        {
          type: "employee",
          pattern: "src/features/employee/*",
        },
        {
          type: "attendance",
          pattern: "src/features/attendance/*",
        },
        {
          type: "interview",
          pattern: "src/features/interview/*",
        },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",

          rules: [
            // APP
            {
              from: "app",
              allow: [
                "app",
                "shared",
                "auth",
                "employee",
                "attendance",
                "interview",
              ],
            },

            // SHARED
            {
              from: "shared",
              allow: ["shared"],
            },

            // AUTH
            {
              from: "auth",
              allow: ["auth", "shared"],
            },

            // EMPLOYEE
            {
              from: "employee",
              allow: ["employee", "shared"],
            },

            // ATTENDANCE
            {
              from: "attendance",
              allow: ["attendance", "shared"],
            },

            // INTERVIEW
            {
              from: "interview",
              allow: ["interview", "shared"],
            },
          ],
        },
      ],
    },
  },
]);
