import { type GetAllBy, type QueryBy, type GetBy, type FindAllBy, type FindBy, screen } from "@testing-library/dom";
import { NthQuerySelector } from "./nth-query-selector";
import { QuerySelector } from "./query-selector";
import { HasQuerySelector } from "./has-query-selector";
import { NotQuerySelector } from "./not-query-selector";

export function createQuerySelector<Args extends any[]>(
  queryAllBy: GetAllBy<Args>,
  queryBy: QueryBy<Args>,
  _getAllBy: GetAllBy<Args>,
  getBy: GetBy<Args>,
  findAllBy: FindAllBy<Args>,
  findBy: FindBy<Args>,
  // TODO: remove this type when the issue will be resolved
  // @link https://github.com/microsoft/TypeScript/issues/58020
): new (parent: QuerySelector, ...args: Args) => QuerySelector {
  return class CustomQuerySelector<T extends HTMLElement = HTMLElement> extends QuerySelector<T> {
    #parent: QuerySelector;
    #args: Args;

    constructor(parent: QuerySelector, ...args: Args) {
      super();

      this.#parent = parent;
      this.#args = args;
    }

    query() {
      const element = this.#parent.query();

      if (!element) {
        return null;
      }

      return queryBy(element, ...this.#args) as T | null;
    }

    element() {
      return getBy(this.#parent.element(), ...this.#args) as T;
    }

    elements() {
      const element = this.#parent.query();

      if (!element) {
        return [];
      }

      return queryAllBy(element, ...this.#args) as T[];
    }

    async find() {
      const element = await this.#parent.find();

      // @ts-expect-error
      return findBy(element, ...this.#args) as Promise<T>;
    }

    async findAll() {
      const element = await this.#parent.find();

      // @ts-expect-error
      return findAllBy(element, ...this.#args) as Promise<T[]>;
    }

    nth(index: number): QuerySelector<T> {
      return new NthQuerySelector<T>(this, index);
    }

    first() {
      return this.nth(0);
    }

    last() {
      return this.nth(-1);
    }

    has(selector: QuerySelector): QuerySelector<T> {
      return new HasQuerySelector<T>(this, selector);
    }

    get not(): QuerySelector<T> {
      return new NotQuerySelector(this);
    }

    clone(parent: QuerySelector) {
      return new CustomQuerySelector(parent, ...this.#args);
    }

    debug() {
      screen.debug(this.elements());
    }
  };
}
