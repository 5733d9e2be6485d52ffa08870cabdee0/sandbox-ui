import React from "react";
import CreateInstance, {
  CreateInstanceProps,
} from "@app/Instance/CreateInstance/CreateInstance";
import { act, fireEvent, RenderResult, waitFor } from "@testing-library/react";
import { customRender, waitForI18n } from "@utils/testUtils";
import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";

const setupCreateInstance = (
  props: Partial<CreateInstanceProps>
): { comp: RenderResult } => {
  const {
    isOpen = true,
    onClose = jest.fn(),
    getSchema = jest.fn(),
    getCloudProviders = (): Promise<CloudProviderWithRegions[]> =>
      new Promise<CloudProviderWithRegions[]>((resolve) => {
        resolve([cloudProvider]);
      }),
    createBridge = jest.fn(),
  } = props;
  const comp = customRender(
    <CreateInstance
      isOpen={isOpen}
      onClose={onClose}
      getSchema={getSchema}
      getCloudProviders={getCloudProviders}
      createBridge={createBridge}
    />
  );
  return { comp };
};

describe("CreateInstance component", () => {
  it("should not display anything if the modal is closed", async () => {
    const { comp } = setupCreateInstance({ isOpen: false });
    await waitForI18n(comp);

    expect(comp.container).toBeEmptyDOMElement();
    expect(
      comp.queryByText("Create a Smart Events instance")
    ).not.toBeInTheDocument();
  });

  it("should ask for instance name before creating an instance", async () => {
    const scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    const createBridge = jest.fn();
    const { comp } = setupCreateInstance({ createBridge });
    await waitForI18n(comp);
    await waitFor(() => {
      expect(
        comp.getByText("Create a Smart Events instance")
      ).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Create Smart Events instance"));

    expect(comp.getByText("Required")).toBeInTheDocument();
    expect(createBridge).toHaveBeenCalledTimes(0);
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("should display error handling section", async () => {
    const { comp } = setupCreateInstance({});
    await waitForI18n(comp);

    expect(comp.getByText("Error handling")).toBeInTheDocument();

    expect(
      comp.baseElement.querySelector(
        "[data-ouia-component-id='error-handling-method-selector']"
      )
    ).toBeInTheDocument();
  });

  it("should have 'Ignore' as default method for error handling", async () => {
    const { comp } = setupCreateInstance({});
    await waitForI18n(comp);

    expect(
      comp.baseElement.querySelector(
        "[data-ouia-component-id='error-handling-method-selector'] .pf-c-select__toggle-text"
      )
    ).toHaveTextContent("Ignore");
  });

  it("should retrieve the schema of the selected handling strategy, when changing the method", async () => {
    const getSchema = jest.fn(
      (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve({});
        })
    );
    const { comp } = setupCreateInstance({ getSchema });
    await waitForI18n(comp);

    const selector = comp.baseElement.querySelector(
      "[data-ouia-component-id='error-handling-method-selector']"
    );
    fireEvent.click(
      selector?.querySelector(".pf-c-select__toggle-arrow") as Node
    );
    await waitFor(() => comp.getByText("Webhook"));
    fireEvent.click(comp.getByText("Webhook"));

    await act(async () => {
      /* let component do its updates */
    });

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith("webhook_sink_0.1", "action");
  });

  it("should display cloud provider and region options", async () => {
    const { comp } = setupCreateInstance({});
    await waitForI18n(comp);

    expect(comp.queryByLabelText("Name *")).toBeInTheDocument();

    expect(comp.getByRole("option")).toHaveAttribute("aria-selected", "true");
    expect(comp.getByRole("option")).toHaveTextContent(
      cloudProvider.display_name
    );
    expect(
      comp.baseElement.querySelector("button#cloud-region")
    ).toHaveTextContent(cloudProvider.regions[0].display_name);
  });

  it("should create an instance when a name is provided", async () => {
    const createBridge = jest.fn();
    const { comp } = setupCreateInstance({ createBridge });
    await waitForI18n(comp);

    const instanceName = "my instance";

    setName(comp, instanceName);

    fireEvent.click(comp.getByText("Create Smart Events instance"));

    expect(comp.queryByText("Required")).not.toBeInTheDocument();

    expect(createBridge).toHaveBeenCalledTimes(1);
    expect(createBridge).toHaveBeenCalledWith(
      {
        name: instanceName,
        cloud_provider: cloudProvider.id,
        region: cloudProvider.regions[0].name,
        undefined,
      },
      expect.anything(),
      expect.anything()
    );
  });

  it("should disable create button and inputs while loading", async () => {
    const { comp } = setupCreateInstance({});
    await waitForI18n(comp);

    const instanceName = "my instance";

    setName(comp, instanceName);

    fireEvent.click(comp.getByText("Create Smart Events instance"));

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
      getCloudProviders: () =>
        new Promise<CloudProviderWithRegions[]>((resolve) => {
          resolve([cloudProviderUnavailable]);
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
      createBridge: (_data, _onSuccess, onError) => {
        onError("region-unavailable");
      },
    });
    await waitForI18n(comp);

    const instanceName = "my instance";

    setName(comp, instanceName);

    fireEvent.click(comp.getByText("Create Smart Events instance"));

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

const setName = (comp: RenderResult, name: string): void => {
  expect(comp.queryByLabelText("Name *")).toBeInTheDocument();
  expect(comp.queryByLabelText("Name *")).toBeEnabled();

  fireEvent.change(comp.getByLabelText("Name *"), {
    target: { value: name },
  });
};

const inputsAreDisabled = (comp: RenderResult): void => {
  expect(comp.getByLabelText("Name *")).toBeDisabled();
  expect(comp.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  expect(comp.baseElement.querySelector("button#cloud-region")).toBeDisabled();
};

const cloudRegion = {
  kind: "CloudRegion",
  name: "us-east-1",
  display_name: "US East, N. Virginia",
  enabled: true,
};

const cloudProvider: CloudProviderWithRegions = {
  kind: "CloudProvider",
  id: "aws",
  name: "aws",
  href: "/api/v1/cloud_providers/aws",
  display_name: "Amazon Web Services",
  enabled: true,
  regions: [cloudRegion],
};

const cloudProviderUnavailable: CloudProviderWithRegions = {
  ...cloudProvider,
  regions: [{ ...cloudRegion, enabled: false }],
};
