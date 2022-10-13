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
  });
});
