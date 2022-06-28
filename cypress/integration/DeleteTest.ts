describe("Delete Test", () => {
  it("Instance", () => {
    cy.visit("/");

    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaId("Instance ten", "PF4/TableRow")
      .find("td")
      .then(($cells) => {
        expect($cells).have.length(4);
        expect($cells.eq(1)).have.text("ready");
        cy.wrap($cells.eq(3)).ouiaType("PF4/Dropdown").click();
      });

    cy.ouiaType("PF4/DropdownItem").contains("Delete").click();

    cy.ouiaId("delete-instance", "PF4/ModalContent").within(() => {
      cy.ouiaId("delete-confirmation-value", "PF4/TextInput").type(
        "Instance ten"
      );
      cy.ouiaId("confirm", "PF4/Button").click();
    });

    cy.ouiaId("delete-instance", "PF4/ModalContent").should("not.exist");

    cy.ouiaId("Instances list table", "PF4/Table").within(() => {
      // once delete confirmed, state should change
      cy.ouiaId("Instance ten", "PF4/TableRow")
        .find("td")
        .eq(1)
        .should("have.text", "deprovision");

      // once deprovision is completed, entry should disappear
      cy.ouiaId("Instance ten", "PF4/TableRow", { timeout: 30000 }).should(
        "not.exist"
      );
    });
  });

  it("Instance :: External component fail", () => {
    cy.visit("/");

    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaId("error-test", "PF4/TableRow")
      .find("td")
      .then(($cells) => {
        expect($cells).have.length(4);
        expect($cells.eq(1)).have.text("ready");
        cy.wrap($cells.eq(3)).ouiaType("PF4/Dropdown").click();
      });

    cy.ouiaType("PF4/DropdownItem").contains("Delete").click();

    cy.ouiaId("delete-confirmation-value", "PF4/TextInput").type("error-test");
    cy.ouiaId("confirm", "PF4/Button").click();

    cy.ouiaId("delete-instance", "PF4/ModalContent").should("exist");
    cy.ouiaId("delete-instance", "PF4/ModalContent").should(
      "contain.text",
      "It is not possible to delete this Smart Events instance. Try again later."
    );
  });

  it("Processor", () => {
    // Open 'Instance one'
    cy.visit("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");

    cy.ouiaId("instance-details", "PF4/Tabs")
      .ouiaId("processors", "PF4/TabButton")
      .click();
    cy.ouiaId("processors", "PF4/TabContent").within(() => {
      cy.ouiaId("Processors list table", "PF4/Table")
        .ouiaId("Processor one", "PF4/TableRow")
        .find("td")
        .then(($cells) => {
          expect($cells).have.length(6);
          expect($cells.eq(0)).have.text("Processor one");
          expect($cells.eq(3)).have.text("ready");
          cy.wrap($cells.eq(5)).ouiaType("PF4/Dropdown").click();
        });
    });

    cy.ouiaType("PF4/DropdownItem").click();

    cy.ouiaId("delete-processor", "PF4/ModalContent").within(() => {
      cy.ouiaId("delete-confirmation-value", "PF4/TextInput").type(
        "Processor one"
      );
      cy.ouiaId("confirm", "PF4/Button").click();
    });

    cy.ouiaId("delete-processor", "PF4/ModalContent").should("not.exist");

    cy.ouiaId("processors", "PF4/TabContent").within(() => {
      cy.ouiaId("Processors list table", "PF4/Table").within(() => {
        // once delete confirmed, state should change
        cy.ouiaId("Processor one", "PF4/TableRow")
          .find("td")
          .eq(3)
          .should("have.text", "deprovision");

        // once deprovision is completed, entry should disappear
        cy.ouiaId("Processor one", "PF4/TableRow", { timeout: 30000 }).should(
          "not.exist"
        );
      });
    });
  });
});
