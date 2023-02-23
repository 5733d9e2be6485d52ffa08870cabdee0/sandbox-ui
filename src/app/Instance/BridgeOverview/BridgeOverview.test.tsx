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
    onEditProcessor = jest.fn(),
    onDeleteProcessor = jest.fn(),
    instanceId = "3543edaa-1851-4ad7-96be-ebde7d20d717",
    processorList,
    bridgeStatus,
    processorsError,
    bridgeIngressEndpoint,
  } = props;
  const comp = customRender(
    <BrowserRouter>
      <BridgeOverview
        onDeleteProcessor={onDeleteProcessor}
        onCreateProcessor={onCreateProcessor}
        onEditProcessor={onEditProcessor}
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

const processor = [
  {
    kind: "Processor",
    id: "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    name: "Processor one",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    submitted_at: "2022-04-12T12:10:46.029400+0000",
    published_at: "2022-04-12T12:12:52.416527+0000",
    status: ManagedResourceStatus.Ready,
    flows: [],
    owner: "",
  },
];

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
    expect(
      comp.queryByText("Loading ingress endpoint")
    ).not.toBeInTheDocument();
  });

  it("should display skeleton, while loading ingress endpoint", async () => {
    const { comp } = setupBridgeOverview({});
    await waitForI18n(comp);

    expect(comp.queryByText("Loading ingress endpoint")).toBeInTheDocument();
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

  it("should check for delete functionality", async () => {
    const onDeleteProcessor = jest.fn();
    const { comp } = setupBridgeOverview({
      processorList: processor,
      bridgeStatus: ManagedResourceStatus.Ready,
      onDeleteProcessor,
    });
    await waitForI18n(comp);

    expect(comp.queryByText("Delete")).not.toBeInTheDocument();
    expect(comp.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    fireEvent.click(comp.getByRole("button", { name: "Actions" }));
    expect(comp.queryByText("Delete")).toBeInTheDocument();
    fireEvent.click(comp.getByRole("menuitem", { name: "Delete" }));
    expect(onDeleteProcessor).toHaveBeenCalledWith(
      "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
      "Processor one"
    );
    expect(onDeleteProcessor).toHaveBeenCalledTimes(1);
  });

  it("should disable the delete button, when processor is not in ready or failed state", async () => {
    const { comp } = setupBridgeOverview({
      processorList: [
        {
          ...processor[0],
          status: ManagedResourceStatus.Accepted,
        },
      ],
      bridgeStatus: ManagedResourceStatus.Ready,
    });
    await waitForI18n(comp);

    expect(comp.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    fireEvent.click(comp.getByRole("button", { name: "Actions" }));
    expect(comp.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("should check for edit functionality", async () => {
    const onEditProcessor = jest.fn();
    const { comp } = setupBridgeOverview({
      processorList: processor,
      bridgeStatus: ManagedResourceStatus.Ready,
      onEditProcessor,
    });
    await waitForI18n(comp);

    expect(comp.queryByText("Edit")).not.toBeInTheDocument();
    expect(comp.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    fireEvent.click(comp.getByRole("button", { name: "Actions" }));
    expect(comp.queryByText("Edit")).toBeInTheDocument();
    fireEvent.click(comp.getByRole("menuitem", { name: "Edit" }));
    expect(onEditProcessor).toHaveBeenCalledTimes(1);
    expect(onEditProcessor).toHaveBeenCalledWith(
      "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7"
    );
  });

  it("should disable the edit button, when processor is not in ready or failed state", async () => {
    const { comp } = setupBridgeOverview({
      processorList: [
        {
          ...processor[0],
          status: ManagedResourceStatus.Accepted,
        },
      ],
      bridgeStatus: ManagedResourceStatus.Ready,
    });
    await waitForI18n(comp);

    expect(comp.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    fireEvent.click(comp.getByRole("button", { name: "Actions" }));
    expect(comp.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
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
