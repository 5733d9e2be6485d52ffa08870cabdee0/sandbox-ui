import { format } from "date-fns";

const formatDate = (dateStr: string): string =>
  format(new Date(dateStr), "PPPP p");

describe("Processor Test", () => {
  /**
   * This test suite verifies that the user can create all types of processors.
   * Because it is running with mocked data we have to assert all data immediately (no reload of the page).
   */
  describe("Create a Processor", () => {
    beforeEach(() => {
      cy.visit("/instance/830c8f0d-c677-492f-8d7e-0f81893fbba6");
      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );
    });

    it("Sink processor", () => {
      const processorName: string = "Sink processor";
      const action = [
        "Send to Slack",
        "dev-action",
        "https://test.app.com/item",
      ];
      const filters = [
        ["data.name", "processor.StringEquals", "John"],
        ["data.surname", "processor.StringEquals", "White"],
      ];

      cy.ouiaId("create-processor", "PF4/Button").click();
      cy.ouiaId("Create processor", "breadcrumb-item").should("be.visible");
      cy.ouiaId("sink", "Tile").should("be.visible").click();
      cy.ouiaId("processor-name", "PF4/TextInput")
        .should("be.visible")
        .type(processorName);

      //Filters
      cy.ouiaId("add-filter", "PF4/Button").should("be.visible").click();

      cy.ouiaId("item-0").within(() => {
        cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0][0]);
        cy.ouiaId("filter-type", "PF4/FormSelect").select("String equals");
      });
      cy.ouiaId("item-0") //The filter-value was detached from DOM and we need to find the context again.
        .ouiaId("filter-value", "PF4/TextInput")
        .type(filters[0][2]);
      cy.ouiaId("item-1").within(() => {
        cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
        cy.ouiaId("filter-type", "PF4/FormSelect").select("String equals");
      });
      cy.ouiaId("item-1") //The filter-value was detached from DOM and we need to find the context again.
        .ouiaId("filter-value", "PF4/TextInput")
        .type(filters[1][2]);

      //Transformation
      cy.ouiaId("transformation-description", "PF4/Text")
        .parent()
        .parent()
        .find("textarea")
        .should("be.visible")
        .should("be.empty")
        .type("I want to write here something.");

      //Actions

      cy.ouiaId("missing-actions", "PF4/TextInput")
        .should("be.visible")
        .should("be.disabled");
      cy.ouiaId("action-type", "PF4/FormSelect")
        .should("be.visible")
        .select(action[0]);
      cy.ouiaId("missing-actions", "PF4/TextInput").should("not.exist");
      cy.ouiaId("channel", "PF4/TextInput")
        .should("be.visible")
        .type(action[1]);
      cy.ouiaId("webhookUrl", "PF4/TextInput")
        .should("be.visible")
        .type(action[2]);

      cy.ouiaId("submit").click();

      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );

      cy.ouiaId("Processors list table", "PF4/Table")
        .ouiaId(processorName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td")
            .eq(3)
            .then(($state) => {
              cy.wrap($state).should("have.text", "accepted");
              cy.wrap($state, { timeout: 15000 }).should(
                "have.text",
                "provisioning"
              );
              cy.wrap($state, { timeout: 30000 }).should("have.text", "ready");
            });
          cy.get("td").eq(0).should("have.text", processorName).click();
        });

      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );

      cy.ouiaId("filters", "PF4/Table").within(() => {
        filters.forEach((item, rowIndex) => {
          cy.ouiaId(item[0], "PF4/TableRow")
            .find("td")
            .each((cell, cellIndex) => {
              cy.wrap(cell).should("have.text", filters[rowIndex][cellIndex]);
            });
        });
      });

      cy.get("code").should("have.text", "I want to write here something.");

      cy.get("[class='pf-c-description-list__description']")
        .should("have.length", action.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", action[index]);
        });
    });

    it("Source processor", () => {
      const processorName: string = "Source processor";
      const source = ["Slack", "dev channel", "asd14u-e"];
      const filters = [
        ["data.name", "processor.StringEquals", "John"],
        ["data.surname", "processor.StringEquals", "White"],
      ];
      cy.ouiaId("create-processor", "PF4/Button").click();
      cy.ouiaId("Create processor", "breadcrumb-item").should("be.visible");
      cy.ouiaId("source", "Tile").should("be.visible").click();
      cy.ouiaId("processor-name", "PF4/TextInput")
        .should("be.visible")
        .type(processorName);

      //Source

      cy.ouiaId("missing-source-parameters", "PF4/TextInput")
        .should("be.visible")
        .should("be.disabled");
      cy.ouiaId("source-type", "PF4/FormSelect")
        .should("be.visible")
        .select(source[0]);
      cy.ouiaId("missing-source-parameters", "PF4/TextInput").should(
        "not.exist"
      );
      cy.ouiaId("channel", "PF4/TextInput")
        .should("be.visible")
        .type(source[1]);
      cy.ouiaId("token", "PF4/TextInput").should("be.visible").type(source[2]);

      //Filters
      cy.ouiaId("add-filter", "PF4/Button").should("be.visible").click();
      cy.ouiaId("item-0").within(() => {
        cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0][0]);
        cy.ouiaId("filter-type", "PF4/FormSelect").select("String equals");
      });
      //The filter-value was detached from DOM and we need to find the context again.
      cy.ouiaId("item-0")
        .ouiaId("filter-value", "PF4/TextInput")
        .type(filters[0][2]);
      cy.ouiaId("item-1").within(() => {
        cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
        cy.ouiaId("filter-type", "PF4/FormSelect").select("String equals");
      });
      //The filter-value was detached from DOM and we need to find the context again.
      cy.ouiaId("item-1")
        .ouiaId("filter-value", "PF4/TextInput")
        .type(filters[1][2]);

      //Transformation is related to action and it is not a part of Source processor

      cy.ouiaId("submit").click();

      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );

      /*
       * It is necessary to check data in the same test.
       * The mocked data are deleted when the page is refreshed.
       */

      cy.ouiaId("Processors list table", "PF4/Table")
        .ouiaId(processorName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td")
            .eq(3)
            .then(($state) => {
              cy.wrap($state).should("have.text", "accepted");
              cy.wrap($state, { timeout: 15000 }).should(
                "have.text",
                "provisioning"
              );
              cy.wrap($state, { timeout: 30000 }).should("have.text", "ready");
            });
          cy.get("td").eq(0).should("have.text", processorName).click();
        });

      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );

      cy.get("[class='pf-c-description-list__description']")
        .should("have.length", source.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", source[index]);
        });

      cy.ouiaId("filters", "PF4/Table").within(() => {
        filters.forEach((item, rowIndex) => {
          cy.ouiaId(item[0], "PF4/TableRow")
            .find("td")
            .each((cell, cellIndex) => {
              cy.wrap(cell).should("have.text", filters[rowIndex][cellIndex]);
            });
        });
      });
    });
  });

  describe("Edit Sink Processors", () => {
    let processorName: string;
    let action: string[];
    let filters: string[][];

    beforeEach(() => {
      cy.visit(
        "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/fa373030-c0d2-11ec-9d64-0242ac120002"
      );
      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );
      cy.ouiaId("edit", "PF4/Button").should("be.visible").click();

      processorName = "Processor two";
      action = [
        "Send to Slack",
        "test",
        "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
      ];
      filters = [["data.name", "processor.StringEquals", "John"]];
    });

    it.skip("Details Header", () => {
      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );
      cy.ouiaId("edit", "PF4/Button").should("be.visible");
      cy.ouiaId("processor-actions", "PF4/Dropdown")
        .should("be.visible")
        .within(() => {
          cy.ouiaId("actions-toggle", "PF4/DropdownToggle").click();
          cy.ouiaId("delete", "PF4/DropdownItem").should("be.visible");
        });
    });

    it("Edit Header", () => {
      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );
      cy.ouiaId("actions", "PF4/Dropdown").should("not.exist");
    });

    it("Name", () => {
      processorName += " - edit";
      cy.ouiaId("processor-name", "PF4/TextInput").clear().type(processorName);
      cy.ouiaId("submit", "PF4/Button").should("be.visible").click();

      assertProcessorDetails();
    });

    it("Name - Cancel", () => {
      cy.ouiaId("processor-name", "PF4/TextInput").type(" - edit");
      cy.ouiaId("cancel", "PF4/Button").should("be.visible").click();

      assertProcessorDetails();
    });

    it("Action - Parameters", () => {
      action[1] += " - edit";
      action[2] += "/edit";
      cy.ouiaId("channel", "PF4/TextInput").clear().type(action[1]);
      cy.ouiaId("webhookUrl", "PF4/TextInput").clear().type(action[2]);
      cy.ouiaId("submit", "PF4/Button").should("be.visible").click();

      assertProcessorDetails();
    });

    it("Add filter row", () => {
      filters[1] = ["data.surname", "processor.StringEquals", "White"];

      cy.ouiaId("add-filter", "PF4/Button").should("be.visible").click();

      cy.ouiaId("item-1").within(() => {
        cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
        cy.ouiaId("filter-type", "PF4/FormSelect").select("String equals");
      });
      //The filter-value was detached from DOM and we need to find the context again.
      cy.ouiaId("item-1")
        .ouiaId("filter-value", "PF4/TextInput")
        .type(filters[1][2]);

      cy.ouiaId("submit", "PF4/Button").should("be.visible").click();

      assertProcessorDetails();
    });

    function assertProcessorDetails() {
      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );

      cy.get("[class='pf-c-description-list__description']")
        .should("have.length", action.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", action[index]);
        });

      cy.ouiaId("filters", "PF4/Table").within(() => {
        filters.forEach((item, rowIndex) => {
          cy.ouiaId(item[0], "PF4/TableRow")
            .find("td")
            .each((cell, cellIndex) => {
              cy.wrap(cell).should("have.text", filters[rowIndex][cellIndex]);
            });
        });
      });
    }
  });
});
