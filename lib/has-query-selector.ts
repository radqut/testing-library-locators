import { QuerySelector } from "./query-selector";
import { ElementQuerySelector } from "./element-query-selector";
import { NthQuerySelector } from "./nth-query-selector";
import { screen, waitFor } from "@testing-library/dom";
import { NotQuerySelector } from "./not-query-selector";

interface HasQuerySelectorOptions {
  inverse: boolean;
}

export class HasQuerySelector<T extends HTMLElement = HTMLElement> extends QuerySelector<T> {
  #parent: QuerySelector<T>;
  #selector: QuerySelector;
  #options: HasQuerySelectorOptions;

  constructor(parent: QuerySelector<T>, selector: QuerySelector, options: Partial<HasQuerySelectorOptions> = {}) {
    super();

    options.inverse ??= false;

    this.#parent = parent;
    this.#selector = selector;
    this.#options = options as HasQuerySelectorOptions;
  }

  query() {
    const elements = this.elements();

    if (elements.length > 1) {
      throw new Error("HasQuerySelector: Found zero or greater than 1 element");
    }

    return elements.at(0) ?? null;
  }

  element() {
    const element = this.query();

    if (!element) {
      throw new Error("HasQuerySelector: The element not found");
    }

    return element;
  }

  elements() {
    const elements = this.#parent.elements();

    return elements.reduce((matches, element) => {
      const selector = this.#selector.clone(new ElementQuerySelector(element));

      const el = selector.query();

      if ((el && !this.#options.inverse) || (!el && this.#options.inverse)) {
        matches.push(element);
      }

      return matches;
    }, [] as T[]);
  }

  find() {
    return waitFor(() => this.element());
  }

  findAll() {
    return waitFor(() => {
      const elements = this.elements();

      if (!elements.length) {
        throw new Error("HasQuerySelector: Elements not found");
      }

      return elements;
    });
  }

  nth(index: number): QuerySelector<T> {
    return new NthQuerySelector<T>(this, index);
  }

  first(): QuerySelector<T> {
    return this.nth(0);
  }

  last(): QuerySelector<T> {
    return this.nth(-1);
  }

  has(selector: QuerySelector) {
    return new HasQuerySelector(this.#parent, selector, this.#options);
  }

  get not(): QuerySelector<T> {
    return new NotQuerySelector(this);
  }

  clone<T extends HTMLElement = HTMLElement>(parent: QuerySelector<T>) {
    return new HasQuerySelector(parent, this.#selector, this.#options);
  }

  debug() {
    screen.debug(this.elements());
  }
}
