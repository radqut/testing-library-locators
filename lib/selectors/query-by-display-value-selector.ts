import {
  findAllByDisplayValue,
  findByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  queryAllByDisplayValue,
  queryByDisplayValue,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByDisplayValueSelector = createQuerySelector(
  queryAllByDisplayValue,
  queryByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
);
