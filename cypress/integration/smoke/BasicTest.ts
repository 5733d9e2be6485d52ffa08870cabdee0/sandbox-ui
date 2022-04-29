describe("Basic Elements", () => {
  beforeEach(() => {
    cy.visit("/");
    //wait rutine - not sure why the page is loading so long
    cy.get("button#nav-toggle", { timeout: 60000 }).should("be.visible");
  });

  it("The Create SE Instance button is visible", () => {
    cy.ouiaId("create-smart-event-instance", "PF4/Button").should("be.visible");
  });

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
