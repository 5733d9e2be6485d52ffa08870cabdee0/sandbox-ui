import axios from "axios";
import exit from "exit";
import fs from "fs";
import { cwd } from "process";

console.log("Fetching error catalog from backend");

let errorList;
await axios
  .get(
    "https://event-bridge-event-bridge-prod.apps.openbridge-dev.fdvn.p1.openshiftapps.com/api/v1/errors"
  )
  .then((response) => {
    errorList = response?.data?.items;
  })
  .catch((error) => {
    console.error(error);
  });

if (!errorList) {
  console.log("It is not possible to fetch the error catalog");
  exit(1);
}

console.log("Successfully fetched error catalog");
console.log("Generating error SDK");

let stringBuffer = `
/**
   smart_events error codes

    \`\`\`ts
    apiCall.then((data) => {
        console.log(data?.data.items)
    }).catch((err) => {
      if(APIErrorCodes.ERROR_5 == err.response?.data.code) {
        // Handle error
      }
    })
    \`\`\`
*/
export const APIErrorCodes = {
`;

errorList.forEach(function (errorType) {
  stringBuffer += `  /** ${errorType.reason}*/\n`;
  stringBuffer += `  ERROR_${errorType.id} : "${errorType.code}", \n\n`;
});

stringBuffer += `}`;

fs.writeFileSync(cwd() + "/openapi/generated/errors.ts", stringBuffer, {
  encoding: "utf8",
});

console.log(`Successfully generated error SDK`);
exit(0);
