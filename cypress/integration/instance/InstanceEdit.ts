import { onlyOn } from "@cypress/skip-test";
import {
  isEnvironmentType,
  EnvType,
  pageWasLoaded,
  visitWithCookies,
} from "../../utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Edit Smart Event Instance Tests", () => {
    beforeEach(() => {
      //Open 'Instance one' page
      visitWithCookies("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");
      pageWasLoaded();

      // Switch to error handling tab
      cy.ouiaId("error-handling", "PF4/TabButton").click();
    });

    it("Edit Error handler configuration", () => {
      cy.ouiaId("error-handling-section", "PF4/Text").should("be.visible");

      // Do simple change in 'Error handling' conf
      cy.ouiaId("edit", "PF4/Button")
        .should("have.attr", "aria-disabled")
        .and("equal", "false");
      cy.ouiaId("edit", "PF4/Button").click();
      cy.get("input[name='endpoint']").clear().type("http://new-google.com");
      cy.ouiaId("submit", "PF4/Button").click();

      // Check status contains text 'This will be ready shortly.'
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId("Instance one", "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:nth-child(3)")
            .ouiaId("accepted", "QE/ResourceStatus")
            .within(() => {
              cy.get("span[role='progressbar']").should("exist");
              cy.ouiaId("creating", "PF4/Button").should(
                "have.text",
                "Creating"
              );
              cy.ouiaId("ready-shortly", "QE/HelperTextItem").should(
                "have.text",
                "This will be ready shortly."
              );
            });
        });
    });

    it("Switch from 'Webhook' to 'Ignore' Error handler", () => {
      // Wait tab is loaded
      cy.get(".pf-c-description-list__term").should("have.length", 5);
      // Once tab is loaded start edit mode
      cy.ouiaId("error-handling", "PF4/TabContent").within(() => {
        cy.ouiaId("edit", "PF4/Button")
          .should("have.attr", "aria-disabled")
          .and("equal", "false");
        cy.ouiaId("edit", "PF4/Button").click();
      });

      // Change error handling strategy to 'Ignore'
      cy.ouiaId("error-handling-method-selector", "PF4/Select").within(() => {
        cy.get("button").should("not.have.attr", "disabled");
      });
      cy.ouiaId("error-handling-method-selector", "PF4/Select").click();
      cy.ouiaId("IGNORE", "select-menu-item", { timeout: 10000 }).click();
      cy.ouiaId("submit", "PF4/Button").click();

      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId("Instance one", "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("contain.text", "Instance one");
          //The status column is loading and contains ready
          cy.get("td:nth-child(3)").ouiaId("ready", "QE/ResourceStatus", {
            timeout: 90000,
          });
        });
    });
  });
});
