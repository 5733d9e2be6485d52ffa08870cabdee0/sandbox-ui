import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType, pageWasLoaded } from "../utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Source Test", () => {
    /**
     * This test suite verifies that sources are possible to modify and set the particular parameters.
     */
    describe("Create a Source Processor", () => {
      const instanceUrl: string =
        "/instance/830c8f0d-c677-492f-8d7e-0f81893fbba6";

      beforeEach(() => {
        const processorName: string = "Source processor";
        cy.visit(`${instanceUrl}/create-processor`);
        pageWasLoaded();
        cy.ouiaId("source", "Tile").should("be.visible").click();
        cy.ouiaId("processor-name", "PF4/TextInput")
          .should("be.visible")
          .type(processorName);
      });

      it("The source's selector contains values", () => {
        const source = [
          "Select a source",
          "Aws S3 Source",
          "Dummy Source",
          "Aws Sqs Source",
          "Slack Source",
          "Google PubSub Source",
          "Azure EventHub Source",
        ];

        cy.ouiaId("source-type", "PF4/FormSelect")
          .find("option")
          .should("have.length", source.length)
          .each((item, index) => {
            cy.wrap(item).should("have.text", source[index]);
          });
      });

      it("The default state of the configuration", () => {
        cy.ouiaId("missing-sources", "PF4/TextInput")
          .scrollIntoView()
          .should("be.visible")
          .should("be.disabled");
        cy.ouiaId("configuration").should("not.exist");
      });

      describe("Slack Source", () => {
        beforeEach(() => {
          cy.ouiaId("source-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Slack Source");
          cy.ouiaId("missing-sources", "PF4/TextInput").should("not.exist");
          cy.ouiaId("configuration").should("be.visible");
        });

        it("Check parameters", () => {
          cy.ouiaId("configuration").within(() => {
            cy.ouiaType("config-parameter").should("have.length", 4);
            cy.ouiaId("slack_channel", "config-parameter")
              .should("be.visible")
              .should("contain", "Example: #myroom");
            cy.ouiaId("slack_token", "config-parameter").should("be.visible");
            cy.ouiaId("slack_delay", "config-parameter")
              .should("be.visible")
              .should("contain", "Example: 1s");
            cy.ouiaId("kafka_topic", "config-parameter").should("be.visible");
          });
        });

        it("Save the required parameter without any value", () => {
          cy.ouiaId("submit").click();
          cy.ouiaId("configuration")
            .should("be.visible")
            .scrollIntoView()
            .within(() => {
              //required parameters
              cy.ouiaId("slack_channel", "config-parameter").within(() => {
                cy.get("div.pf-m-error")
                  .should("be.visible")
                  .should(
                    "contain",
                    "must have required property 'slack_channel'"
                  );
                //insert any value
                cy.root().type("#aaa");

                cy.get("div.pf-m-error").should("not.exist");
              });
              cy.ouiaId("slack_token", "config-parameter").within(() => {
                cy.get("div.pf-m-error")
                  .should("be.visible")
                  .should(
                    "contain",
                    "must have required property 'slack_token'"
                  );
                //insert any value
                cy.root().type("ccc");
                cy.get("div.pf-m-error").should("not.exist");
              });

              //optional parameters
              cy.ouiaId("slack_delay", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should("not.exist");
              cy.ouiaId("kafka_topic", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should("not.exist");
            });
        });
      });

      describe("Dummy Source", () => {
        beforeEach(() => {
          cy.ouiaId("source-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Dummy Source");
          cy.ouiaId("missing-sources", "PF4/TextInput").should("not.exist");
          cy.ouiaId("configuration").should("be.visible");
        });

        it("Check parameters", () => {
          cy.ouiaId("configuration").within(() => {
            cy.ouiaType("config-parameter").should("have.length", 1);
            cy.ouiaId("dummyId", "config-parameter").should("be.visible");
          });
        });

        it("Return to the default state", () => {
          cy.ouiaId("source-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Select a source");
          cy.ouiaId("missing-sources", "PF4/TextInput")
            .should("be.visible")
            .should("be.disabled");
          cy.ouiaId("configuration").should("not.exist");
        });

        it("Save the empty optional parameter", () => {
          cy.ouiaId("configuration")
            .should("be.visible")
            .within(() => {
              cy.ouiaType("config-parameter").should("have.length", 1);
              cy.ouiaId("dummyId", "config-parameter").should("be.visible");
            });
          cy.ouiaId("submit").click();
          cy.url().should("eq", `${Cypress.config().baseUrl}${instanceUrl}`);
        });

        it("Save the pattern optional parameter", () => {
          cy.ouiaId("configuration")
            .should("be.visible")
            .within(() => {
              cy.ouiaType("config-parameter").should("have.length", 1);
              cy.ouiaId("dummyId", "config-parameter")
                .should("be.visible")
                .should(
                  "contain",
                  "Example: f1fbd010-93cf-4be1-aa78-b37ba48858fe"
                )
                .type("aaa");
            });
          cy.ouiaId("submit").click();

          cy.ouiaId("configuration")
            .ouiaId("dummyId", "config-parameter")
            .within(() => {
              cy.get("div.pf-m-error")
                .should("be.visible")
                .should("contain", "must match pattern");
              //insert any value
              cy.root().type("f1fbd010-93cf-4be1-aa78-b37ba48858fe");

              cy.get("div.pf-m-error").should("not.exist");
            });
          cy.ouiaId("submit").click();
          cy.url().should("eq", `${Cypress.config().baseUrl}${instanceUrl}`);
        });
      });
    });

    describe("Details of a Source Processor", () => {
      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/sourcef4-ead8-6g8v-as8e-0642tdjek002"
        );
        pageWasLoaded();
      });

      it("The editing is partially allowed", () => {
        const configOuiaId = [
          "slack_channel",
          "slack_token",
          "slack_delay",
          "kafka_topic",
        ];
        cy.ouiaId("edit", "PF4/Button").click();
        cy.ouiaId("processor-name", "PF4/TextInput").should("be.disabled");
        cy.ouiaId("source-type", "PF4/FormSelect").should("be.disabled");
        cy.ouiaId("sources", "form-section").within(() => {
          cy.ouiaType("config-parameter").should(
              "have.length",
              configOuiaId.length
          );
          configOuiaId.forEach((ouiaId) => {
            cy.ouiaId(ouiaId, "config-parameter")
                .find("input")
                .scrollIntoView()
                .should("be.visible")
                .should("be.enabled");
          });
        });
      });
    });
  });
});
