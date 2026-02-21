import { expect } from "vitest";
import { chai, type PromisifyAssertion } from "@vitest/expect";
import { waitFor, type waitForOptions } from "@testing-library/dom";
import type { Locator } from "./locator";

declare module "vitest" {
  interface ExpectStatic {
    element<T extends HTMLElement>(locator: Locator<T>, options?: waitForOptions): PromisifyAssertion<T>;
  }
}

expect.element = createExpectPoll();

// @link https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/integrations/chai/poll.ts#L48
function createExpectPoll() {
  return function <T extends HTMLElement>(locator: Locator, options?: waitForOptions): PromisifyAssertion<T> {
    const assertion = expect(null);

    const proxy: any = new Proxy(assertion, {
      get(target, key, receiver) {
        const assertionFunction = Reflect.get(target, key, receiver);

        if (typeof assertionFunction !== "function") {
          return assertionFunction instanceof chai.Assertion ? proxy : assertionFunction;
        }

        return function (this: any, ...args: any[]) {
          const isLengthAssertion = key === "toHaveLength";
          const promise = () =>
            waitFor(async () => {
              const el = isLengthAssertion ? locator.elements() : locator.query();

              chai.util.flag(assertion, "object", el);

              return assertionFunction.call(assertion, ...args);
            }, options);

          let resultPromise: Promise<void> | undefined;

          return {
            then(onFulfilled, onRejected) {
              return (resultPromise ||= promise()).then(onFulfilled, onRejected);
            },
            catch(onRejected) {
              return (resultPromise ||= promise()).catch(onRejected);
            },
            finally(onFinally) {
              return (resultPromise ||= promise()).finally(onFinally);
            },
            [Symbol.toStringTag]: "Promise",
          } satisfies Promise<void>;
        };
      },
    });

    return proxy;
  };
}
