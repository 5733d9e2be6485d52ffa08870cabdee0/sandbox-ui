import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType, pageWasLoaded } from "../utils/Util";

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
        const action = {
          "Action type": "Slack",
          "Channel": "dev-action",
          "Webhook URL": "https://test.app.com/item",
          "Icon Emoji": "Property not configured",
          "Icon URL": "Property not configured",
          "Username": "Property not configured",
        };
        const filters: { [key in "Key" | "Type" | "Value"]: string }[] = [
          { Key: "data.name", Type: "String equals", Value: "John" },
          { Key: "data.surname", Type: "String equals", Value: "White" },
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
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0]["Type"]);
        });
        cy.ouiaId("item-0") //The filter-value was detached from DOM and we need to find the context again.
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[0]["Value"]);
        cy.ouiaId("item-1").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1]["Type"]);
        });
        cy.ouiaId("item-1") //The filter-value was detached from DOM and we need to find the context again.
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[1]["Value"]);

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
          .select(action["Action type"]);
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
              cy.get("input").type(action["Channel"]);
            });
            cy.wrap(item[1]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Webhook URL")
                .should("be.visible");
              cy.get("input").type(action["Webhook URL"]);
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
        const source = {
          "Source type": "Slack Source",
          "Channel": "dev channel",
          "Token": "asd14u-e",
          "Delay": "Property not configured",
          "Topic Names": "Property not configured",
        };
        const filters: { [key in "Key" | "Type" | "Value"]: string }[] = [
          { Key: "data.name", Type: "String equals", Value: "John" },
          { Key: "data.surname", Type: "String equals", Value: "White" },
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
          .select(source["Source type"]);
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
              cy.get("input").type(source["Channel"]);
            });
            cy.wrap(item[1]).within(() => {
              cy.get("div")
                .first()
                .should("contain.text", "Token")
                .should("be.visible");
              cy.get("input").type(source["Token"]);
            });
          });

        //Filters
        cy.ouiaId("add-filter", "PF4/Button").should("be.visible").click();
        cy.ouiaId("item-0").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0]["Type"]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-0")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[0]["Value"]);
        cy.ouiaId("item-1").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1]["Type"]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-1")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[1]["Value"]);

        cy.ouiaId("submit").click();

        assertNewProcessorOnList(processorName);

        assertSourceProcessorDetails(processorName, source, filters);
      });
    });

    describe("Edit Sink Processors", () => {
      let processorName: string;
      let transformation: string;
      let action: { [key: string]: string };
      let filters: { [key in "Key" | "Type" | "Value"]: string }[];

      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/fa373030-c0d2-11ec-9d64-0242ac120002"
        );
        pageWasLoaded();
        cy.ouiaId("edit", "PF4/Button").should("be.visible").click();

        processorName = "Processor two";
        action = {
          "Action type": "Slack",
          "Channel": "test",
          "Webhook URL":
            "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
          "Icon Emoji": "Property not configured",
          "Icon URL": "Property not configured",
          "Username": "Property not configured",
        };

        transformation = "";
        filters = [{ Key: "data.name", Type: "String equals", Value: "John" }];
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

      it("Add filter row", () => {
        filters.push({
          Key: "data.surname",
          Type: "String equals",
          Value: "White",
        });

        cy.ouiaId("add-filter", "PF4/Button").click();

        cy.ouiaId("item-1").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[1]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[1]["Type"]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-1")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[1]["Value"]);

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

    describe("Edit Source Processors", () => {
      let processorName: string;
      let source: { [key: string]: string };
      let filters: { [key in "Key" | "Type" | "Value"]: string }[];

      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/sourcef4-ead8-6g8v-as8e-0642tdjek002"
        );
        pageWasLoaded();
        cy.ouiaId("edit", "PF4/Button").should("be.visible").click();

        processorName = "Processor four";
        source = {
          "Source type": "Slack Source",
          "Channel": "#test",
          "Token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "Delay": "Property not configured",
          "Topic Names": "Property not configured",
        };
        filters = [];
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

      it("Add filter row", () => {
        filters.push({
          Key: "data.surname",
          Type: "String equals",
          Value: "White",
        });

        cy.ouiaId("add-filter", "PF4/Button").click();

        cy.ouiaId("item-0").within(() => {
          cy.ouiaId("filter-key", "PF4/TextInput").type(filters[0]["Key"]);
          cy.ouiaId("filter-type", "PF4/FormSelect").select(filters[0]["Type"]);
        });
        //The filter-value was detached from DOM and we need to find the context again.
        cy.ouiaId("item-0")
          .ouiaId("filter-value", "PF4/TextInput")
          .type(filters[0]["Value"]);

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
            .find("a")
            .click();
        });
    }

    function assertSinkProcessorDetails(
      processorName: string,
      transformation: string,
      action: { [key: string]: string },
      filters: { [key in "Key" | "Type" | "Value"]: string }[]
    ) {
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
      cy.get(".pf-c-description-list__term")
        .should("have.length", Object.keys(action).length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", Object.keys(action)[index]);
        });
      cy.get(".pf-c-description-list__description")
        .should("have.length", Object.keys(action).length)
        .each((element, index) => {
          const currentKey: string = Object.keys(action)[index];
          if (currentKey !== "Webhook URL") {
            cy.wrap(element).should("have.text", action[currentKey]);
          } else {
            cy.wrap(element).should("have.text", "**************************");
          }
        });

      assertFilters(filters);

      cy.ouiaId("source-section", "PF4/Text").should("not.exist");
    }

    function assertSourceProcessorDetails(
      processorName: string,
      source: { [key: string]: string },
      filters: { [key in "Key" | "Type" | "Value"]: string }[]
    ) {
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
      cy.get(".pf-c-description-list__term")
        .should("have.length", Object.keys(source).length)
        .each((element, index) => {
          cy.wrap(element).should("have.text", Object.keys(source)[index]);
        });

      cy.get(".pf-c-description-list__description")
        .should("have.length", Object.keys(source).length)
        .each((element, index) => {
          const currentKey: string = Object.keys(source)[index];
          if (currentKey !== "Token") {
            cy.wrap(element).should("have.text", source[currentKey]);
          } else {
            cy.wrap(element).should("have.text", "**************************");
          }
        });

      assertFilters(filters);

      cy.ouiaId("action-section", "PF4/Text").should("not.exist");
      cy.ouiaId("transformation-section", "PF4/Text").should("not.exist");
    }

    function assertFilters(
      filters: { [key in "Key" | "Type" | "Value"]: string }[]
    ) {
      cy.ouiaId("filters-section", "PF4/Text").should("have.text", "Filters");
      if (filters?.length > 0) {
        cy.ouiaId("filters", "PF4/Table").within(() => {
          cy.ouiaId("table-head", "PF4/TableRow")
            .find("th")
            .each((headCell, headIndex) => {
              cy.wrap(headCell).should(
                "have.text",
                Object.keys(filters[0])[headIndex]
              );
            });
          filters.forEach((item) => {
            cy.ouiaId(item["Key"], "PF4/TableRow")
              .find("td")
              .each((cell, cellIndex) => {
                cy.wrap(cell).should(
                  "have.text",
                  item[Object.keys(item)[cellIndex] as "Key" | "Type" | "Value"]
                );
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
