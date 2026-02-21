import { act, render, screen } from "@testing-library/react";
import "./vitest";
import { page } from ".";
import { Suspense, use, useEffect, useState } from "react";

describe("vitest", () => {
  it("finds an element", async () => {
    render(<button>Click me</button>);

    await expect.element(page.getByRole("button")).toBeInTheDocument();
  });

  it("asserts when an element is not found", async () => {
    render(<button>Click me</button>);

    await expect(() =>
      expect.element(page.getByRole("button", { name: "Not click me" })).toBeInTheDocument(),
    ).rejects.toThrow(/value must be an HTMLElement or an SVGElement./);
  });

  it("finds elements", async () => {
    render(
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>,
    );

    await expect.element(page.getByRole("listitem")).toHaveLength(3);
  });

  it("asserts when elements are not found", async () => {
    render(
      <ul>
        <li>1</li>
      </ul>,
    );

    await expect(() => expect.element(page.getByRole("listitem")).toHaveLength(3)).rejects.toThrow(
      /expected \[ <li><\/li> \] to have a length of 3 but got 1/,
    );
  });

  it("finds an async element", async () => {
    const promise = new Promise((res) => setTimeout(res, 500));

    const TestComponent = () => {
      use(promise);

      return <button>Click me</button>;
    };

    await act(() =>
      render(
        <Suspense>
          <TestComponent />
        </Suspense>,
      ),
    );

    await expect.element(page.getByRole("button")).toBeInTheDocument();

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("finds async elements", async () => {
    const promise = new Promise((res) => setTimeout(res, 500));

    const TestComponent = () => {
      use(promise);

      return (
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      );
    };

    await act(() =>
      render(
        <Suspense>
          <TestComponent />
        </Suspense>,
      ),
    );

    await expect.element(page.getByRole("listitem")).toHaveLength(3);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("finds a conditional element", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return <button>Not click me</button>;
      }

      return <button>Click me</button>;
    };

    render(<TestComponent />);

    await expect.element(page.getByRole("button")).toHaveTextContent("Not click me");

    expect(screen.getByRole("button", { name: "Not click me" })).toBeInTheDocument();
  });

  it("finds an inverted conditional element", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return <button>Not click me</button>;
      }

      return <button>Click me</button>;
    };

    render(<TestComponent />);

    await expect.element(page.getByRole("button", { name: "Click me" })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Not click me" })).toBeInTheDocument();
  });

  it("finds conditional elements", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return (
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        );
      }

      return (
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      );
    };

    render(<TestComponent />);

    await expect.element(page.getByRole("listitem")).toHaveLength(5);

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("finds inverted conditional elements", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return (
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        );
      }

      return (
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      );
    };

    render(<TestComponent />);

    await expect.element(page.getByRole("listitem")).not.toHaveLength(2);

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("sets custom options for element", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return <button>Not click me</button>;
      }

      return <button>Click me</button>;
    };

    render(<TestComponent />);

    await expect(() =>
      expect.element(page.getByRole("button", { name: "Not click me" }), { timeout: 0 }).toBeInTheDocument(),
    ).rejects.toThrow(/value must be an HTMLElement or an SVGElement./);
  });

  it("sets custom options for elements", async () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      useEffect(() => {
        setTimeout(() => setExpanded((prev) => !prev), 500);
      }, []);

      if (expanded) {
        return (
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        );
      }

      return (
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      );
    };

    render(<TestComponent />);

    await expect(() => expect.element(page.getByRole("listitem"), { timeout: 0 }).toHaveLength(5)).rejects.toThrow(
      /expected \[ <li><\/li>, <li><\/li> \] to have a length of 5 but got 2/,
    );
  });
});
