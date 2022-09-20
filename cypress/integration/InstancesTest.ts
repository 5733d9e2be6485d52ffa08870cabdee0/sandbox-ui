import { onlyOn } from "@cypress/skip-test";
import { format } from "date-fns";
import {
  createInstance,
  deleteInstance,
  waitTillInstanceIsReady,
  deletedInstanceNotExist,
  safeLogin,
  uniqueName,
  isEnvironmentType,
  EnvType,
  pageWasLoaded,
  progressStepStatus,
  SEStepStatus,
} from "../utils/Util";

const formatDate = (dateStr: string): string =>
  format(new Date(dateStr), "PPPP p");

const createdInstances = [
  uniqueName("new-instance"),
  "error-test", //this instance should be in the workspace
  uniqueName("canceled-instance"),
];

describe("Instances Test", () => {
  describe("the 'Create a SE instance' Modal", () => {
    beforeEach(() => {
      cy.visit("/");
      safeLogin();
      pageWasLoaded();
    });

    onlyOn(isEnvironmentType(EnvType.Dev), () => {
      after(() => {
        cy.reload();
        pageWasLoaded();
        const instanceName: string = createdInstances[0];
        deleteInstance(instanceName);
        cy.ouiaId("Instances list table", "PF4/Table").within(() => {
          // once delete confirmed, state should change
          cy.ouiaId(instanceName, "PF4/TableRow")
            .find("td")
            .eq(2)
            .should("have.text", "Deleting");

          // once deprovision is completed, entry should disappear
          cy.ouiaId(instanceName, "PF4/TableRow", { timeout: 120000 }).should(
            "not.exist"
          );
        });
      });
    });

    it("Submit", () => {
      const newInstanceName: string = createdInstances[0];
      createInstance(newInstanceName);

      //Assertation that the process of creation the instance is monitored
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.text", newInstanceName);
          cy.get("td:nth-child(3)")
            .ouiaId("accepted", "QE/ResourceStatus")
            .within(() => {
              cy.get("span[role='progressbar']").should("exist");
              cy.ouiaId("creating", "PF4/Button").should(
                "have.text",
                "Creating"
              );
              cy.ouiaId("ready-shortly", "QE/HelperTextItem").should(
                "have.text",
                "This will be ready shortly."
              );
            });
          cy.ouiaId("creating", "PF4/Button").click();
        });

      cy.ouiaId("se-status", "QE/Popover")
        .should("be.visible")
        .within(() => {
          cy.ouiaType("QE/StackItem").should("have.length", "3");
          cy.ouiaId("info-banner", "QE/StackItem")
            .ouiaId("ready-shortly", "PF4/Text")
            .should("be.visible");
          cy.ouiaId("steps-count", "QE/StackItem").should(
            "have.text",
            "0 of 3 steps completed"
          );
          //TODO: There should be a check that all steps are met but I did not know how to do it for Mocked Env
          //It seems that '1 of 3' is skipped and `2 of 3` is here only for few secs.
          //Each step is asserted with the mocked version
        });
      cy.ouiaId("se-status", "QE/Popover", { timeout: 180000 }).should(
        "not.exist"
      );

      //Assertation that the instance was created
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .within(() => {
          cy.get(
            "td:first a[data-testid='tableInstances-linkInstance']"
          ).should("be.visible");
          cy.ouiaId("ready", "QE/ResourceStatus")
            .should("be.visible")
            .should("have.text", "Ready");
        });
    });

    it("Submit and expect error", () => {
      const newInstanceName: string = createdInstances[1];
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
            cy.ouiaId("submit", "PF4/Button").click();
            cy.ouiaId("error-instance-create-fail", "PF4/Alert").should(
              "have.text",
              "Danger alert:Address form errors to proceed."
            );
          });
      });
    });

    it("Cancel", () => {
      const newInstanceName: string = createdInstances[2];
      createInstance(newInstanceName, "cancel");

      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("not.exist");
    });

    onlyOn(isEnvironmentType(EnvType.Mocked), () => {
      describe("Instance List pagination test", () => {
        it("Select other page", () => {
          cy.get("[aria-label='Go to first page']").should("be.disabled");
          cy.get("[aria-label='Go to previous page']").should("be.disabled");
          cy.get("[aria-label='Go to last page']").should("not.be.disabled");
          cy.get("[aria-label='Go to next page']").should("not.be.disabled");

          // Go to next page
          cy.get("[aria-label='Go to next page']").first().click();
          cy.get("[aria-label='Go to first page']").should("not.be.disabled");
          cy.get("[aria-label='Go to previous page']").should(
            "not.be.disabled"
          );

          // as currently count of instances are covered in 2 pages
          cy.get("[aria-label='Go to last page']").should("be.disabled");
          cy.get("[aria-label='Go to next page']").should("be.disabled");

          // Go to previous page
          cy.get("[aria-label='Go to previous page']").first().click();
          cy.get("[aria-label='Go to first page']").should("be.disabled");
          cy.get("[aria-label='Go to previous page']").should("be.disabled");
          cy.get("[aria-label='Go to last page']").should("not.be.disabled");
          cy.get("[aria-label='Go to next page']").should("not.be.disabled");
        });

        it("Change page size", () => {
          cy.ouiaType("PF4/DropdownToggle").should("be.visible");
          cy.ouiaId(
            "OUIA-Generated-DropdownToggle-1",
            "PF4/DropdownToggle"
          ).click();
          cy.get(".pf-c-options-menu__menu")
            .find("li")
            .then(($cells) => {
              expect($cells).have.length(4);
              expect($cells.eq(0)).have.text("10 per page");
              expect($cells.eq(1)).have.text("20 per page");
              expect($cells.eq(2)).have.text("50 per page");
              expect($cells.eq(3)).have.text("100 per page");
            });

          // page size is changed
          cy.contains("20 per page").click();
          cy.get(".pf-c-pagination__total-items >b:nth-of-type(1)").then(
            (count) => {
              let size = count.text();
              let perPageSize = parseInt(size.slice(-2));
              cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
                (count) => {
                  let totalInstanceCount = parseInt(count.text());
                  cy.wrap(perPageSize).should("be.lte", totalInstanceCount);
                }
              );
            }
          );
        });

        it("Page size after creating a new Instance ", () => {
          cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
            (count) => {
              let initialInstanceCount = parseInt(count.text());
              createInstance("newInstance");
              waitTillInstanceIsReady("newInstance");
              cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
                (count) => {
                  let instanceCountAfterCreate = parseInt(count.text());
                  expect(instanceCountAfterCreate).to.be.equal(
                    initialInstanceCount + 1
                  );
                }
              );
            }
          );
        });

        it("Page size after deleting an Instance ", () => {
          cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
            (count) => {
              let initialInstanceCount = parseInt(count.text());
              deleteInstance("Instance ten");
              deletedInstanceNotExist("Instance ten");
              cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
                (count) => {
                  let instanceCountAfterDelete = parseInt(count.text());
                  expect(instanceCountAfterDelete).to.be.equal(
                    initialInstanceCount - 1
                  );
                }
              );
            }
          );
        });
      });
    });
  });

  onlyOn(isEnvironmentType(EnvType.Mocked), () => {
    describe("the Instance statuses", () => {
      beforeEach(() => {
        cy.visit("/");
        pageWasLoaded();
      });

      it("Accepted", () => {
        const instanceName: string = "Instance three";
        cy.ouiaId("Instances list table", "PF4/Table")
          .ouiaId(instanceName, "PF4/TableRow")
          .should("be.visible")
          .within(() => {
            //the name does not contain a link at the detail page
            cy.get("td:first").should("have.html", instanceName);
            //the status
            cy.get("td:nth-child(3)")
              .ouiaId("accepted", "QE/ResourceStatus")
              .within(() => {
                cy.get("span[role='progressbar']").should("exist");
                cy.ouiaId("creating", "PF4/Button").should(
                  "have.text",
                  "Creating"
                );
                cy.ouiaId("longer-than-expected", "PF4/Alert").should(
                  "have.text",
                  "Danger alert:This is taking longer than expected."
                );
              });
            cy.get("td:nth-child(4)")
              .click()
              .within(() => {
                cy.ouiaType("PF4/DropdownItem").then(($items) => {
                  expect($items.eq(0)).have.text("Details");
                  expect($items.eq(0)).be.enabled;
                  expect($items.eq(1)).have.text("Delete instance");
                  expect($items.eq(1)).have.attr("aria-disabled", "true");
                });
              });
            cy.ouiaId("creating", "PF4/Button").click();
          });
        cy.ouiaId("se-status", "QE/Popover")
          .should("be.visible")
          .within(() => {
            cy.ouiaType("QE/StackItem").should("have.length", "3");
            cy.ouiaId("info-banner", "QE/StackItem")
              .ouiaId("longer-than-expected", "PF4/Alert")
              .should("be.visible");
            cy.ouiaId("steps-count", "QE/StackItem").should(
              "have.text",
              "0 of 3 steps completed"
            );
            cy.ouiaId("steps", "QE/StackItem").within(() => {
              progressStepStatus(
                SEStepStatus.Info,
                "pending",
                "Creation pending"
              );
              progressStepStatus(
                SEStepStatus.Default,
                "preparing",
                "Preparing"
              );
              progressStepStatus(
                SEStepStatus.Default,
                "provisioning",
                "Provisioning"
              );
            });
          });
      });

      it("Provisioning", () => {
        const instanceName: string = "Instance four";
        cy.ouiaId("Instances list table", "PF4/Table")
          .ouiaId(instanceName, "PF4/TableRow")
          .should("be.visible")
          .within(() => {
            //the name does not contain a link at the detail page
            cy.get("td:first").should("have.html", instanceName);
            //the status
            cy.get("td:nth-child(3)")
              .ouiaId("provisioning", "QE/ResourceStatus")
              .within(() => {
                cy.get("span[role='progressbar']").should("exist");
                cy.ouiaId("creating", "PF4/Button").should(
                  "have.text",
                  "Creating"
                );
                cy.ouiaId("longer-than-expected", "PF4/Alert").should(
                  "have.text",
                  "Danger alert:This is taking longer than expected."
                );
              });
            cy.get("td:nth-child(4)")
              .click()
              .within(() => {
                cy.ouiaType("PF4/DropdownItem").then(($items) => {
                  expect($items.eq(0)).have.text("Details");
                  expect($items.eq(0)).be.enabled;
                  expect($items.eq(1)).have.text("Delete instance");
                  expect($items.eq(1)).have.attr("aria-disabled", "true");
                });
              });
            cy.ouiaId("creating", "PF4/Button").click();
          });
        cy.ouiaId("se-status", "QE/Popover")
          .should("be.visible")
          .within(() => {
            cy.ouiaType("QE/StackItem").should("have.length", "3");
            cy.ouiaId("info-banner", "QE/StackItem")
              .ouiaId("longer-than-expected", "PF4/Alert")
              .should("be.visible");
            cy.ouiaId("steps-count", "QE/StackItem").should(
              "have.text",
              "2 of 3 steps completed"
            );
            cy.ouiaId("steps", "QE/StackItem").within(() => {
              progressStepStatus(
                SEStepStatus.Success,
                "pending",
                "Creation pending"
              );
              progressStepStatus(
                SEStepStatus.Success,
                "preparing",
                "Preparing"
              );
              progressStepStatus(
                SEStepStatus.Info,
                "provisioning",
                "Provisioning"
              );
            });
          });
      });

      it("Ready", () => {
        const instanceName: string = "Instance two";
        cy.ouiaId("Instances list table", "PF4/Table")
          .ouiaId(instanceName, "PF4/TableRow")
          .should("be.visible")
          .within(() => {
            cy.get("td:first")
              .should("have.text", instanceName)
              .should("not.have.html", instanceName)
              .find("a")
              .should("be.visible");
            cy.get("td:nth-child(3)").should("have.text", "Ready");
            cy.get("td:nth-child(4)")
              .click()
              .within(() => {
                cy.ouiaType("PF4/DropdownItem").then(($items) => {
                  expect($items.eq(0)).have.text("Details");
                  expect($items.eq(0)).be.enabled;
                  expect($items.eq(1)).have.text("Delete instance");
                  expect($items.eq(0)).be.enabled;
                });
              });
          });
      });
    });
  });

  onlyOn(isEnvironmentType(EnvType.Mocked), () => {
    describe("Instance Error Handler", () => {
      it("View error handler details", () => {
        // visit 'Instance one'
        cy.visit("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");

        cy.ouiaId("error-handling", "PF4/TabButton").click();

        cy.ouiaId("error-handling-section", "PF4/Text")
          .should("have.text", "Error handling method")
          .should("be.visible");

        cy.ouiaType("ProcessorConfig/FormGroup").should("have.length", 5);

        cy.ouiaId("error_handling_method", "ProcessorConfig/FormGroup").within(
          () => {
            cy.get("[data-testid='error_handling_method']").should(
              "have.text",
              "Error handling method"
            );
            cy.get("[data-testid='error_handling_method-value']").should(
              "have.text",
              "Webhook"
            );
          }
        );

        cy.ouiaId("endpoint", "ProcessorConfig/FormGroup").within(() => {
          cy.get("[data-testid='endpoint']").should("have.text", "Endpoint");
          cy.get("[data-testid='endpoint-value']").should(
            "have.text",
            "http://google.com"
          );
        });

        cy.ouiaId("basic_auth_username", "ProcessorConfig/FormGroup").within(
          () => {
            cy.get("[data-testid='basic_auth_username']").should(
              "have.text",
              "Basic Auth Username"
            );
            cy.get("[data-testid='basic_auth_username-value']").should(
              "have.text",
              "user"
            );
          }
        );

        cy.ouiaId("basic_auth_password", "ProcessorConfig/FormGroup").within(
          () => {
            cy.get("[data-testid='basic_auth_password']").should(
              "have.text",
              "Basic Auth Password"
            );
            cy.get("[data-testid='basic_auth_password-value']").should(
              "have.text",
              "**************************"
            );
          }
        );

        cy.ouiaId(
          "ssl_verification_disabled",
          "ProcessorConfig/FormGroup"
        ).within(() => {
          cy.get("[data-testid='ssl_verification_disabled']").should(
            "have.text",
            "SSL Verification Disabled"
          );
          cy.get("[data-testid='ssl_verification_disabled-value']").should(
            "have.text",
            "No"
          );
        });
      });
    });

    describe("Instance Page - Instance one", () => {
      beforeEach(() => {
        cy.visit("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");
      });

      it("Header", () => {
        cy.ouiaId("instance-name", "PF4/Text").should(
          "have.text",
          "Instance one"
        );
        cy.ouiaId("actions", "PF4/Dropdown")
          .should("be.visible")
          .within(() => {
            cy.ouiaId("actions", "PF4/DropdownToggle").click();
            cy.ouiaId("details", "PF4/DropdownItem").should("be.visible");
            cy.ouiaId("delete", "PF4/DropdownItem").should("be.visible");
          });
      });

      it("Details", () => {
        cy.ouiaId("actions", "PF4/Dropdown")
          .should("be.visible")
          .within(() => {
            cy.ouiaId("actions", "PF4/DropdownToggle").click();
            cy.ouiaId("details", "PF4/DropdownItem").click();
          });

        cy.ouiaId("instance-details-panel")
          .within(() => {
            cy.ouiaId("instance-details-name", "PF4/Text")
              .should("have.text", "Instance one")
              .should("be.visible");
            cy.ouiaId("instance-details-id")
              .should("have.text", "3543edaa-1851-4ad7-96be-ebde7d20d717")
              .should("be.visible");
            cy.ouiaId("instance-details-endpoint")
              .find("span")
              .should(
                "have.text",
                "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events"
              )
              .should("be.visible");
            cy.ouiaId("instance-details-owner")
              .should("have.text", "bebianco")
              .should("be.visible");
            cy.ouiaId("instance-details-submitted-date")
              .should("have.text", formatDate("2022-02-24T13:34:00Z"))
              .should("be.visible");
            cy.ouiaId("instance-details-published-date")
              .should("have.text", formatDate("2022-02-24T13:35:00Z"))
              .should("be.visible");
            cy.ouiaId("close-instance-details").click();
          })
          //constructions like "not.exist" or "not.be.visible" fail in this case
          .should("have.attr", "hidden");
      });

      it("Pending processor", () => {
        cy.ouiaId("instance-details", "PF4/Tabs")
          .ouiaId("processors", "PF4/TabButton")
          .click();
        cy.ouiaId("processors", "PF4/TabContent").within(() => {
          cy.ouiaId("rows-toolbar", "PF4/Toolbar")
            .ouiaId("create-processor", "PF4/Button")
            .should("be.visible");
          cy.ouiaId("Processors list table", "PF4/Table")
            .ouiaId("Processor three", "PF4/TableRow")
            .find("td")
            .then(($cells) => {
              expect($cells).have.length(5);
              expect($cells.eq(0)).have.text("Processor three");
              expect($cells.eq(1)).have.text("Source");
              cy.wrap($cells)
                .eq(3)
                .ouiaId("creating", "PF4/Button")
                .should("have.text", "Creating");
              cy.wrap($cells.eq(4))
                .ouiaType("PF4/Dropdown")
                .should("be.visible");
            });
          cy.ouiaId("creating", "PF4/Button").click();
        });
        cy.ouiaId("se-status", "QE/Popover")
          .should("be.visible")
          .within(() => {
            cy.ouiaType("QE/StackItem").should("have.length", "3");
            cy.ouiaId("info-banner", "QE/StackItem")
              .ouiaId("longer-than-expected", "PF4/Alert")
              .should("be.visible");
            cy.ouiaId("steps-count", "QE/StackItem").should(
              "have.text",
              "0 of 3 steps completed"
            );
            cy.ouiaId("steps", "QE/StackItem").within(() => {
              progressStepStatus(
                SEStepStatus.Info,
                "pending",
                "Creation pending"
              );
              progressStepStatus(
                SEStepStatus.Default,
                "preparing",
                "Preparing"
              );
              progressStepStatus(
                SEStepStatus.Default,
                "provisioning",
                "Provisioning"
              );
            });
          });
      });

      it("Ready processor", () => {
        cy.ouiaId("instance-details", "PF4/Tabs")
          .ouiaId("processors", "PF4/TabButton")
          .click();
        cy.ouiaId("processors", "PF4/TabContent").within(() => {
          cy.ouiaId("rows-toolbar", "PF4/Toolbar")
            .ouiaId("create-processor", "PF4/Button")
            .should("be.visible");
          cy.ouiaId("Processors list table", "PF4/Table")
            .ouiaId("Processor one", "PF4/TableRow")
            .find("td")
            .then(($cells) => {
              expect($cells).have.length(5);
              expect($cells.eq(0)).have.text("Processor one");
              expect($cells.eq(1)).have.text("Sink");
              cy.wrap($cells).eq(3).should("have.text", "Ready");
              cy.wrap($cells.eq(4))
                .ouiaType("PF4/Dropdown")
                .should("be.visible");
            });
        });
      });

      it("Processor header details are visible", () => {
        const processorHeaderDetails = [
          "Name",
          "Type",
          "Time created",
          "Status",
        ];
        cy.ouiaId("Processors list table", "PF4/Table")
          .ouiaId("table-head", "PF4/TableRow")
          .find("th")
          .should("have.length", processorHeaderDetails.length)
          .each((item, index) => {
            cy.wrap(item).should("have.text", processorHeaderDetails[index]);
          });
      });
    });
  });

  onlyOn(isEnvironmentType(EnvType.Mocked), () => {
    describe("Instance Creation is in progress", () => {
      beforeEach(() => {
        cy.visit("/");
        pageWasLoaded();
      });

      it("Instance three", () => {
        const instanceName: string = "Instance three";
        cy.ouiaId("Instances list table", "PF4/Table")
          .ouiaId(instanceName, "PF4/TableRow")
          .should("be.visible")
          .within(() => {
            cy.get("td:first").should("have.html", instanceName);
            cy.get("td:nth-child(3)")
              .ouiaId("creating", "PF4/Button")
              .should("have.text", "Creating");
            cy.get("td:nth-child(4)")
              .click()
              .within(() => {
                cy.ouiaType("PF4/DropdownItem").then(($items) => {
                  expect($items.eq(0)).have.text("Details");
                  expect($items.eq(0)).be.enabled;
                  expect($items.eq(1)).have.text("Delete instance");
                  expect($items.eq(1)).have.attr("aria-disabled", "true");
                  cy.get("li:first").click();
                });
              });
          });
        cy.ouiaId("instance-details-panel").within(() => {
          cy.ouiaId("instance-details-name", "PF4/Text")
            .should("have.text", "Instance three")
            .should("be.visible");
          cy.ouiaId("instance-details-id")
            .should("have.text", "ee22ce62-1f23-4dd7-b106-e4158baf8228")
            .should("be.visible");
          cy.ouiaId("instance-details-owner")
            .should("have.text", "bebianco")
            .should("be.visible");
          cy.ouiaId("instance-details-submitted-date")
            .should("have.text", formatDate("2022-02-15T12:03:00Z"))
            .should("be.visible");
          cy.ouiaId("instance-details-published-date")
            .should("have.text", formatDate("2022-02-15T12:04:00Z"))
            .should("be.visible");
          cy.ouiaId("instance-details-endpoint-skeleton").should(
            "have.text",
            ""
          );
          cy.ouiaId("close-instance-details").click();
        });
      });
    });
  });
});
