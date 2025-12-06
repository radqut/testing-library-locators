import { QuerySelector } from "./query-selector";
import { HasQuerySelector } from "./has-query-selector";

export class NotQuerySelector<T extends HTMLElement = HTMLElement> extends QuerySelector<T> {
  #parent: QuerySelector<T>;

  constructor(parent: QuerySelector<T>) {
    super();

    this.#parent = parent;
  }

  query(): T | null {
    throw new Error("The NotQuerySelector does not support .query()");
  }

  element(): T {
    throw new Error("The NotQuerySelector does not support .element()");
  }

  elements(): T[] {
    throw new Error("The NotQuerySelector does not support .elements()");
  }

  find(): Promise<T> {
    throw new Error("The NotQuerySelector does not support .find()");
  }

  findAll(): Promise<T[]> {
    throw new Error("The NotQuerySelector does not support .findAll()");
  }

  nth(): QuerySelector<T> {
    throw new Error("The NotQuerySelector does not support .nth()");
  }

  first(): QuerySelector<T> {
    throw new Error("The NotQuerySelector does not support .first()");
  }

  last(): QuerySelector<T> {
    throw new Error("The NotQuerySelector does not support .last()");
  }

  has(selector: QuerySelector) {
    return new HasQuerySelector(this.#parent, selector, { inverse: true });
  }

  get not(): QuerySelector<T> {
    throw new Error("The NotQuerySelector does not support .not()");
  }

  clone<T extends HTMLElement = HTMLElement>(): QuerySelector<T> {
    throw new Error("The NotQuerySelector does not support .clone()");
  }

  debug() {
    throw new Error("The NotQuerySelector does not support .debug()");
  }
}
