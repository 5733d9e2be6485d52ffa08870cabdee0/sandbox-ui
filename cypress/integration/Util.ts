export function createInstance(newInstanceName: string) {
  cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
  cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
    cy.wrap($modal)
      .should("be.visible")
      .within(() => {
        cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
        cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
          "have.text",
          "Info alert:Your Smart Events instance will be ready for use shortly after creation."
        );
        cy.ouiaId("submit", "PF4/Button").click();
      });
    cy.wrap($modal, { timeout: 20000 }).should("not.exist");
  });
}

export function waitTillInstanceIsReady(instanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table")
    .ouiaId(instanceName, "PF4/TableRow")
    .within(() => {
      cy.get("td:nth-child(3)", { timeout: 30000 }).should(
        "have.text",
        "ready"
      );
    });
}

export function deleteInstance(deleteInstanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table")
    .ouiaId(deleteInstanceName, "PF4/TableRow")
    .find("td")
    .then(($cells) => {
      expect($cells).have.length(4);
      cy.wrap($cells.eq(2))
        .invoke("text")
        .then((status) => {
          expect(status).to.match(/failed|ready/gi);
        });
      cy.wrap($cells.eq(3)).ouiaType("PF4/Dropdown").click();
    });
  cy.ouiaType("PF4/DropdownItem").contains("Delete").click();

  cy.ouiaId("delete-instance", "PF4/ModalContent").within(() => {
    cy.ouiaId("delete-confirmation-value", "PF4/TextInput").type(
      deleteInstanceName
    );
    cy.ouiaId("confirm", "PF4/Button").click();
  });
  cy.ouiaId("delete-instance", "PF4/ModalContent").should("not.exist");
}

export function deletedInstanceNotExist(instanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table").within(() => {
    cy.ouiaId(instanceName, "PF4/TableRow", { timeout: 30000 }).should(
      "not.exist"
    );
  });
}