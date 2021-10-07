{
  "env": {
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "project": "tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "jest", "import"],
  "rules": {
    "no-console": "error",
    "semi": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "import/named": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "parent", "sibling", "index"]
      }
    ]
  }
}
