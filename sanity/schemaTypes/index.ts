import { type SchemaTypeDefinition } from "sanity";

import { panelpanel } from "./panelpanel";
import { projectproject } from "./projectproject";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [panelpanel, projectproject],
};
