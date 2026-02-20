import { preferPresenceQueries } from "./rules/prefer-presence-queries.ts";
import { preferQueryByDisappearance } from "./rules/prefer-query-by-disappearance.ts";
import { preferFindBy } from "./rules/prefer-find-by.ts";

export const rules = {
  "prefer-presence-queries": preferPresenceQueries,
  "prefer-query-by-disappearance": preferQueryByDisappearance,
  "prefer-find-by": preferFindBy,
};

export default { rules };
