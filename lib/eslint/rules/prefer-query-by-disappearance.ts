import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";

type MessageIds = "useQueryForDisappearance";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/radqut/testing-library-locators/blob/main/lib/eslint/rules/${name}.ts`,
);

export const preferQueryByDisappearance: RuleModule<MessageIds> = createRule({
  name: "prefer-query-by-disappearance",
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce using .query() for waitForElementToBeRemoved",
    },
    messages: {
      useQueryForDisappearance: "Use '.query()' instead of '.element()' for waitForElementToBeRemoved",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function findElementCall(node: any): any {
      if (!node) {
        return null;
      }

      if (node.type === "CallExpression") {
        const callee = node.callee;

        if (callee?.type === "MemberExpression") {
          const methodName = callee.property?.name;
          if (methodName === "element" || methodName === "query") {
            return callee;
          }
          if (methodName === "not") {
            return null;
          }
        }

        if (callee?.type === "Identifier" && callee.name === "waitForElementToBeRemoved") {
          if (node.arguments.length > 0) {
            const arg = node.arguments[0];
            if (arg.type === "CallExpression") {
              return findElementCall(arg);
            }
            if (arg.type === "ArrowFunctionExpression" || arg.type === "FunctionExpression") {
              if (arg.body?.type === "CallExpression") {
                return findElementCall(arg.body);
              }
            }
          }
        }
      }

      if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
        if (node.body?.type === "CallExpression") {
          return findElementCall(node.body);
        }
      }

      return null;
    }

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (callee?.type !== "Identifier" || callee.name !== "waitForElementToBeRemoved") {
          return;
        }

        const elementCallNode = findElementCall(node);
        if (elementCallNode?.property?.name === "element") {
          context.report({
            node: elementCallNode.property,
            messageId: "useQueryForDisappearance",
            fix(fixer) {
              return fixer.replaceText(elementCallNode.property, "query");
            },
          });
        }
      },
    };
  },
});
