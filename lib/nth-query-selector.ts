import { screen } from "@testing-library/dom";
import { HasQuerySelector } from "./has-query-selector";
import { QuerySelector } from "./query-selector";
import { NotQuerySelector } from "./not-query-selector";

export class NthQuerySelector<T extends HTMLElement = HTMLElement> extends QuerySelector<T> {
  #parent: QuerySelector<T>;
  #index: number;

  constructor(parent: QuerySelector<T>, index: number) {
    super();

    this.#parent = parent;
    this.#index = index;
  }

  query() {
    return this.#parent.elements().at(this.#index) ?? null;
  }

  element() {
    const element = this.query();

    if (!element) {
      throw new Error(`NthQuerySelector: The element not found at ${this.#index} index`);
    }

    return element;
  }

  elements() {
    const element = this.query();

    return element ? [element] : [];
  }

  async find() {
    const elements = await this.#parent.findAll();
    const element = elements.at(this.#index);

    if (!element) {
      throw new Error(`NthQuerySelector: The element not found at ${this.#index} index`);
    }

    return element;
  }

  async findAll() {
    const element = await this.find();

    return [element];
  }

  nth(): QuerySelector<T> {
    throw new Error("The NthQuerySelector does not support .nth()");
  }

  first(): QuerySelector<T> {
    throw new Error("The NthQuerySelector does not support .first()");
  }

  last(): QuerySelector<T> {
    throw new Error("The NthQuerySelector does not support .last()");
  }

  has(selector: QuerySelector<T>): QuerySelector<T> {
    return new HasQuerySelector(this, selector);
  }

  get not(): QuerySelector<T> {
    return new NotQuerySelector(this);
  }

  clone<T extends HTMLElement = HTMLElement>(parent: QuerySelector<T>) {
    return new NthQuerySelector(parent, this.#index);
  }

  debug() {
    screen.debug(this.elements());
  }
}
