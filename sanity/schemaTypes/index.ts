import { type SchemaTypeDefinition } from "sanity";

import { panelpanel } from "./panelpanel";
import { projectproject } from "./projectproject";
import { splashSettings } from "./splashsettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [panelpanel, projectproject, splashSettings],
};
