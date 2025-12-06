import { QuerySelector } from "./query-selector";
import { HasQuerySelector } from "./has-query-selector";
import { screen } from "@testing-library/dom";
import { NotQuerySelector } from "./not-query-selector";

export class ElementQuerySelector<T extends HTMLElement = HTMLElement> extends QuerySelector<T> {
  #element: T;

  constructor(element: T) {
    super();

    this.#element = element;
  }

  query() {
    return this.#element;
  }

  element() {
    return this.query();
  }

  elements() {
    return [this.query()];
  }

  find() {
    return Promise.resolve(this.element());
  }

  findAll() {
    return Promise.resolve(this.elements());
  }

  nth(): QuerySelector<T> {
    throw new Error("The ElementQuerySelector does not support .nth()");
  }

  first(): QuerySelector<T> {
    throw new Error("The ElementQuerySelector does not support .first()");
  }

  last(): QuerySelector<T> {
    throw new Error("The ElementQuerySelector does not support .last()");
  }

  has(selector: QuerySelector): QuerySelector<T> {
    return new HasQuerySelector(this, selector);
  }

  get not(): QuerySelector<T> {
    return new NotQuerySelector(this);
  }

  clone() {
    return new ElementQuerySelector(this.#element);
  }

  debug() {
    screen.debug(this.element());
  }
}
