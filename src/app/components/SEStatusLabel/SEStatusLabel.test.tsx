import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { sub } from "date-fns";
import SEStatusLabel, {
  SEStatusLabelProps,
} from "@app/components/SEStatusLabel/SEStatusLabel";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";

const labels = ["Creating", "Ready", "Failed", "Deleting"];
const creatingInstance = "Creating instance";
const creatingProcessor = "Creating processor";
const takingLonger = "This is taking longer than expected.";
const readyShortly = "This will be ready shortly.";

const setupStatusLabel = (
  props: Partial<SEStatusLabelProps>
): { comp: RenderResult } => {
  const {
    status = ManagedResourceStatus.Accepted,
    resourceType = "bridge",
    requestedAt = new Date(),
  } = props;
  const comp = customRender(
    <SEStatusLabel
      status={status}
      resourceType={resourceType}
      requestedAt={requestedAt}
    />
  );
  return { comp };
};

describe("SEStatusLabel", () => {
  testCorrectLabel(ManagedResourceStatus.Accepted, labels[0]);
  testCorrectLabel(ManagedResourceStatus.Preparing, labels[0]);
  testCorrectLabel(ManagedResourceStatus.Provisioning, labels[0]);

  testCorrectLabel(ManagedResourceStatus.Ready, labels[1]);

  testCorrectLabel(ManagedResourceStatus.Failed, labels[2]);

  testCorrectLabel(ManagedResourceStatus.Deleting, labels[3]);
  testCorrectLabel(ManagedResourceStatus.Deprovision, labels[3]);
  testCorrectLabel(ManagedResourceStatus.Deleted, labels[3]);

  it("should display the first step in the popover content for 'accepted'", async () => {
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Accepted,
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryByText("0 of 3 steps completed")).toBeInTheDocument();
    });

    expect(comp.queryAllByText(readyShortly)).toHaveLength(2);
    expect(comp.queryByText(takingLonger)).not.toBeInTheDocument();
  });

  it("should display the second step in the popover content for 'preparing", async () => {
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Preparing,
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryByText("1 of 3 steps completed")).toBeInTheDocument();
    });

    expect(comp.queryAllByText(readyShortly)).toHaveLength(2);
    expect(comp.queryByText(takingLonger)).not.toBeInTheDocument();
  });

  it("should display the third step in the popover content for 'provisioning", async () => {
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Provisioning,
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryByText("2 of 3 steps completed")).toBeInTheDocument();
    });

    expect(comp.queryAllByText(readyShortly)).toHaveLength(2);
    expect(comp.queryByText(takingLonger)).not.toBeInTheDocument();
  });

  it("should display the delayed warning after 5 minutes", async () => {
    const requestedAt = sub(new Date(), { minutes: 6 });
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Preparing,
      requestedAt,
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryAllByText(takingLonger)).toHaveLength(2);
    });

    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
    expect(comp.queryAllByLabelText("Warning Alert")).toHaveLength(2);
  });

  it("should display the delayed warning after 10 minutes", async () => {
    const requestedAt = sub(new Date(), { minutes: 11 });
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Preparing,
      requestedAt,
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryAllByText(takingLonger)).toHaveLength(2);
    });

    expect(comp.queryByText(readyShortly)).not.toBeInTheDocument();
    expect(comp.queryAllByLabelText("Danger Alert")).toHaveLength(2);
  });

  it("should display proper instance title inside popover", async () => {
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Preparing,
      resourceType: "bridge",
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryByText(creatingInstance)).toBeInTheDocument();
    });
    expect(comp.queryByText(creatingProcessor)).not.toBeInTheDocument();
  });

  it("should display proper processor title inside popover", async () => {
    const { comp } = setupStatusLabel({
      status: ManagedResourceStatus.Preparing,
      resourceType: "processor",
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Creating"));

    await waitFor(() => {
      expect(comp.queryByText(creatingProcessor)).toBeInTheDocument();
    });
    expect(comp.queryByText(creatingInstance)).not.toBeInTheDocument();
  });
});

function testCorrectLabel(status: ManagedResourceStatus, label: string): void {
  it(`should display the correct label for the "${status}" status`, async () => {
    const { comp } = setupStatusLabel({
      status: status,
    });
    await waitForI18n(comp);

    expect(comp.queryByText(label)).toBeInTheDocument();
  });
}
