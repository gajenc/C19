const Validator = require("validatorjs");
import ClientDAO from "../dao/client";

/**
 * Checks if incoming value already exist for unique and non-unique fields in the database
 * e.g username: required|string|exists:Client,username
 */
Validator.registerAsync("exists", function(value: any, attribute: any, req: any, passes: any) {
    if (!attribute)
      throw new Error("Specify Requirements i.e fieldName: exist:table,column");
    
    // split table and column
    const attArr = attribute.split(",");
    if (attArr.length !== 2)
      throw new Error(`Invalid format for validation rule on ${attribute}`);

    // assign array index 0 and 1 to table and column respectively
    const { 0: table, 1: column } = attArr;
    
    // define custom error message
    const msg = (column == "username") ? `${column} has already been taken`: `${column} already in use`;

    switch(table) {
      case "Client":
        ClientDAO.findOne({ [column]: value })
          .then((result: any) => {
            if (result) {
              passes(false, msg);
              return;
            }
            passes();
          });
        break;
      default:
        passes(false, "This table is not registered in exists functionality");
    }
});

export const validator = (body: any, rules: any, customMessages: any, callback: any) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};
