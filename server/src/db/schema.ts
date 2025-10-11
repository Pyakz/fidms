import * as auth from "./schemas/auth";
import * as inventory from "./schemas/inventory";

const schema = { ...auth, ...inventory };

export default schema;
