import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType, pageWasLoaded } from "../utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Action Test", () => {
    /**
     * This test suite verifies that actions are possible to modify and set the particular parameters.
     */
    describe("Create a Sink Processor", () => {
      const instanceUrl: string =
        "/instance/830c8f0d-c677-492f-8d7e-0f81893fbba6";

      beforeEach(() => {
        const processorName: string = "Sink processor";
        cy.visit(`${instanceUrl}/create-processor`);
        pageWasLoaded();

        cy.ouiaId("sink", "Tile").should("be.visible").click();
        cy.ouiaId("processor-name", "PF4/TextInput")
          .should("be.visible")
          .type(processorName);
      });

      it("The actions' selector contains values", () => {
        const actions = [
          "Select an action",
          "Ansible Tower Job Template",
          "Kafka Topic",
          "Send To Bridge",
          "Slack",
          "Webhook",
          "AWS Lambda",
          "Google PubSub",
          "Azure EventHubs",
        ];

        cy.ouiaId("action-type", "PF4/FormSelect")
          .find("option")
          .should("have.length", actions.length)
          .each((item, index) => {
            cy.wrap(item).should("have.text", actions[index]);
          });
      });

      it("The default state of the configuration", () => {
        //mention only for purpose to make actions visible
        cy.get("#processor-form-container").scrollTo("bottom");

        cy.ouiaId("missing-actions", "PF4/TextInput")
          .should("be.visible")
          .should("be.disabled");
        cy.ouiaId("configuration").should("not.exist");
      });

      describe("Send to Bridge", () => {
        beforeEach(() => {
          cy.ouiaId("action-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Send To Bridge");
          cy.ouiaId("missing-actions", "PF4/TextInput").should("not.exist");
          cy.ouiaId("configuration").should("be.visible");
        });

        it("Check parameters", () => {
          cy.ouiaId("configuration").within(() => {
            cy.ouiaType("config-parameter").should("have.length", 1);
            cy.ouiaId("bridgeId", "config-parameter").should("be.visible");
          });
        });

        it("Return to the default state", () => {
          cy.ouiaId("action-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Select an action");
          cy.ouiaId("missing-actions", "PF4/TextInput")
            .should("be.visible")
            .should("be.disabled");
          cy.ouiaId("configuration").should("not.exist");
        });

        it("Save the empty optional parameter - Send to Bridge", () => {
          cy.ouiaId("action-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Send To Bridge");
          cy.ouiaId("missing-actions", "PF4/TextInput").should("not.exist");
          cy.ouiaId("configuration")
            .should("be.visible")
            .within(() => {
              cy.ouiaType("config-parameter").should("have.length", 1);
              cy.ouiaId("bridgeId", "config-parameter").should("be.visible");
            });
          cy.ouiaId("submit").click();
          cy.url().should("eq", `${Cypress.config().baseUrl}${instanceUrl}`);
        });
      });

      describe("Slack", () => {
        beforeEach(() => {
          cy.ouiaId("action-type", "PF4/FormSelect")
            .should("be.visible")
            .select("Slack");
          cy.ouiaId("missing-actions", "PF4/TextInput").should("not.exist");
          cy.ouiaId("configuration").should("be.visible");
        });

        it("Check parameters", () => {
          //mention only for purpose to make parameters visible
          cy.get("#processor-form-container").scrollTo("bottom");

          cy.ouiaId("configuration").within(() => {
            cy.ouiaType("config-parameter").should("have.length", 5);
            cy.ouiaId("slack_channel", "config-parameter")
              .should("be.visible")
              .should("contain", "Example: #myroom");
            cy.ouiaId("slack_webhook_url", "config-parameter").should(
              "be.visible"
            );
            cy.ouiaId("slack_icon_emoji", "config-parameter").should(
              "be.visible"
            );
            cy.ouiaId("slack_icon_url", "config-parameter").should(
              "be.visible"
            );
            cy.ouiaId("slack_username", "config-parameter").should(
              "be.visible"
            );
          });
        });

        it("Save the required parameter without any value", () => {
          cy.ouiaId("submit").click();
          //mention only for purpose to make parameters visible
          cy.get("#processor-form-container").scrollTo("bottom");

          cy.ouiaId("configuration")
            .should("be.visible")
            .within(() => {
              cy.ouiaId("slack_channel", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should(
                  "contain",
                  "must have required property 'slack_channel'"
                );
              cy.ouiaId("slack_webhook_url", "config-parameter").within(() => {
                cy.get("div.pf-m-error")
                  .should("be.visible")
                  .should(
                    "contain",
                    "must have required property 'slack_webhook_url'"
                  );
                //insert any value
                cy.root().type("aaa");

                //it is not in the desired format
                cy.get("div.pf-m-error")
                  .should("be.visible")
                  .should("contain", "must match pattern");

                //insert a expected value
                cy.root().type("https://any.test.com/slack");
                cy.get("div.pf-m-error").should("not.exist");
              });
              cy.ouiaId("slack_icon_emoji", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should("not.exist");
              cy.ouiaId("slack_icon_url", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should("not.exist");
              cy.ouiaId("slack_username", "config-parameter")
                .should("be.visible")
                .find("div.pf-m-error")
                .should("not.exist");
            });
        });
      });
    });
    describe("Details of a Sink Processor", () => {
      beforeEach(() => {
        cy.visit(
          "instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/fa373030-c0d2-11ec-9d64-0242ac120002"
        );
        pageWasLoaded();
      });

      it("The editing is partially allowed", () => {
        const configOuiaId = [
          "slack_channel",
          "slack_webhook_url",
          "slack_icon_emoji",
          "slack_icon_url",
          "slack_username",
        ];
        cy.ouiaId("edit", "PF4/Button").click();
        cy.ouiaId("processor-name", "PF4/TextInput").should("be.disabled");
        cy.ouiaId("action-type", "PF4/FormSelect").should("be.disabled");
        cy.ouiaId("actions", "form-section").within(() => {
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
