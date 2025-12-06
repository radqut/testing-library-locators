import {
  findAllByLabelText,
  findByLabelText,
  getAllByLabelText,
  getByLabelText,
  queryAllByLabelText,
  queryByLabelText,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByLabelTextSelector = createQuerySelector(
  queryAllByLabelText,
  queryByLabelText,
  getAllByLabelText,
  getByLabelText,
  findAllByLabelText,
  findByLabelText,
);
