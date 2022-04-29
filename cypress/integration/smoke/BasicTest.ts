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
    cy.ouiaId("OUIA-Generated-NavItem-1", "PF4/NavItem").then(($item) => {
      //toggle menu side bar - both directions
      if ($item.is(":visible")) {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("OUIA-Generated-NavItem-1", "PF4/NavItem").should(
          "not.be.visible"
        );
        cy.get("button#nav-toggle").click();
        cy.ouiaId("OUIA-Generated-NavItem-1", "PF4/NavItem").should(
          "be.visible"
        );
      } else {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("OUIA-Generated-NavItem-1", "PF4/NavItem").should(
          "be.visible"
        );
        cy.get("button#nav-toggle").click();
        cy.ouiaId("OUIA-Generated-NavItem-1", "PF4/NavItem").should(
          "not.be.visible"
        );
      }
    });
  });

  it("Mocked instances are visible", () => {
    cy.ouiaType("PF4/TableRow")
      .should("have.length", 13)
      .eq(1)
      .find("td")
      .eq(0)
      .should("have.text", "Instance one")
      .find("a[data-testid='tableInstances-linkInstance']")
      .should("be.visible");
  });
});
