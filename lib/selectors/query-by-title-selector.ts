import {
  findAllByTitle,
  findByTitle,
  getAllByTitle,
  getByTitle,
  queryAllByTitle,
  queryByTitle,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByTitleSelector = createQuerySelector(
  queryAllByTitle,
  queryByTitle,
  getAllByTitle,
  getByTitle,
  findAllByTitle,
  findByTitle,
);
