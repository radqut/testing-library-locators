import {
  findAllByTestId,
  findByTestId,
  getAllByTestId,
  getByTestId,
  queryAllByTestId,
  queryByTestId,
} from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByTestIdSelector = createQuerySelector(
  queryAllByTestId,
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
);
