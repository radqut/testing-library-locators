import { Locator, type LocatorSelectors } from "./locator";
import { createQuerySelector } from "./create-query-selector";
import { ElementQuerySelector } from "./element-query-selector";
import { QuerySelector } from "./query-selector";

export { createQuerySelector, Locator, ElementQuerySelector, type LocatorSelectors };

export const locators = {
  extend(methods: {
    [K in keyof LocatorSelectors]?: (
      this: Locator,
      ...args: Parameters<LocatorSelectors[K]>
    ) => ReturnType<LocatorSelectors[K]> | QuerySelector;
  }) {
    for (const method in methods) {
      const cb = methods[method as keyof LocatorSelectors]!;

      // @ts-expect-error
      Locator.prototype[method] = function (...args: any[]) {
        // @ts-expect-error
        const selectorOrLocator = cb.call(this, ...args);

        if (selectorOrLocator instanceof QuerySelector) {
          return this.clone(selectorOrLocator);
        }

        return selectorOrLocator;
      };
    }
  },
};

export const page = new Locator(new ElementQuerySelector(document.body));
