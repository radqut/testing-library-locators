import { findAllByRole, findByRole, getAllByRole, getByRole, queryAllByRole, queryByRole } from "@testing-library/dom";
import { createQuerySelector } from "../create-query-selector";

export const QueryByRoleSelector = createQuerySelector(
  queryAllByRole,
  queryByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
);
