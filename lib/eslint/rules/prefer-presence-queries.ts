import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";

type MessageIds = "useCorrectPresenceQuery";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/radqut/testing-library-locators/blob/main/lib/eslint/rules/${name}.ts`,
);

const NEGATIVE_MATCHERS = ["not.toBeInTheDocument", "toBeNull"];
const POSITIVE_MATCHERS = ["toBeInTheDocument", "not.toBeNull"];

export const preferPresenceQueries: RuleModule<MessageIds> = createRule({
  name: "prefer-presence-queries",
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce using .element() for presence checks and .query() for absence checks",
    },
    messages: {
      useCorrectPresenceQuery: "Use '{{correct}}' instead of '{{incorrect}}' for {{matcher}}",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function getMethodName(node: any): string | null {
      if (node.type !== "MemberExpression") {
        return null;
      }
      if (node.object?.type === "MemberExpression" && node.object.property?.type === "Identifier") {
        const notPart = node.object.property.name === "not" ? "not." : "";
        if (node.property?.type === "Identifier") {
          return notPart + node.property.name;
        }
      }
      if (node.property?.type === "Identifier") {
        return node.property.name;
      }
      return null;
    }

    function getQueryMethodFromCallExpression(node: any): "element" | "query" | null {
      if (!node || node.type !== "CallExpression") {
        return null;
      }
      const callee = node.callee;
      if (callee?.type === "MemberExpression") {
        if (
          callee.property?.type === "Identifier" &&
          (callee.property.name === "element" || callee.property.name === "query")
        ) {
          return callee.property.name;
        }
      }
      return null;
    }

    function getQueryMethod(node: any): "element" | "query" | null {
      if (!node || node.type !== "CallExpression") {
        return null;
      }
      const callee = node.callee;

      if (callee?.type === "MemberExpression") {
        if (
          callee.property?.type === "Identifier" &&
          (callee.property.name === "element" || callee.property.name === "query")
        ) {
          return callee.property.name;
        }
      } else if (callee?.type === "Identifier" && callee.name === "expect") {
        if (node.arguments.length > 0 && node.arguments[0].type === "CallExpression") {
          const expectArg = node.arguments[0];
          return getQueryMethodFromCallExpression(expectArg);
        }
      }
      return null;
    }

    function findQueryMethodNode(node: any, isNegative: boolean): any {
      if (!node || node.type !== "CallExpression") {
        return null;
      }
      const callee = node.callee;

      if (callee?.type === "Identifier" && callee.name === "expect") {
        if (node.arguments.length > 0 && node.arguments[0].type === "CallExpression") {
          return findQueryMethodNode(node.arguments[0], isNegative);
        }
      }

      if (callee?.type === "MemberExpression") {
        const propertyName = callee.property?.name;
        if (propertyName === "not") {
          if (callee.object?.type === "CallExpression") {
            return findQueryMethodNode(callee.object, true);
          }
        } else if (propertyName === "toBeInTheDocument" || propertyName === "toBeNull") {
          if (node.callee.object?.type === "CallExpression") {
            return findQueryMethodNode(node.callee.object, isNegative);
          }
          if (
            node.callee.object?.type === "MemberExpression" &&
            node.callee.object.property?.name === "not" &&
            node.callee.object.object?.type === "CallExpression"
          ) {
            return findQueryMethodNode(node.callee.object.object, true);
          }
        } else if (propertyName === "element" || propertyName === "query") {
          return callee;
        }
      }
      return null;
    }

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee?.type !== "MemberExpression") {
          return;
        }

        const matcherName = getMethodName(callee);
        if (!matcherName) {
          return;
        }

        const object = callee.object;
        let queryMethod: "element" | "query" | null = null;

        if (object?.type === "CallExpression") {
          queryMethod = getQueryMethod(object);
        } else if (
          object?.type === "MemberExpression" &&
          object.property?.type === "Identifier" &&
          object.property.name === "not" &&
          object.object?.type === "CallExpression"
        ) {
          queryMethod = getQueryMethod(object.object);
        }

        if (!queryMethod) {
          return;
        }

        const isNegative = NEGATIVE_MATCHERS.includes(matcherName);
        const isPositive = POSITIVE_MATCHERS.includes(matcherName);

        if (!isNegative && !isPositive) {
          return;
        }

        let correctMethod: string;
        let incorrectMethod: string;

        if (isNegative) {
          correctMethod = "query";
          incorrectMethod = queryMethod;
        } else {
          correctMethod = "element";
          incorrectMethod = queryMethod;
        }

        if (queryMethod === correctMethod) {
          return;
        }

        context.report({
          node: node,
          messageId: "useCorrectPresenceQuery",
          data: {
            correct: correctMethod,
            incorrect: incorrectMethod,
            matcher: matcherName,
          },
          fix(fixer) {
            const queryMethodNode = findQueryMethodNode(node, isNegative);
            if (queryMethodNode?.property) {
              return fixer.replaceText(queryMethodNode.property, correctMethod);
            }
            return null;
          },
        });
      },
    };
  },
});
