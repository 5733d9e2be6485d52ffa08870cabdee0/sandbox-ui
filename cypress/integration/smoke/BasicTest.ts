describe("Basic Elements", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("The Create SE Instance button is visible", () => {
    cy.ouiaId("create-smart-event-instance", "PF4/Button").should("be.visible");
  });

  /**
   * The sidebar and the header are not part of the SE UI we export.
   * So only the page content is relevant to report bugs.
   * This test is relevant only for developing/demoing purposes.
   */
  it("The navigation panel is visible", () => {
    cy.ouiaId("smart-events", "PF4/NavItem").then(($item) => {
      //toggle menu side bar - both directions
      if ($item.is(":visible")) {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("not.be.visible");
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("be.visible");
      } else {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("be.visible");
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("not.be.visible");
      }
    });
  });

  it("Mocked instances are visible", () => {
    //TODO: MGDOBR-710
    cy.wait(10000);
    cy.ouiaType("PF4/TableRow")
      .should("have.length", 11);
    cy.ouiaId("ee22ce62-1f23-4dd7-b106-e4158baf8228", "PF4/TableRow")
      .find("a[data-testid='tableInstances-linkInstance']")
      .should("be.visible")
      .click();
    //TODO: fix the name of the instance. It seems that the application contains some dummy data
    cy.ouiaId("instance-name", "PF4/Text").should("have.text", "Instance one");
  });
});
