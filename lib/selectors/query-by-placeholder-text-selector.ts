import {
  findAllByPlaceholderText,
  findByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  queryAllByPlaceholderText,
  queryByPlaceholderText,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByPlaceholderTextSelector = createQuerySelector(
  queryAllByPlaceholderText,
  queryByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
);
