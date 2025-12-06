import { findAllByText, findByText, getAllByText, getByText, queryAllByText, queryByText } from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByTextSelector = createQuerySelector(
  queryAllByText,
  queryByText,
  getAllByText,
  getByText,
  findAllByText,
  findByText,
);
