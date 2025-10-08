import * as auth from "./schemas/auth";
import * as inventory from "./schemas/inventory";
import * as company from "./schemas/company";

const schema = { ...auth, ...inventory, ...company };

export default schema;
