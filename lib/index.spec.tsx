import { act, use } from "react";
import { buildQueries, queryHelpers, render, type Matcher, type MatcherOptions } from "@testing-library/react";
import { createQuerySelector, type Locator, locators, page } from ".";

const queryAllByDataCy = (container: HTMLElement, id: Matcher, options?: MatcherOptions | undefined) =>
  queryHelpers.queryAllByAttribute("data-cy", container, id, options);

const getMultipleError = (_c: Element | null, dataCyValue: string) =>
  `Found multiple elements with the data-cy attribute of: ${dataCyValue}`;
const getMissingError = (_c: Element | null, dataCyValue: string) =>
  `Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const DataCyQuerySelector = createQuerySelector(
  queryAllByDataCy,
  ...buildQueries(queryAllByDataCy, getMultipleError, getMissingError),
);

locators.extend({
  getByDataCy(dataCyValue: string) {
    return new DataCyQuerySelector(this.selector, dataCyValue);
  },
});

declare module "." {
  interface LocatorSelectors {
    getByDataCy<T extends HTMLElement = HTMLElement>(dataCyValue: string): Locator<T>;
  }
}

describe("Locators", () => {
  it("gets an element", () => {
    render(<button>Click</button>);

    const element = page.getByRole("button", { name: "Click" }).element();

    expect(element.toString()).toBe("<button>Click</button>");
  });

  it("gets a nested element", () => {
    render(
      <article>
        <button>Click</button>
      </article>,
    );

    const element = page.getByRole("article").getByRole("button", { name: "Click" }).element();

    expect(element.toString()).toBe("<button>Click</button>");
  });

  it("throws an error when do not get an element", () => {
    const locator = page.getByRole("button", { name: "Click" });

    render(<button />);

    expect(() => locator.element()).toThrow();
  });

  it("throws an error when do not get a nested element", () => {
    const locator = page.getByRole("article").getByRole("button", { name: "Click" });

    render(
      <article>
        <button />
      </article>,
    );

    expect(() => locator.element()).toThrow();
  });

  it("queries an element", () => {
    render(<button>Click</button>);

    const element = page.getByRole("button", { name: "Click" }).query();

    expect(element!.toString()).toBe("<button>Click</button>");
  });

  it("queries a nested element", () => {
    render(
      <article>
        <button>Click</button>
      </article>,
    );

    const element = page.getByRole("article").getByRole("button", { name: "Click" }).query();

    expect(element!.toString()).toBe("<button>Click</button>");
  });

  it("does not throw an error when do not query an element", () => {
    const locator = page.getByRole("button", { name: "Click" });

    render(<button />);

    expect(locator.query()).toBe(null);
  });

  it("throws an error when do not query a nested element", () => {
    const locator = page.getByRole("article").getByRole("button", { name: "Click" });

    render(
      <article>
        <button />
      </article>,
    );

    expect(locator.query()).toBe(null);
  });

  describe("has", () => {
    it("finds an element with one contain selector", () => {
      render(
        <div>
          <article>
            <div>First</div>
          </article>
          <article>
            <div>Second</div>
          </article>
        </div>,
      );

      const element = page.getByRole("article").has(page.getByText("Second")).element();

      expect(element.toString()).toBe("<article><div>Second</div></article>");
    });

    it("finds an element with two contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
        </div>,
      );

      const element = page.getByRole("article").has(page.getByRole("heading")).has(page.getByRole("button")).element();

      expect(element.toString()).toBe("<article><h2>Second</h2><button>Click</button></article>");
    });

    it("finds an element with three contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
          <article>
            <h2>Third</h2>
            <button>Click</button>
            <img />
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button"))
        .has(page.getByRole("img"))
        .element();

      expect(element.toString()).toBe("<article><h2>Third</h2><button>Click</button><img></article>");
    });

    it("finds an element with nested contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <button>Delete</button>
          </article>
          <article>
            <h2>Second</h2>
            <button>Create</button>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button").has(page.getByText("Create")))
        .element();

      expect(element.toString()).toBe("<article><h2>Second</h2><button>Create</button></article>");
    });

    it("finds elements with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const elements = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .elements();

      expect(elements.map((element) => element.toString())).toEqual([
        '<article><h2>First</h2><div role="alert"><button>Close</button></div></article>',
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      ]);
    });

    it("finds the first element with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .first()
        .element();

      expect(element.toString()).toBe(
        '<article><h2>Second</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds the second element with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .nth(1)
        .element();

      expect(element.toString()).toBe(
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds the last element with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .last()
        .element();

      expect(element.toString()).toBe(
        '<article><h2>Second</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds an element at position and contain selector", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .nth(1)
        .has(page.getByRole("heading", { name: "Third" }))
        .element();

      expect(element.toString()).toBe(
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds an elements with one inverse contain selector", () => {
      render(
        <div>
          <article>
            <div>First</div>
          </article>
          <article>
            <div>Second</div>
          </article>
        </div>,
      );

      const element = page.getByRole("article").not.has(page.getByText("Second")).element();

      expect(element.toString()).toBe("<article><div>First</div></article>");
    });

    it("finds an elements with two inverse contain selector", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .not.has(page.getByText("Second"))
        .element();

      expect(element.toString()).toBe("<article><h2>First</h2></article>");
    });

    it("does not find an element with one contain selector", () => {
      render(
        <div>
          <article>
            <div>First</div>
          </article>
          <article>
            <div>Second</div>
          </article>
        </div>,
      );

      const element = page.getByRole("article").has(page.getByText("Third")).query();

      expect(element).toBe(null);
    });

    it("does not find an element with two contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button", { name: "Press" }))
        .query();

      expect(element).toBe(null);
    });

    it("does not find an element with three contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
          <article>
            <h2>Third</h2>
            <button>Click</button>
            <img />
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button"))
        .has(page.getByRole("banner"))
        .query();

      expect(element).toBe(null);
    });

    it("does not find elements with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const elements = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Abort"))))
        .elements();

      expect(elements).toHaveLength(0);
    });

    it("does not find the second element with deep contain selectors", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Continue"))))
        .nth(1)
        .query();

      expect(element).toBe(null);
    });

    it("does not find an element at position and contain selector", () => {
      render(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = page
        .getByRole("article")
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .nth(0)
        .has(page.getByRole("heading", { name: "Third" }))
        .query();

      expect(element).toBe(null);
    });
  });
});

describe("async", () => {
  const renderAsyncComponent = async (node: React.ReactNode) => {
    const promise = new Promise<void>((res) => setTimeout(res, 500));

    const TestComponent = () => {
      use(promise);

      return node;
    };

    await act(() => render(<TestComponent />));
  };

  it("finds an async element", async () => {
    await renderAsyncComponent(<button>Click</button>);

    const element = await page.getByRole("button", { name: "Click" }).find();

    expect(element.toString()).toBe("<button>Click</button>");
  });

  it("finds a nested async element", async () => {
    await renderAsyncComponent(
      <article>
        <button>Click</button>
      </article>,
    );

    const element = await page.getByRole("article").getByRole("button", { name: "Click" }).find();

    expect(element.toString()).toBe("<button>Click</button>");
  });

  it("finds async elements", async () => {
    await renderAsyncComponent(
      <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>,
    );

    const elements = await page.getByRole("list").getByRole("listitem").findAll();

    expect(elements.map((element) => element.toString())).toEqual([
      "<li>First</li>",
      "<li>Second</li>",
      "<li>Third</li>",
    ]);
  });

  it("finds the first async element", async () => {
    await renderAsyncComponent(
      <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>,
    );

    const element = await page.getByRole("list").getByRole("listitem").first().findAll();

    expect(element.toString()).toEqual("<li>First</li>");
  });

  it("finds the second async element", async () => {
    await renderAsyncComponent(
      <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>,
    );

    const element = await page.getByRole("list").getByRole("listitem").nth(1).findAll();

    expect(element.toString()).toEqual("<li>Second</li>");
  });

  it("finds the last async element", async () => {
    await renderAsyncComponent(
      <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>,
    );

    const element = await page.getByRole("list").getByRole("listitem").last().find();

    expect(element.toString()).toEqual("<li>Third</li>");
  });

  describe("has", () => {
    it("finds an async element with one contain selector", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <div>First</div>
          </article>
          <article>
            <div>Second</div>
          </article>
        </div>,
      );

      const element = await page.getByRole("article").has(page.getByText("Second")).find();

      expect(element.toString()).toEqual("<article><div>Second</div></article>");
    });

    it("finds an async element with two contain selector", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button"))
        .find();

      expect(element.toString()).toEqual("<article><h2>Second</h2><button>Click</button></article>");
    });

    it("finds an element with three contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
          </article>
          <article>
            <h2>Second</h2>
            <button>Click</button>
          </article>
          <article>
            <h2>Third</h2>
            <button>Click</button>
            <img />
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button"))
        .has(page.getByRole("img"))
        .find();

      expect(element.toString()).toBe("<article><h2>Third</h2><button>Click</button><img></article>");
    });

    it("finds an element with nested contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <button>Delete</button>
          </article>
          <article>
            <h2>Second</h2>
            <button>Create</button>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("button").has(page.getByText("Create")))
        .find();

      expect(element.toString()).toBe("<article><h2>Second</h2><button>Create</button></article>");
    });

    it("finds elements with deep contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const elements = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .findAll();

      expect(elements.map((element) => element.toString())).toEqual([
        '<article><h2>First</h2><div role="alert"><button>Close</button></div></article>',
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      ]);
    });

    it("finds the first element with deep contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .first()
        .find();

      expect(element.toString()).toBe(
        '<article><h2>Second</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds the second element with deep contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .nth(1)
        .find();

      expect(element.toString()).toBe(
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds the last element with deep contain selectors", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("heading"))
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .last()
        .find();

      expect(element.toString()).toBe(
        '<article><h2>Second</h2><div role="alert"><button>Close</button></div></article>',
      );
    });

    it("finds an element at position and contain selector", async () => {
      await renderAsyncComponent(
        <div>
          <article>
            <h2>First</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
          <article>
            <h2>Second</h2>
            <div role="alert">
              <button>Continue</button>
            </div>
          </article>
          <article>
            <h2>Third</h2>
            <div role="alert">
              <button>Close</button>
            </div>
          </article>
        </div>,
      );

      const element = await page
        .getByRole("article")
        .has(page.getByRole("alert").has(page.getByRole("button").has(page.getByText("Close"))))
        .nth(1)
        .has(page.getByRole("heading", { name: "Third" }))
        .find();

      expect(element.toString()).toBe(
        '<article><h2>Third</h2><div role="alert"><button>Close</button></div></article>',
      );
    });
  });

  it("should extend locator selectors", () => {
    render(<button data-cy="submit">Submit</button>);

    const element = page.getByDataCy("submit").element();

    expect(element.toString()).toBe('<button data-cy="submit">Submit</button>');
  });
});
