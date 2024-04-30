module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
  ],
  rules: {
    "no-shadow": 0,
    "@typescript-eslint/no-shadow": ["error"],
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": ["error"],
    complexity: ["error", 10],
    "no-await-in-loop": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "prefer-promise-reject-errors": "warn",
  },
};
