# Testing Library Locators

> Chainable and reusable locators for Testing Library

A lightweight library that provides Testing Library-style query methods (like `getByRole`, `getByText`, `getByLabelText`) with chainable locator patterns, inspired by [Vitest Browser Mode Locators](https://vitest.dev/api/browser/locators.html) and [Playwright's locator API](https://playwright.dev/docs/locators).

## Features

- **Fully compatible with Testing Library** - Use familiar queries like `getByRole`, `getByLabelText`, `getByText`
- **Chainable API** - Compose complex reusable selectors like `getByRole("list").getByRole("listitem").nth(2)`
- **Extendable** - Create custom locators to fit your project's needs
- **Lightweight** - Small bundle size with minimal overhead
- **TypeScript support** - Fully typed API with excellent IntelliSense

## Installation

```bash
npm add -D testing-library-locators
```

```bash
yarn add -D testing-library-locators
```

```bash
pnpm add -D testing-library-locators
```

### Peer dependencies

Please note that `@testing-library/dom` and `@testing-library/user-event` are peer dependencies, meaning you should ensure they are installed before installing `testing-library-locators`.

## Quick Start

```typescript
import { page } from "testing-library-locators";

// Find elements using accessible queries
const submitButton = page.getByRole("button", { name: "Submit" });
const emailInput = page.getByLabelText("Email address");
const welcomeText = page.getByText("Welcome back!");

// Chain locators to narrow down selection
const deleteButton = page.getByRole("article").getByRole("button", { name: "Delete" });

// Interact with elements
await submitButton.click();
await emailInput.type("user@example.com");

// Assert element presence
expect(submitButton.element()).toBeInTheDocument();
expect(welcomeText.query()).not.toBeInTheDocument();
```

## Core Concepts

### Locators

A locator is a representation of an element or a number of elements. Locators are lazy - they don't find elements immediately but wait until an action is performed.

```typescript
// This doesn't find the element yet
const button = page.getByRole("button", { name: "Click" });

// Element is located when you perform an action
await button.click(); // ✅ Finds element and clicks
```

### `getByRole`

Creates a way to locate an element by its ARIA role, ARIA attributes and accessible name.

```html
<h3>Sign up</h3>
<label>
  Login
  <input type="text" />
</label>
<label>
  Password
  <input type="password" />
</label>
<br />
<button>Submit</button>
```

```typescript
expect(page.getByRole("heading", { name: "Sign up" }).element()).toBeInTheDocument();

await page.getByRole("textbox", { name: "Login" }).type("admin");
await page.getByRole("textbox", { name: "Password" }).type("admin");

await page.getByRole("button", { name: /submit/i }).click();
```

#### See also

- [testing-library's ByRole](https://testing-library.com/docs/queries/byrole)

### `getByLabelText`

Creates a locator capable of finding an element that has an associated label.

```html
// for/htmlFor relationship between label and form element id
<label for="username-input">Username</label>
<input id="username-input" />

// The aria-labelledby attribute with form elements
<label id="username-label">Username</label>
<input aria-labelledby="username-label" />

// Wrapper labels
<label>Username <input /></label>

// Wrapper labels where the label text is in another child element
<label>
  <span>Username</span>
  <input />
</label>

// aria-label attributes // Take care because this is not a label that users can see on the page, // so the purpose of
your input must be obvious to visual users.
<input aria-label="Username" />
```

```typescript
page.getByLabelText("Username");
```

#### See also

- [testing-library's ByLabelText](https://testing-library.com/docs/queries/bylabeltext/)

### `getByPlaceholderText`

Creates a locator capable of finding an element that has the specified placeholder attribute.

```html
<input placeholder="Username" />
```

```typescript
page.getByPlaceholderText("Username");
```

#### See also

- [testing-library's ByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext/)

### `getByText`

Creates a locator capable of finding an element that contains the specified text.

```html
<a href="/about">About ℹ️</a>
```

```typescript
page.getByText(/about/i);
```

#### See also

- [testing-library's ByText](https://testing-library.com/docs/queries/bytext)

### `getByDisplayValue`

Creates a locator capable of finding the input, textarea, or select element that has the matching display value.

```html
<input type="text" id="lastName" value="Norris" />
```

```typescript
page.getByDisplayValue("Norris");
```

#### See also

- [testing-library's ByDisplayValue](https://testing-library.com/docs/queries/bydisplayvalue)

### `getByAltText`

Creates a locator capable of finding a element (normally an <img>) that has the given alt text.

```html
<img alt="Incredibles 2 Poster" src="/incredibles-2.png" />
```

```typescript
page.getByAltText(/incredibles.*? poster/i);
```

#### See also

- [testing-library's ByAltText](https://testing-library.com/docs/queries/byalttext)

### `getByTitle`

Creates a locator capable of finding an element that has the specified title attribute.

```html
<span title="Delete" id="2"></span>
```

```typescript
page.getByTitle("Delete");
```

#### See also

- [testing-library's ByTitle](https://testing-library.com/docs/queries/bytitle)

### `getByTestId`

Creates a locator capable of finding an element that matches the specified test id attribute.

```html
<div data-testid="custom-element" />
```

```typescript
page.getByTestId("custom-element");
```

#### See also

- [testing-library's ByTestId](https://testing-library.com/docs/queries/bytestid)

### `nth`

This method returns a new locator that matches only a specific index within a multi-element query result. It's zero based, `nth(0)` selects the first element.

```html
<div aria-label="one"><input /><input /><input /></div>
<div aria-label="two"><input /></div>
```

```typescript
page.getByRole("textbox").nth(0); // ✅
page.getByRole("textbox").nth(4); // ❌
```

### `first`

This method returns a new locator that matches only the first index of a multi-element query result. It is sugar for `nth(0)`.

```html
<input /> <input /> <input />
```

```typescript
page.getByRole("textbox").first();
```

### `last`

This method returns a new locator that matches only the last index of a multi-element query result. It is sugar for `nth(-1)`.

```html
<input /> <input /> <input />
```

```typescript
page.getByRole("textbox").last();
```

### `has`

This options narrows down the selector to match elements that contain other elements matching provided locator.

```html
<article>
  <div>First</div>
</article>
<article>
  <div>Second</div>
</article>
```

```typescript
page.getByRole("article").has(page.getByText("First")); // ✅
```

### `not`

This option narrows down the selector to match elements that do not contain other elements matching provided locator.

```html
<article>
  <div>First</div>
</article>
<article>
  <div>Second</div>
</article>
```

```typescript
page.getByRole("article").not.has(page.getByText("First")); // ✅
```

### `element`

This method returns a single element matching the locator's selector. If no element matches the selector, an error is thrown.

```html
<div>Hello World</div>
```

```typescript
page.getByText("Hello World").element(); // ✅ HTMLDivElement
page.getByText("Hello Everyone").element(); // ❌
```

### `query`

This method returns a single element matching the locator's selector or null if no element is found. If multiple elements match the selector, this method will throw an error.

```html
<div>Hello World</div>
```

```typescript
page.getByText("Hello World").query(); // ✅ HTMLDivElement
page.getByText("Hello Everyone").query(); // ✅ null
```

### `elements`

This method returns an array of elements matching the locator's selector.

This function never throws an error. If there are no elements matching the selector, this method will return an empty array.

```html
<div>Hello <span>World</span></div>
<div>Hello</div>
```

```typescript
page.getByText("Hello World").elements(); // ✅ [HTMLDivElement]
page.getByText("Hello Everyone").elements(); // ✅ []
```

### `find`

This method returns a promise that resolves to the first element matching the locator's selector.

```html
<input />
```

```typescript
await page.getByRole("textbox").find(); // ✅ HTMLInputElement
```

### `findAll`

This method returns a promise that resolves to all elements matching the locator's selector.

```html
<input /> <input /> <input />
```

```typescript
await page.getByRole("textbox").findAll(); // ✅ [HTMLInputElement, HTMLInputElement, HTMLInputElement]
```

## Methods

### `debug`

This method prints a signal element matching the locator's selector.

```html
<input />
```

```typescript
page.getByRole("textbox").debug(); // <input />
```

#### See also

- [testing-library's debug](https://testing-library.com/docs/dom-testing-library/api-debugging/#screendebug)

### `setup`

This method allows you to configure an instance of userEvent.

```typescript
await page.setup({ delay: 200 }).getByRole("button").click();
```

#### See also

- [testing-library's userEvent](https://testing-library.com/docs/user-event/setup)

### `click`

Click on an element.

```typescript
await page.getByRole("button").click();
```

#### See also

- [testing-library's click](https://testing-library.com/docs/user-event/convenience#click)

### `dblClick`

Triggers a double click event on an element.

```typescript
await page.getByRole("button").dblClick();
```

#### See also

- [testing-library's dblclick](https://testing-library.com/docs/user-event/convenience#dblclick)

### `tripleClick`

Triggers a triple click event on an element.

```typescript
await page.getByRole("button").tripleClick();
```

#### See also

- [testing-library's tripleclick](https://testing-library.com/docs/user-event/convenience#tripleclick)

### `hover`

Hover an element.

```typescript
await page.getByRole("button").hover();
```

#### See also

- [testing-library's hover](https://testing-library.com/docs/user-event/convenience#hover)

### `unhover`

Unhover an element.

```typescript
await page.getByRole("button").unhover();
```

#### See also

- [testing-library's unhover](https://testing-library.com/docs/user-event/convenience#unhover)

### `clear`

Clears the input element content.

```typescript
await page.getByRole("textbox").clear();
```

#### See also

- [testing-library's clear](https://testing-library.com/docs/user-event/convenience#clear)

### `type`

Sets the value of the current input, textarea or contenteditable element.

```typescript
await page.getByRole("textbox").type("Mr. Bean");
```

#### See also

- [testing-library's type](https://testing-library.com/docs/user-event/convenience#type)

### `selectOptions`

Select the given options in an HTMLSelectElement or listbox.

```html
<select multiple>
  <option value="1">A</option>
  <option value="2">B</option>
  <option value="3">C</option>
</select>
```

```typescript
await page.getByRole("listbox").selectOptions(["1", "C"]);
```

#### See also

- [testing-library's selectOptions](https://testing-library.com/docs/user-event/utility#-selectoptions-deselectoptions)

### `deselectOptions`

Deselect the given options in an HTMLSelectElement or listbox.

```html
<select multiple>
  <option value="1">A</option>
  <option value="2" selected>B</option>
  <option value="3">C</option>
</select>
```

```typescript
await page.getByRole("listbox").deselectOptions("2");
```

#### See also

- [testing-library's deselectOptions](https://testing-library.com/docs/user-event/utility#-selectoptions-deselectoptions)

### `upload`

```html
<div>
  <label htmlFor="file-uploader">Upload file:</label>
  <input id="file-uploader" type="file" />
</div>
```

```typescript
const file = new File(["hello"], "hello.png", { type: "image/png" });

await page.getByLabelText(/upload file/i).upload(file);
```

#### See also

- [testing-library's upload](https://testing-library.com/docs/user-event/utility#upload)

### Assertions

```typescript
const button = page.getByRole("button", { name: "Click me" });

await expect(button.find()).resolves.toBeInTheDocument();
expect(button.element()).toBeInTheDocument();
expect(button.query()).not.toBeInTheDocument();
```

## Advanced Usage

### Custom Locators

You can extend built-in locators API by defining an object of locator factories. These methods will exist as methods on the page object and any created locator.

These locators can be useful if built-in locators are not enough. For example, when you use a custom framework for your UI.

```typescript
import { buildQueries } from "@testing-library/dom";
import { locators, createQuerySelector, type Locator } from "testing-library-locators";

// Use the navite buildQueryies of the DOM Testing Library to create custom queries
const queryAllByDataCy = (container: HTMLElement, id: Matcher, options?: MatcherOptions | undefined) =>
  queryHelpers.queryAllByAttribute("data-cy", container, id, options);

const getMultipleError = (_c: Element | null, dataCyValue: string) =>
  `Found multiple elements with the data-cy attribute of: ${dataCyValue}`;
const getMissingError = (_c: Element | null, dataCyValue: string) =>
  `Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const queries = [queryAllByDataCy, ...buildQueries(queryAllByDataCy, getMultipleError, getMissingError)];

// Creates a new query selector
const DataCyQuerySelector = createQuerySelector(queries);

// Extends the locators
locators.extend({
  getByDataCy(dataCyValue: string) {
    return new DataCyQuerySelector(this, dataCyValue);
  },
});

// For types
declare module "testing-library-locators" {
  interface LocatorSelectors {
    getByDataCy<T extends HTMLElement = HTMLElement>(dataCyValue: string): Locator<T>;
  }
}
```

```html
<button data-cy="submit">Submit</button>
```

```typescript
page.getByDataCy("submit");
```

### Complex Selectors

Build reusable, complex selectors:

```typescript
// Reusable component locator
function getListboxOption(name: string) {
  return page.getByRole('listbox').getByRole('option', { name }))
}

// Use in tests
await getListboxOption("First").click();
```

## License

MIT © [radqut](https://github.com/radqut)

## Acknowledgments

- Based on [Testing Library](https://testing-library.com/) principles
- Inspired by [Vitest Browser Mode Locators](https://vitest.dev/api/browser/locators.html)
- Influenced by [Playwright's locator API](https://playwright.dev/docs/locators)

## Resources

- [Documentation](./docs)
- [Examples](./examples)
- [Changelog](./CHANGELOG.md)
- [Issues](https://github.com/radqut/testing-library-locators/issues)
