import { onlyOn } from "@cypress/skip-test";
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
    const restBaseUrl = Cypress.env("SANDBOX_DEV_REST_URL");
    const restPath = Cypress.env("SANDBOX_DEV_REST_PATH");
    const restUrl = `${restBaseUrl}${restPath}/bridges`;
    const token = Cypress.env("OB_TOKEN");
    const user: string = Cypress.env("USER");
    const psw: string = Cypress.env("PASSWORD");
    const authorization = `Bearer ${token}`;
    let bridgeId: String;

    before(() => {
      if (!token) {
        throw new Error("Missing token value, set using CYPRESS_OB_TOKEN");
      } else {
        cy.log("Token is set correctly");
      }

      expect(restBaseUrl, "REST base url was set").to.be.a("string").and.not.be
        .empty;
      expect(restPath, "REST path was set").to.be.a("string").and.not.be.empty;

      if (typeof user !== "string" || !user) {
        throw new Error("Missing user value, set using CYPRESS_USER");
      } else {
        cy.log("User name is set correctly");
      }

      if (typeof psw !== "string" || !psw) {
        throw new Error("Missing password value, set using CYPRESS_PASSWORD");
      } else {
        cy.log("Password is set correctly");
      }

      const options = {
        method: "POST",
        url: restUrl,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": authorization,
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
          url: `${restUrl}/${bridgeId}`,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authorization,
          },
        };
        cy.request(options).then((response) => {
          expect(response.body).to.not.be.null;
          expect(response.isOkStatusCode).to.equal(true);
        });

        visitWithCookies("/");
        cy.ouiaId(bridgeName)
          .should("be.visible")
          .within(($item) => {
            cy.get("td:first").should("have.text", bridgeName);
            cy.get("td:nth-child(3)").then(($state) => {
              cy.wrap($state).should("have.text", "Deleting");
            });
            cy.wrap($item, { timeout: 60000 }).should("not.exist");
          });
      }
    });

    beforeEach(() => {
      visitWithCookies("/");
      safeLogin();
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
