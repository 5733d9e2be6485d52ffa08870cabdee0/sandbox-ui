import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType, pageWasLoaded } from "../../utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Edit Smart Event Instance Tests", () => {
    beforeEach(() => {
      cy.visit("/");
      pageWasLoaded();
    });

    it("Edit Error handler configuration", () => {
      //Open 'Instance one' page
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId("Instance one", "PF4/TableRow")
        .within(() => {
          cy.get(
            "td:first a[data-testid='tableInstances-linkInstance']"
          ).click();
        });

      // Switch to 'Error handling' tab
      cy.ouiaId("error-handling", "PF4/TabButton").click();
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

    it.only("Switch from 'Webhook' to 'Ignore' Error handler", () => {
      //Open 'Instance one' page
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId("Instance one", "PF4/TableRow")
        .within(() => {
          cy.get(
            "td:first a[data-testid='tableInstances-linkInstance']"
          ).click();
        });

      // Switch to error handling tab
      cy.ouiaId("error-handling", "PF4/TabButton").click();

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
      cy.get("button.pf-c-select__menu-item", { timeout: 10000 })
        .contains("Ignore")
        .click();
      cy.ouiaId("submit", "PF4/Button").click();

      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId("Instance one", "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          //The user cannot go to the instance's details if it is not ready
          //Assert that the inner text contains only the name of the instance and no <a>
          cy.get("td:first").should("have.html", "Instance one");
          //The status column is loading and contains ready
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
          cy.ouiaId("creating", "PF4/Button").click();
        });

      cy.ouiaId("se-status", "QE/Popover", { timeout: 30000 }).should(
        "not.exist"
      );
    });
  });
});
