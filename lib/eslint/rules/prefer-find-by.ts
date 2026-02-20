import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";

type MessageIds = "useFindBy";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/radqut/testing-library-locators/blob/main/lib/eslint/rules/${name}.ts`,
);

export const preferFindBy: RuleModule<MessageIds> = createRule({
  name: "prefer-find-by",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer findBy queries and waitForElementToBeRemoved over waitFor with element/query",
    },
    messages: {
      useFindBy: "{{replacement}}",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function isGetByMethod(name: string): boolean {
      return name.startsWith("getBy") || name.startsWith("queryBy") || name.startsWith("findBy");
    }

    return {
      CallExpression(node) {
        const callee = node.callee as any;

        if (callee?.type !== "Identifier" || callee.name !== "waitFor") {
          return;
        }

        if (node.arguments.length === 0) {
          return;
        }

        const arg = node.arguments[0];
        let callbackBody: any = null;

        if (arg.type === "ArrowFunctionExpression" || arg.type === "FunctionExpression") {
          if (arg.body) {
            if (arg.body.type === "CallExpression") {
              callbackBody = arg.body;
            } else if (arg.body.type === "BlockStatement" && arg.body.body.length > 0) {
              const firstStmt = arg.body.body[0];
              if (firstStmt.type === "ExpressionStatement" && firstStmt.expression.type === "CallExpression") {
                callbackBody = firstStmt.expression;
              }
            }
          }
        }

        if (!callbackBody) {
          return;
        }

        const callbackCallee = callbackBody.callee;

        if (callbackCallee?.type !== "MemberExpression") {
          return;
        }

        const matcherName = callbackCallee.property?.name;
        if (!matcherName) {
          return;
        }

        let expectCall = callbackCallee.object;
        if (!expectCall) {
          return;
        }

        if (expectCall.type === "MemberExpression" && expectCall.object?.type === "CallExpression") {
          expectCall = expectCall.object;
        } else if (!expectCall || expectCall.type !== "CallExpression") {
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
        if (!methodName || (methodName !== "element" && methodName !== "query" && methodName !== "elements")) {
          return;
        }

        const queryCall = locatorCallee.object;
        if (!queryCall || queryCall.type !== "CallExpression") {
          return;
        }

        const queryCallCallee = queryCall.callee;
        if (!queryCallCallee || queryCallCallee.type !== "MemberExpression") {
          return;
        }

        const queryMethod = queryCallCallee.property?.name;
        if (!queryMethod || !isGetByMethod(queryMethod)) {
          return;
        }

        const sourceCode = context.sourceCode.getText();
        const queryCallText = sourceCode.slice(queryCall.range[0], queryCall.range[1]);

        let isNegative = false;
        if (matcherName === "toBeInTheDocument" && callbackCallee.object?.type === "MemberExpression") {
          if (callbackCallee.object.property?.name === "not") {
            isNegative = true;
          }
        }

        if (methodName === "element" && matcherName === "toBeInTheDocument" && !isNegative) {
          context.report({
            node: node,
            messageId: "useFindBy",
            data: {
              replacement: `expect(${queryCallText}.find()).resolves.toBeInTheDocument()`,
            },
            fix(fixer) {
              return fixer.replaceText(node, `expect(${queryCallText}.find()).resolves.toBeInTheDocument()`);
            },
          });
        }

        if (methodName === "elements" && matcherName === "toHaveLength") {
          context.report({
            node: node,
            messageId: "useFindBy",
            data: {
              replacement: `expect(${queryCallText}.findAll()).resolves.toHaveLength(2)`,
            },
            fix(fixer) {
              return fixer.replaceText(node, `expect(${queryCallText}.findAll()).resolves.toHaveLength(2)`);
            },
          });
        }

        if (methodName === "query" && isNegative && matcherName === "toBeInTheDocument") {
          const locatorText = sourceCode.slice(locatorCall.range[0], locatorCall.range[1]);

          context.report({
            node: node,
            messageId: "useFindBy",
            data: {
              replacement: `waitForElementToBeRemoved(${locatorText})`,
            },
            fix(fixer) {
              return fixer.replaceText(node, `waitForElementToBeRemoved(${locatorText})`);
            },
          });
        }
      },
    };
  },
});
