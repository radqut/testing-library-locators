import { RuleTester } from "@typescript-eslint/rule-tester";
import * as tsParser from "@typescript-eslint/parser";
import { preferPresenceQueries } from "./eslint/rules/prefer-presence-queries";
import { preferQueryByDisappearance } from "./eslint/rules/prefer-query-by-disappearance";
import { preferFindBy } from "./eslint/rules/prefer-find-by";
import { preferVitestMatches } from "./eslint/rules/prefer-vitest-matches";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
  },
});

ruleTester.run("prefer-presence-queries", preferPresenceQueries, {
  valid: [
    "expect(page.getByRole('button').element()).toBeInTheDocument()",
    "expect(page.getByRole('button').element()).not.toBeNull()",
    "expect(page.getByRole('button').query()).not.toBeInTheDocument()",
    "expect(page.getByRole('button').query()).toBeNull()",
  ],
  invalid: [
    {
      code: "expect(page.getByRole('button').query()).toBeInTheDocument()",
      output: "expect(page.getByRole('button').element()).toBeInTheDocument()",
      errors: [{ messageId: "useCorrectPresenceQuery" }],
    },
    {
      code: "expect(page.getByRole('button').query()).not.toBeNull()",
      output: "expect(page.getByRole('button').element()).not.toBeNull()",
      errors: [{ messageId: "useCorrectPresenceQuery" }],
    },
    {
      code: "expect(page.getByRole('button').element()).not.toBeInTheDocument()",
      output: "expect(page.getByRole('button').query()).not.toBeInTheDocument()",
      errors: [{ messageId: "useCorrectPresenceQuery" }],
    },
    {
      code: "expect(page.getByRole('button').element()).toBeNull()",
      output: "expect(page.getByRole('button').query()).toBeNull()",
      errors: [{ messageId: "useCorrectPresenceQuery" }],
    },
  ],
});

ruleTester.run("prefer-query-by-disappearance", preferQueryByDisappearance, {
  valid: [
    "waitForElementToBeRemoved(page.getByRole('button').query())",
    "waitForElementToBeRemoved(() => page.getByRole('button').query())",
  ],
  invalid: [
    {
      code: "waitForElementToBeRemoved(page.getByRole('button').element())",
      output: "waitForElementToBeRemoved(page.getByRole('button').query())",
      errors: [{ messageId: "useQueryForDisappearance" }],
    },
    {
      code: "waitForElementToBeRemoved(() => page.getByRole('button').element())",
      output: "waitForElementToBeRemoved(() => page.getByRole('button').query())",
      errors: [{ messageId: "useQueryForDisappearance" }],
    },
  ],
});

ruleTester.run("prefer-find-by", preferFindBy, {
  valid: [
    "expect(page.getByRole('button').find()).resolves.toBeInTheDocument()",
    "expect(page.getByRole('button').findAll()).resolves.toHaveLength(2)",
    "waitForElementToBeRemoved(page.getByRole('button').query())",
  ],
  invalid: [
    {
      code: "waitFor(() => expect(page.getByRole('button').element()).toBeInTheDocument())",
      output: "expect(page.getByRole('button').find()).resolves.toBeInTheDocument()",
      errors: [{ messageId: "useFindBy" }],
    },
    {
      code: "waitFor(() => expect(page.getByRole('button').elements()).toHaveLength(2))",
      output: "expect(page.getByRole('button').findAll()).resolves.toHaveLength(2)",
      errors: [{ messageId: "useFindBy" }],
    },
    {
      code: "waitFor(() => expect(page.getByRole('button').query()).not.toBeInTheDocument())",
      output: "waitForElementToBeRemoved(page.getByRole('button').query())",
      errors: [{ messageId: "useFindBy" }],
    },
  ],
});

ruleTester.run("prefer-vitest-matches", preferVitestMatches, {
  valid: [
    "expect.element(page.getByRole('button')).toBeInTheDocument()",
    "expect.element(page.getByRole('button')).not.toBeInTheDocument()",
    "expect.elements(page.getByRole('button')).toHaveLength(2)",
  ],
  invalid: [
    {
      code: "expect(page.getByRole('button').element()).toBeInTheDocument()",
      output: "expect.element(page.getByRole('button')).toBeInTheDocument()",
      errors: [{ messageId: "useVitestMatches" }],
    },
    {
      code: "expect(page.getByRole('button').query()).not.toBeInTheDocument()",
      output: "expect.element(page.getByRole('button')).not.toBeInTheDocument()",
      errors: [{ messageId: "useVitestMatches" }],
    },
    {
      code: "expect(page.getByRole('button').elements()).toHaveLength(2)",
      output: "expect.elements(page.getByRole('button')).toHaveLength(2)",
      errors: [{ messageId: "useVitestMatches" }],
    },
    {
      code: "expect(page.getByRole('button').find()).resolves.toBeInTheDocument()",
      output: "expect.element(page.getByRole('button')).toBeInTheDocument()",
      errors: [{ messageId: "useVitestMatches" }],
    },
    {
      code: "expect(page.getByRole('button').findAll()).resolves.toHaveLength(2)",
      output: "expect.elements(page.getByRole('button')).toHaveLength(2)",
      errors: [{ messageId: "useVitestMatches" }],
    },
  ],
});
