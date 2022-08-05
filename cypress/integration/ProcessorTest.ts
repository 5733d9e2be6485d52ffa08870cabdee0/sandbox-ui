import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType, pageWasLoaded } from "../utils/Util";

const bugPresent: string =
  "The detail/edit page might be broken please check state of MGDOBR-797";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Processor Test", () => {
    /**
     * This test suite verifies that the user can create all types of processors.
     * Because it is running with mocked data we have to assert all data immediately (no reload of the page).
     */
    describe("Create a Processor", () => {
      beforeEach(() => {
        cy.visit("/instance/830c8f0d-c677-492f-8d7e-0f81893fbba6");
        pageWasLoaded();
      });

      it("Sink processor", () => {
        const processorName: string = "Sink processor";
        const action = ["Slack", "dev-action", "https://test.app.com/item"];
        const filters = [
          ["data.name", "String equals", "John"],
          ["data.surname", "String equals", "White"],
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
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0][1]);
        });
        cy.ouiaId("item-0") //The filter-value was detached from DOM and we need to find the context again.
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[0][2]);
        cy.ouiaId("item-1").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1][1]);
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
        cy.ouiaId("configuration").should("not.exist");
        cy.ouiaId("action-type", "PF4/FormSelect")
          .should("be.visible")
          .select(action[0]);
        cy.ouiaId("missing-actions", "PF4/TextInput").should("not.exist");

        //Configuration
        cy.ouiaId("configuration")
          .find("div.pf-c-form__group")
          .then((item) => {
            cy.wrap(item[0]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Channel")
                .should("be.visible");
              cy.get("input").type(action[1]);
            });
            cy.wrap(item[1]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Webhook URL")
                .should("be.visible");
              cy.get("input").type(action[2]);
            });
          });

        cy.ouiaId("submit").click();

        assertNewProcessorOnList(processorName);

        assertSinkProcessorDetails(
          processorName,
          "I want to write here something.",
          action,
          filters
        );
      });

      it("Source processor", () => {
        const processorName: string = "Source processor";
        const source = ["Slack Source", "dev channel", "asd14u-e"];
        const filters = [
          ["data.name", "String equals", "John"],
          ["data.surname", "String equals", "White"],
        ];
        cy.ouiaId("create-processor", "PF4/Button").click();
        cy.ouiaId("Create processor", "breadcrumb-item").should("be.visible");
        cy.ouiaId("source", "Tile").should("be.visible").click();
        cy.ouiaId("processor-name", "PF4/TextInput")
          .should("be.visible")
          .type(processorName);

        //Source
        cy.ouiaId("missing-sources", "PF4/TextInput")
          .should("be.visible")
          .should("be.disabled");
        cy.ouiaId("configuration").should("not.exist");
        cy.ouiaId("source-type", "PF4/FormSelect")
          .should("be.visible")
          .select(source[0]);
        cy.ouiaId("missing-source-parameters", "PF4/TextInput").should(
          "not.exist"
        );

        //Configuration
        cy.ouiaId("configuration")
          .find("div.pf-c-form__group")
          .then((item) => {
            cy.wrap(item[0]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Channel")
                .should("be.visible");
              cy.get("input").type(source[1]);
            });
            cy.wrap(item[1]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Token")
                .should("be.visible");
              cy.get("input").type(source[2]);
            });
          });

        //Filters
        cy.ouiaId("add-filter", "PF4/Button").should("be.visible").click();
        cy.ouiaId("item-0").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0][0]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0][1]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-0")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[0][2]);
        cy.ouiaId("item-1").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1][1]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-1")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[1][2]);

        cy.ouiaId("submit").click();

        assertNewProcessorOnList(processorName);

        assertSourceProcessorDetails(processorName, source, filters);
      });
    });

    describe("Edit Sink Processors", () => {
      let processorName: string;
      let transformation: string;
      let action: string[];
      let filters: string[][];

      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/fa373030-c0d2-11ec-9d64-0242ac120002"
        );
        pageWasLoaded();
        cy.ouiaId("edit", "PF4/Button").should("be.visible").click();

        processorName = "Processor two";
        action = [
          "Send to Slack",
          "test",
          "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
        ];
        transformation = "";
        filters = [["data.name", "String equals", "John"]];
      });

      it("Assert and cancel edit form", () => {
        cy.ouiaId("processor-name", "PF4/Text").should(
          "have.text",
          processorName
        );
        cy.ouiaId("edit", "PF4/Button").should("not.exist");
        cy.ouiaId("actions", "PF4/Dropdown").should("not.exist");
        cy.ouiaId("submit", "PF4/Button").should("be.enabled");
        cy.ouiaId("cancel", "PF4/Button").should("be.enabled").click();

        //Processor Detail
        cy.ouiaId("ready", "QE/ResourceStatus").should("be.visible");
        cy.ouiaId("edit", "PF4/Button")
          .should("be.visible")
          .should("have.attr", "aria-disabled", "false");
        cy.ouiaId("processor-actions", "PF4/Dropdown")
          .should("be.visible")
          .within(() => {
            cy.ouiaId("actions-toggle", "PF4/DropdownToggle").click();
            cy.ouiaId("delete", "PF4/DropdownItem").should("be.visible");
          });
        assertSinkProcessorDetails(
          processorName,
          transformation,
          action,
          filters
        );
      });

      onlyOn(bugPresent, () => {
        it("Add filter row", () => {
          filters[1] = ["data.surname", "String equals", "White"];

          cy.ouiaId("add-filter", "PF4/Button").click();

          cy.ouiaId("item-1").within(() => {
            cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1][0]);
            cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1][1]);
          });
          //The filter-value was detached from DOM and we need to find the context again.
          cy.ouiaId("item-1")
            .ouiaId("filter-value", "PF4/TextInput")
            .type(filters[1][2]);

          cy.ouiaId("submit", "PF4/Button").should("be.visible").click();

          //Processor Detail
          cy.ouiaId("accepted", "QE/ResourceStatus").should("be.visible");
          cy.ouiaId("edit", "PF4/Button")
            .should("be.visible")
            .should("have.attr", "aria-disabled", "true");
          cy.ouiaId("processor-actions", "PF4/Dropdown")
            .should("be.visible")
            .within(() => {
              cy.ouiaId("actions-toggle", "PF4/DropdownToggle").click();
              cy.ouiaId("delete", "PF4/DropdownItem")
                .should("be.visible")
                .should("have.attr", "aria-disabled", "true");
            });
          assertSinkProcessorDetails(
            processorName,
            transformation,
            action,
            filters
          );
        });
      });
    });

    describe("Edit Source Processors", () => {
      let processorName: string;
      let source: string[];
      let filters: string[][];

      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/sourcef4-ead8-6g8v-as8e-0642tdjek002"
        );
        pageWasLoaded();
        cy.ouiaId("edit", "PF4/Button").should("be.visible").click();

        processorName = "Processor four";
        source = [
          "Slack",
          "test-ui",
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ];
        filters = [[]];
      });

      it("Assert and cancel edit form", () => {
        cy.ouiaId("processor-name", "PF4/Text").should(
          "have.text",
          processorName
        );
        cy.ouiaId("edit", "PF4/Button").should("not.exist");
        cy.ouiaId("actions", "PF4/Dropdown").should("not.exist");
        cy.ouiaId("submit", "PF4/Button").should("be.enabled");
        cy.ouiaId("cancel", "PF4/Button").should("be.enabled").click();

        //Processor Detail
        cy.ouiaId("ready", "QE/ResourceStatus").should("be.visible");
        cy.ouiaId("edit", "PF4/Button")
          .should("be.visible")
          .should("have.attr", "aria-disabled", "false");
        cy.ouiaId("processor-actions", "PF4/Dropdown")
          .should("be.visible")
          .within(() => {
            cy.ouiaId("actions-toggle", "PF4/DropdownToggle").click();
            cy.ouiaId("delete", "PF4/DropdownItem").should("be.visible");
          });
        assertSourceProcessorDetails(processorName, source, filters);
      });

      onlyOn(bugPresent, () => {
        it("Add filter row", () => {
          if (bugPresent) {
            cy.log(bugPresent);
            return;
          }

          filters[0] = ["data.surname", "String equals", "White"];

          cy.ouiaId("add-filter", "PF4/Button").click();

          cy.ouiaId("item-0").within(() => {
            cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0][0]);
            cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0][1]);
          });
          //The filter-value was detached from DOM and we need to find the context again.
          cy.ouiaId("item-0")
            .ouiaId("filter-value", "PF4/TextInput")
            .type(filters[0][2]);

          cy.ouiaId("submit", "PF4/Button").should("be.visible").click();

          //Processor Detail
          cy.ouiaId("accepted", "QE/ResourceStatus").should("be.visible");
          cy.ouiaId("edit", "PF4/Button")
            .should("be.visible")
            .should("have.attr", "aria-disabled", "true");
          cy.ouiaId("processor-actions", "PF4/Dropdown")
            .should("be.visible")
            .within(() => {
              cy.ouiaId("actions-toggle", "PF4/DropdownToggle").click();
              cy.ouiaId("delete", "PF4/DropdownItem")
                .should("be.visible")
                .should("have.attr", "aria-disabled", "true");
            });
          assertSourceProcessorDetails(processorName, source, filters);
        });
      });
    });

    function assertNewProcessorOnList(processorName: string) {
      pageWasLoaded();
      cy.ouiaId("Processors list table", "PF4/Table")
        .ouiaId(processorName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td")
            .eq(3)
            .then(($state) => {
              cy.wrap($state)
                .ouiaId("creating", "PF4/Button")
                .should("have.text", "Creating");
              cy.wrap($state, { timeout: 45000 }).should("have.text", "Ready");
            });
          cy.get("td")
            .eq(0)
            .should("have.text", processorName, { timeout: 7000 })
            .click();
        });
    }

    function assertSinkProcessorDetails(
      processorName: string,
      transformation: string,
      action: string[],
      filters: string[][]
    ) {
      if (bugPresent) {
        cy.log(bugPresent);
        return;
      }
      const actionKeys: string[] = ["Action type", "Channel", "Webhook URL"];

      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );

      cy.ouiaId("type", "PF4/Text").should("have.text", "Processor type");
      cy.get("[data-testid='processor-type-label']").should(
        "have.text",
        "Sink"
      );

      cy.ouiaId("transformation-section", "PF4/Text").should(
        "have.text",
        "Transformation"
      );
      if (transformation) {
        cy.get("code").should("have.text", transformation);
      } else {
        cy.ouiaId("no-transformation", "PF4/Text");
      }

      cy.ouiaId("action-section", "PF4/Text").should("have.text", "Action");
      cy.get("[class='pf-c-description-list__term']")
        .should("have.length", action.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", actionKeys[index]);
        });
      cy.get("[class='pf-c-description-list__description']")
        .should("have.length", action.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", action[index]);
        });

      assertFilters(filters);

      cy.ouiaId("source-section", "PF4/Text").should("not.exist");
    }

    function assertSourceProcessorDetails(
      processorName: string,
      source: string[],
      filters: string[][]
    ) {
      if (bugPresent) {
        cy.log(bugPresent);
        return;
      }
      const sourceKeys: string[] = ["Source type", "Channel", "Token"];

      cy.ouiaId("processor-name", "PF4/Text").should(
        "have.text",
        processorName
      );

      cy.ouiaId("type", "PF4/Text").should("have.text", "Processor type");
      cy.get("[data-testid='processor-type-label']").should(
        "have.text",
        "Source"
      );

      cy.ouiaId("source-section", "PF4/Text").should("have.text", "Source");
      cy.get("[class='pf-c-description-list__term']")
        .should("have.length", sourceKeys.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", sourceKeys[index]);
        });

      cy.get("[class='pf-c-description-list__description']")
        .should("have.length", source.length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", source[index]);
        });

      assertFilters(filters);

      cy.ouiaId("action-section", "PF4/Text").should("not.exist");
      cy.ouiaId("transformation-section", "PF4/Text").should("not.exist");
    }

    function assertFilters(filters: string[][]) {
      const filtersHeader: string[] = ["Key", "Type", "Value"];

      cy.ouiaId("filters-section", "PF4/Text").should("have.text", "Filters");
      if (filters?.length > 0 && filters[0].length > 0) {
        cy.ouiaId("filters", "PF4/Table").within(() => {
          cy.ouiaId("table-head", "PF4/TableRow")
            .find("th")
            .each((headCell, headIndex) => {
              cy.wrap(headCell).should("have.text", filtersHeader[headIndex]);
            });
          filters.forEach((item, rowIndex) => {
            cy.ouiaId(item[0], "PF4/TableRow")
              .find("td")
              .each((cell, cellIndex) => {
                cy.wrap(cell).should("have.text", filters[rowIndex][cellIndex]);
              });
          });
          cy.ouiaType("PF4/TableRow").should("have.length", filters.length + 1);
        });
      } else {
        cy.ouiaId("no-filters", "PF4/Text");
      }
    }
  });
});
