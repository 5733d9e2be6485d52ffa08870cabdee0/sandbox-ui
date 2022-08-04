import React from "react";
import { customRender, waitForI18n } from "@utils/testUtils";
import CreateInstance, { CreateInstanceProps } from "./CreateInstance";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import {
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";

const setupCreateInstance = (
  props: Partial<CreateInstanceProps>
): { comp: RenderResult } => {
  const {
    onClose = jest.fn(),
    onCreate = jest.fn(),
    isModalOpen = true,
    isLoading = false,
    getCloudProviders = (): Promise<CloudProviderResponse[]> =>
      new Promise<CloudProviderResponse[]>((resolve) => {
        resolve([cloudProvider]);
      }),
    getCloudRegions = (): Promise<CloudRegionResponse[]> =>
      new Promise<CloudRegionResponse[]>((resolve) => {
        resolve([cloudRegion]);
      }),
    createBridgeError,
  } = props;

  const comp = customRender(
    <CreateInstance
      onClose={onClose}
      onCreate={onCreate}
      isLoading={isLoading}
      isModalOpen={isModalOpen}
      createBridgeError={createBridgeError}
      getCloudProviders={getCloudProviders}
      getCloudRegions={getCloudRegions}
    />
  );
  return { comp };
};

describe("CreateInstance component", () => {
  it("should not display anything if the modal is closed", async () => {
    const { comp } = setupCreateInstance({ isModalOpen: false });
    await waitForI18n(comp);

    expect(comp.container).toBeEmptyDOMElement();
    expect(
      comp.queryByText("Create a Smart Events instance")
    ).not.toBeInTheDocument();
  });

  it("should ask for instance name before creating an instance", async () => {
    const onCreate = jest.fn();
    const { comp } = setupCreateInstance({ onCreate });
    await waitForI18n(comp);
    await waitFor(() => {
      expect(
        comp.getByText("Create a Smart Events instance")
      ).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Create Smart Events instance"));

    expect(comp.getByText("Required")).toBeInTheDocument();
    expect(onCreate).toHaveBeenCalledTimes(0);
  });

  it("should display cloud provider and region options", async () => {
    const onCreate = jest.fn();
    const { comp } = setupCreateInstance({ onCreate });
    await waitForI18n(comp);

    expect(comp.queryByLabelText("Name *")).toBeInTheDocument();

    expect(comp.getByRole("option")).toHaveAttribute("aria-selected", "true");
    expect(comp.getByRole("option")).toHaveTextContent(
      cloudProvider.display_name
    );
    expect(
      comp.baseElement.querySelector("button#cloud-region")
    ).toHaveTextContent(cloudRegion.display_name);

    await waitFor(() => {});
  });

  it("should create an instance when a name is provided", async () => {
    const onCreate = jest.fn();
    const { comp } = setupCreateInstance({ onCreate });
    await waitForI18n(comp);

    const instanceName = "my instance";

    expect(comp.queryByLabelText("Name *")).toBeInTheDocument();
    expect(comp.queryByLabelText("Name *")).toBeEnabled();

    fireEvent.change(comp.getByLabelText("Name *"), {
      target: { value: instanceName },
    });

    fireEvent.click(comp.getByText("Create Smart Events instance"));

    expect(comp.queryByText("Required")).not.toBeInTheDocument();

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith(
      instanceName,
      cloudProvider.id,
      cloudRegion.name
    );
  });

  it("should disable create button and inputs while loading", async () => {
    const { comp } = setupCreateInstance({ isLoading: true });
    await waitForI18n(comp);

    expect(comp.getByRole("progressbar")).toBeInTheDocument();
    inputsAreDisabled(comp);
    expect(comp.getByText("Create Smart Events instance")).toBeDisabled();
  });

  it("should be dismissed when canceling", async () => {
    const onClose = jest.fn();

    const { comp } = setupCreateInstance({ onClose });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should disable the instance creation if no cloud regions are enabled", async () => {
    const { comp } = setupCreateInstance({
      getCloudRegions: () =>
        new Promise<CloudRegionResponse[]>((resolve) => {
          resolve([{ ...cloudRegion, enabled: false }]);
        }),
    });
    await waitForI18n(comp);
    expect(
      comp.queryByText(
        "Cloud provider regions are temporarily unavailable. Try again later."
      )
    ).toBeInTheDocument();

    inputsAreDisabled(comp);

    expect(comp.getByText("Create Smart Events instance")).toBeDisabled();
  });

  it("should disable the instance creation if no cloud regions are enabled after submitting a request", async () => {
    const { comp } = setupCreateInstance({
      createBridgeError: {
        response: {
          data: {
            kind: "ErrorsResponse",
            items: [
              {
                kind: "Error",
                id: "1",
                href: "/api/v1/errors/34",
                code: "OPENBRIDGE-34",
              },
            ],
          },
          status: 400,
        },
      },
    });
    await waitForI18n(comp);

    await waitFor(() => {
      expect(
        comp.queryByText(
          "Cloud provider regions are temporarily unavailable. Try again later."
        )
      ).toBeInTheDocument();

      inputsAreDisabled(comp);

      expect(comp.getByText("Create Smart Events instance")).toBeDisabled();
    });
  });
});

const inputsAreDisabled = (comp: RenderResult): void => {
  expect(comp.getByLabelText("Name *")).toBeDisabled();
  expect(comp.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  expect(comp.baseElement.querySelector("button#cloud-region")).toBeDisabled();
};

const cloudProvider = {
  kind: "CloudProvider",
  id: "aws",
  name: "aws",
  href: "/api/v1/cloud_providers/aws",
  display_name: "Amazon Web Services",
  enabled: true,
};

const cloudRegion = {
  kind: "CloudRegion",
  name: "us-east-1",
  display_name: "US East, N. Virginia",
  enabled: true,
};
