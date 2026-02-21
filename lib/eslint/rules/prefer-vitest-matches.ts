import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";

type MessageIds = "useVitestMatches";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/radqut/testing-library-locators/blob/main/lib/eslint/rules/${name}.ts`,
);

const ELEMENT_METHODS = ["element", "query", "elements", "find", "findAll"];

export const preferVitestMatches: RuleModule<MessageIds> = createRule({
  name: "prefer-vitest-matches",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer expect.element() over expect with .element(), .query(), .elements(), .find(), .findAll()",
    },
    messages: {
      useVitestMatches: "Use '{{replacement}}' instead",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function isLocatorMethod(name: string): boolean {
      return ELEMENT_METHODS.includes(name);
    }

    return {
      CallExpression(node) {
        const callee = node.callee as any;

        if (callee?.type !== "MemberExpression") {
          return;
        }

        const matcherProperty = callee.property;
        if (!matcherProperty || matcherProperty.type !== "Identifier") {
          return;
        }

        const matcherName = matcherProperty.name;
        if (!matcherName) {
          return;
        }

        let expectCall = callee.object;
        let hasResolves = false;
        let hasNot = false;

        if (
          expectCall?.type === "MemberExpression" &&
          expectCall.property?.type === "Identifier" &&
          expectCall.property.name === "resolves"
        ) {
          hasResolves = true;
          expectCall = expectCall.object;
        }

        if (
          expectCall?.type === "MemberExpression" &&
          expectCall.property?.type === "Identifier" &&
          expectCall.property.name === "not"
        ) {
          hasNot = true;
          expectCall = expectCall.object;
        }

        if (
          !hasResolves &&
          expectCall?.type === "MemberExpression" &&
          expectCall.property?.type === "Identifier" &&
          expectCall.property.name === "resolves"
        ) {
          hasResolves = true;
          expectCall = expectCall.object;
        }

        if (!expectCall || expectCall.type !== "CallExpression") {
          return;
        }

        if (expectCall.callee?.type !== "Identifier" || expectCall.callee.name !== "expect") {
          return;
        }

        if (expectCall.arguments.length === 0) {
          return;
        }

        const locatorCall = expectCall.arguments[0];
        if (!locatorCall || locatorCall.type !== "CallExpression") {
          return;
        }

        const locatorCallee = locatorCall.callee;
        if (!locatorCallee || locatorCallee.type !== "MemberExpression") {
          return;
        }

        const methodName = locatorCallee.property?.name;
        if (!methodName || !isLocatorMethod(methodName)) {
          return;
        }

        const queryCall = locatorCallee.object;

        const sourceCode = context.sourceCode.getText();
        const queryCallText = sourceCode.slice(queryCall.range[0], queryCall.range[1]);
        const matcherArgsText = node.arguments
          .map((arg: any) => sourceCode.slice(arg.range[0], arg.range[1]))
          .join(", ");

        const expectType = "element";

        let replacement: string;
        const matcherCall = matcherArgsText ? `${matcherName}(${matcherArgsText})` : `${matcherName}()`;

        if (hasNot) {
          replacement = `expect.${expectType}(${queryCallText}).not.${matcherCall}`;
        } else {
          replacement = `expect.${expectType}(${queryCallText}).${matcherCall}`;
        }

        context.report({
          node: node,
          messageId: "useVitestMatches",
          data: {
            replacement,
          },
          fix(fixer) {
            return fixer.replaceText(node, replacement);
          },
        });
      },
    };
  },
});
