import {
  findAllByAltText,
  findByAltText,
  getAllByAltText,
  getByAltText,
  queryAllByAltText,
  queryByAltText,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByAltTextSelector = createQuerySelector(
  queryAllByAltText,
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
);
