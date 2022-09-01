import { customRender, waitForI18n } from "@utils/testUtils";
import { ResourceStatusLabel } from "@app/components/ResourceStatusLabel/ResourceStatusLabel";
import React from "react";
import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";
import { RenderResult } from "@testing-library/react";

const labels = ["Creating", "Ready", "Failed", "Deleting"];
const readyShortly = "This will be ready shortly.";
const delayedCreation = "This is taking longer than expected.";

describe("ResourceStatusLabel", () => {
  it("should display the 'creating' status", async () => {
    const comp = customRender(
      <ResourceStatusLabel status={ResourceStatus.CREATING} />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[0], labels);
    expect(comp.queryByText(readyShortly)).toBeInTheDocument();
  });

  it("should display the 'Ready' status", async () => {
    const comp = customRender(
      <ResourceStatusLabel status={ResourceStatus.READY} />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[1], labels);
    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
  });

  it("should display the 'Failed' status", async () => {
    const comp = customRender(
      <ResourceStatusLabel status={ResourceStatus.FAILED} />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[2], labels);
    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
  });

  it("should display the 'Deleting' status", async () => {
    const comp = customRender(
      <ResourceStatusLabel status={ResourceStatus.DELETING} />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[3], labels);
    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
  });

  it("should display the warning message when creation was delayed", async () => {
    const comp = customRender(
      <ResourceStatusLabel
        status={ResourceStatus.CREATING}
        creationDelayed={ResourceStatusDelayed.WARNING}
      />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[0], labels);
    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
    expect(comp.queryByText(delayedCreation)).toBeInTheDocument();
    expect(comp.queryByLabelText("Warning Alert")).toBeInTheDocument();
  });

  it("should display the error message when creation was delayed", async () => {
    const comp = customRender(
      <ResourceStatusLabel
        status={ResourceStatus.CREATING}
        creationDelayed={ResourceStatusDelayed.ERROR}
      />
    );
    await waitForI18n(comp);

    expectCorrectLabel(comp, labels[0], labels);
    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
    expect(comp.queryByText(delayedCreation)).toBeInTheDocument();
    expect(comp.queryByLabelText("Danger Alert")).toBeInTheDocument();
  });
});

const expectCorrectLabel = (
  comp: RenderResult,
  currentLabel: string,
  labels: string[]
): void => {
  expect(comp.queryByText(currentLabel)).toBeInTheDocument();

  const otherLabels = labels.filter((label) => label !== currentLabel);
  otherLabels.forEach((label) => {
    expect(comp.queryByText(label)).not.toBeInTheDocument();
  });
};
