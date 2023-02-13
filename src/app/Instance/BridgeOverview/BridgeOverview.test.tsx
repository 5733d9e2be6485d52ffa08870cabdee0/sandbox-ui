import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { fireEvent, RenderResult } from "@testing-library/react";
import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BridgeOverview, BridgeOverviewProps } from "./BridgeOverview";
import { processorData } from "./BOStoriesHelper";

const IngressEndpoint =
  "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events";

const setupBridgeOverview = (
  props: Partial<BridgeOverviewProps>
): { comp: RenderResult } => {
  const {
    onCreateProcessor = jest.fn(),
    instanceId = "3543edaa-1851-4ad7-96be-ebde7d20d717",
    processorList,
    bridgeStatus,
    processorsError,
    bridgeIngressEndpoint,
  } = props;
  const comp = customRender(
    <BrowserRouter>
      <BridgeOverview
        onCreateProcessor={onCreateProcessor}
        instanceId={instanceId}
        processorList={processorList}
        processorsError={processorsError}
        bridgeStatus={bridgeStatus}
        bridgeIngressEndpoint={bridgeIngressEndpoint}
      />
    </BrowserRouter>
  );
  return { comp };
};

describe("Bridge Overview", () => {
  it("should check for getting started card is open by default", async () => {
    const { comp } = setupBridgeOverview({});
    await waitForI18n(comp);
    expect(comp.queryByText("Learn about YAML templates")).toBeInTheDocument();
  });

  it("should check for getting started card is closed, after clicking on toggle button", async () => {
    const { comp } = setupBridgeOverview({});
    await waitForI18n(comp);
    expect(comp.getByLabelText("getting started toggler")).toBeInTheDocument();
    fireEvent.click(comp.getByLabelText("getting started toggler"));
    expect(
      comp.queryByText("Learn about YAML templates")
    ).not.toBeInTheDocument();
  });

  it("should have ingress endpoint", async () => {
    const { comp } = setupBridgeOverview({
      bridgeIngressEndpoint: IngressEndpoint,
    });
    await waitForI18n(comp);

    expect(comp.getByDisplayValue(IngressEndpoint)).toBeInTheDocument();
  });

  it("should display no processor", async () => {
    const { comp } = setupBridgeOverview({ processorList: [] });

    await waitForI18n(comp);

    expect(comp.getByText("No processors")).toBeInTheDocument();
  });

  it("should display list of processors", async () => {
    const instanceId = "3543edaa-1851-4ad7-96be-ebde7d20d717";
    const { comp } = setupBridgeOverview({
      processorList: processorData,
      instanceId: "3543edaa-1851-4ad7-96be-ebde7d20d717",
    });

    await waitForI18n(comp);

    expect(comp.queryByText("No processors")).not.toBeInTheDocument();

    processorData.map((processor) => {
      expect(comp.queryByText(processor.name)).toBeInTheDocument();
      expect(comp.getByRole("link", { name: processor.name })).toHaveAttribute(
        "href",
        `/instance/${instanceId}/processor/${processor.id}`
      );
    });
  });

  it("should disable create processor button, when bridgeStatus is failed", async () => {
    const { comp } = setupBridgeOverview({
      bridgeStatus: ManagedResourceStatus.Failed,
    });
    await waitForI18n(comp);

    expect(
      comp.getByRole("button", { name: "Create processor" })
    ).toBeDisabled();
  });

  it("should enable create processor button, when bridgeStatus is ready", async () => {
    const onCreateProcessor = jest.fn();
    const { comp } = setupBridgeOverview({
      bridgeStatus: ManagedResourceStatus.Ready,
      onCreateProcessor,
    });
    await waitForI18n(comp);

    expect(
      comp.getByRole("button", { name: "Create processor" })
    ).toBeEnabled();
    fireEvent.click(comp.getByRole("button", { name: "Create processor" }));
    expect(onCreateProcessor).toHaveBeenCalledTimes(1);
  });

  it("should display generic error message", async () => {
    const { comp } = setupBridgeOverview({
      processorsError: "generic error message",
    });
    await waitForI18n(comp);

    expect(comp.queryByText("Unexpected Error")).toBeInTheDocument();
    expect(
      comp.queryByText(
        "Error while retrieving the list of Processors for this Smart Event instance."
      )
    ).toBeInTheDocument();
  });
});
