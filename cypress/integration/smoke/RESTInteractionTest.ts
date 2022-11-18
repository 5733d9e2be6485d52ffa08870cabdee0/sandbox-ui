import { onlyOn } from "@cypress/skip-test";
import { LoginConfig, RestConfig } from "cypress/utils/Config";
import {
  EnvType,
  isEnvironmentType,
  safeLogin,
  uniqueName,
  visitWithCookies,
} from "../../utils/Util";

onlyOn(isEnvironmentType(EnvType.Dev), () => {
  describe("UI react on the REST interactions", () => {
    const bridgeName = uniqueName("myBridge");
    let restConfig: RestConfig;
    let loginConfig: LoginConfig;
    let bridgeId: String;

    before(() => {
      restConfig = new RestConfig();
      loginConfig = new LoginConfig();
      const options = {
        method: "POST",
        url: restConfig.restUrl,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": restConfig.authorization,
        },
        body: {
          name: bridgeName,
          cloud_provider: "aws",
          region: "us-east-1",
        },
      };
      cy.request(options).then((response) => {
        // response.body is automatically serialized into JSON
        expect(response.body).to.not.be.null;
        expect(response.body.id).to.not.be.null;
        bridgeId = response.body.id;
      });
    });

    after(() => {
      if (bridgeId != undefined) {
        const options = {
          method: "DELETE",
          url: `${restConfig.restUrl}/${bridgeId}`,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": restConfig.authorization,
          },
        };
        cy.request(options).then((response) => {
          expect(response.body).to.not.be.null;
          expect(response.isOkStatusCode).to.equal(true);
        });

        visitWithCookies("/");
        cy.ouiaId(bridgeName, "PF4/TableRow")
          .should("be.visible")
          .within(() => {
            cy.get("td:first").should("have.text", bridgeName);
            cy.get("td:nth-child(3)").then(($state) => {
              cy.wrap($state).should("have.text", "Deleting");
            });
          });
        cy.ouiaId(bridgeName, "PF4/TableRow", { timeout: 120000 }).should(
          "not.exist"
        );
      }
    });

    beforeEach(() => {
      visitWithCookies("/");
      safeLogin(loginConfig);
    });

    it("The Create SE Instance button is visible", () => {
      cy.ouiaId("create-smart-event-instance", "PF4/Button").should(
        "be.visible"
      );
    });

    it("Data are visible", () => {
      cy.ouiaId(bridgeName)
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.text", bridgeName);
          cy.get("td:nth-child(3)").then(($state) => {
            cy.wrap($state, { timeout: 240000 }).should("have.text", "Ready");
          });
        });
    });
  });
});
