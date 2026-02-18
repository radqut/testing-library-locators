import type { BoundFunction, queries } from "@testing-library/dom";
import type { QuerySelector } from "./query-selector";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import {
  QueryByAltTextSelector,
  QueryByDisplayValueSelector,
  QueryByLabelTextSelector,
  QueryByPlaceholderTextSelector,
  QueryByRoleSelector,
  QueryByTestIdSelector,
  QueryByTextSelector,
  QueryByTitleSelector,
} from "./selectors";

interface LocatorOptions {
  userEvent: UserEvent;
}

export class Locator<T extends HTMLElement = HTMLElement> implements QuerySelector<T> {
  #selector: QuerySelector<T>;
  #options: LocatorOptions;

  /**
   * The selector is an object that will be used to locate the element.
   */
  get selector() {
    return this.#selector;
  }

  get options() {
    return this.#options;
  }

  constructor(selector: QuerySelector<T>, options: Partial<LocatorOptions> = {}) {
    options.userEvent ??= userEvent.setup();

    this.#selector = selector;
    this.#options = options as LocatorOptions;
  }

  /**
   * This method returns a single element matching the locator's selector or null if no element is found.
   */
  query() {
    return this.#selector.query();
  }

  /**
   * This method returns a single element matching the locator's selector.
   */
  element() {
    return this.#selector.element();
  }

  /**
   * This method returns an array of elements matching the locator's selector.
   */
  elements() {
    return this.#selector.elements();
  }

  /**
   * This method returns a promise that resolves to the first element matching the locator's selector.
   */
  find() {
    return this.#selector.find();
  }

  /**
   * This method returns a promise that resolves to all elements matching the locator's selector.
   */
  findAll() {
    return this.#selector.findAll();
  }

  /**
   * This method returns a new locator that matches only a specific index within a multi-element query result.
   * It's zero based, `nth(0)` selects the first element.
   */
  nth(index: number) {
    return this.clone(this.#selector.nth(index));
  }

  /**
   * This method returns a new locator that matches only the first index of a multi-element query result.
   * It is sugar for `nth(0)`.
   */
  first() {
    return this.clone(this.#selector.first());
  }

  /**
   * This method returns a new locator that matches only the last index of a multi-element query result.
   * It is sugar for nth(-1).
   */
  last() {
    return this.clone(this.#selector.last());
  }

  /**
   * This options narrows down the selector to match elements that contain other elements matching provided locator.
   */
  has(locator: Locator) {
    return this.clone(this.#selector.has(locator.selector));
  }

  /**
   * This option narrows down the selector to match elements that do not contain other elements matching provided locator.
   */
  get not() {
    return this.clone(this.selector.not);
  }

  /**
   * This method prints a single element matching the locator's selector. Equivalent to `screen.debug()`.
   * @see {@link https://testing-library.com/docs/dom-testing-library/api-debugging/#screendebug}
   */
  debug() {
    this.#selector.debug();
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/byrole}
   */
  getByRole<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByRole<T>>>) {
    return this.clone(new QueryByRoleSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/bylabeltext}
   */
  getByLabelText<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByLabelTextSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/byplaceholdertext}
   */
  getByPlaceholderText<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByPlaceholderTextSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/bytext}
   */
  getByText<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByTextSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/bydisplayvalue}
   */
  getByDisplayValue<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByDisplayValueSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/byalttext}
   */
  getByAltText<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByAltTextSelector(this.#selector, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/bytitle}
   */
  getByTitle<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByTitleSelector(this, ...args));
  }

  /**
   * @see {@link https://testing-library.com/docs/queries/bytestid}
   */
  getByTestId<T extends HTMLElement = HTMLElement>(...args: Parameters<BoundFunction<queries.GetByText<T>>>) {
    return this.clone(new QueryByTestIdSelector(this, ...args));
  }

  /**
   * Equivalent to `userEvent.setup()`.
   * @see {@link https://testing-library.com/docs/user-event/setup}
   */
  setup(...args: Parameters<UserEvent["setup"]>) {
    return this.clone(this.#selector, {
      userEvent: this.#options.userEvent.setup(...args),
    });
  }

  /**
   * Click on an element. Equivalent to `userEvent.click()`.
   * @see {@link https://testing-library.com/docs/user-event/convenience#click}
   */
  async click() {
    const element = await this.#selector.find();

    return this.#options.userEvent.click(element);
  }

  /**
   * Triggers a double click event on an element. Equivalent to `userEvent.dblClick()`.
   * @see {@link https://testing-library.com/docs/user-event/convenience#dblclick}
   */
  async dblClick() {
    const element = await this.#selector.find();

    return this.#options.userEvent.dblClick(element);
  }

  /**
   * Triggers a triple click event on an element. Equivalent to `userEvent.tripleClick()`.
   * @see {@link https://testing-library.com/docs/user-event/convenience#tripleclick}
   */
  async tripleClick() {
    const element = await this.#selector.find();

    return this.#options.userEvent.tripleClick(element);
  }

  /**
   * Hover an element. Equivalent to `userEvent.hover()`.
   * @see {@link https://testing-library.com/docs/user-event/convenience#hover}
   */
  async hover() {
    const element = await this.#selector.find();

    return this.#options.userEvent.hover(element);
  }

  /**
   * Unhover an element. Equivalent to `userEvent.unhover()`.
   * @see {@link https://testing-library.com/docs/user-event/convenience#unhover}
   */
  async unhover() {
    const element = await this.#selector.find();

    return this.#options.userEvent.unhover(element);
  }

  /**
   * Clears the input element content. Equivalent to `userEvent.clear()`.
   * @see {@link https://testing-library.com/docs/user-event/utility#clear}
   */
  async clear() {
    const element = await this.#selector.find();

    return this.#options.userEvent.clear(element);
  }

  /**
   * Sets the value of the current input, textarea or contenteditable element. Equivalent to `userEvent.type()`.
   * @see {@link https://testing-library.com/docs/user-event/utility#type}
   */
  async type(text: string) {
    const element = await this.#selector.find();

    return this.#options.userEvent.type(element, text);
  }

  /**
   * Select the given options in an HTMLSelectElement or listbox. Equivalent to `userEvent.selectOptions()`.
   * @see {@link https://testing-library.com/docs/user-event/utility#-selectoptions-deselectoptions}
   */
  async selectOptions(...args: Parameters<BoundFunction<UserEvent["selectOptions"]>>) {
    const element = await this.#selector.find();

    return this.#options.userEvent.selectOptions(element, ...args);
  }

  /**
   * Deselect the given options in an HTMLSelectElement or listbox. Equivalent to `userEvent.deselectOptions()`.
   * @see {@link https://testing-library.com/docs/user-event/utility#-selectoptions-deselectoptions}
   */
  async deselectOptions(...args: Parameters<BoundFunction<UserEvent["deselectOptions"]>>) {
    const element = await this.#selector.find();

    return this.#options.userEvent.deselectOptions(element, ...args);
  }

  /**
   * Equivalent to `userEvent.upload()`.
   * @see {@link https://testing-library.com/docs/user-event/utility#upload}
   */
  async upload(...args: Parameters<BoundFunction<UserEvent["upload"]>>) {
    const element = await this.#selector.find();

    return this.#options.userEvent.upload(element, ...args);
  }

  clone<T extends HTMLElement = HTMLElement>(selector: QuerySelector<T>, options?: Partial<LocatorOptions>) {
    return new Locator(selector, { ...this.#options, ...options });
  }
}

export interface LocatorSelectors {}

export interface Locator extends LocatorSelectors {}
