export abstract class QuerySelector<T extends HTMLElement = HTMLElement> {
  abstract element(): T;
  abstract query(): T | null;
  abstract elements(): T[];
  abstract find(): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract nth(index: number): QuerySelector<T>;
  abstract first(): QuerySelector<T>;
  abstract last(): QuerySelector<T>;
  abstract has(selector: QuerySelector): QuerySelector<T>;
  abstract get not(): QuerySelector<T>;
  abstract clone(parent?: QuerySelector): QuerySelector;
  abstract debug(): void;
}
