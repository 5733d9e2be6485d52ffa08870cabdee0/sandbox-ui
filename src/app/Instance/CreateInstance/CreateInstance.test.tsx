import React from "react";
import CreateInstance, {
  CreateInstanceProps,
} from "@app/Instance/CreateInstance/CreateInstance";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import { customRender, waitForI18n } from "@utils/testUtils";
import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";
import {
  cloudProvider,
  cloudProviderUnavailable,
} from "@app/Instance/CreateInstance/storiesHelpers";

const setupCreateInstance = (
  props: Partial<CreateInstanceProps>
): { comp: RenderResult } => {
  const {
    isOpen = true,
    onClose = jest.fn(),
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

  it("should create an instance if at least the name is provided", async () => {
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

    expectValidationErrorAlert(comp, false);

    submitForm(comp);

    expectValidationErrorAlert(comp, true);
    expect(comp.getByText("Required")).toBeInTheDocument();
    expect(comp.getByLabelText("Name *")).toBeInvalid();

    expect(createBridge).toHaveBeenCalledTimes(0);
    expect(scrollIntoView).toHaveBeenCalled();

    const instanceName = "my instance";
    setName(comp, instanceName);

    await waitFor(() => {
      expect(comp.getByLabelText("Name *")).toBeValid();
    });

    submitForm(comp);

    expectValidationErrorAlert(comp, false);
    expect(comp.queryByText("Required")).not.toBeInTheDocument();

    expect(createBridge).toHaveBeenCalledTimes(1);
    expect(createBridge).toHaveBeenCalledWith(
      {
        name: instanceName,
        cloud_provider: cloudProvider.id,
        region: cloudProvider.regions[0].name,
      },
      expect.anything(),
      expect.anything()
    );
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

  it("should disable create button and inputs while loading", async () => {
    const { comp } = setupCreateInstance({});
    await waitForI18n(comp);

    const instanceName = "my instance";
    setName(comp, instanceName);

    submitForm(comp);

    expect(comp.getByRole("progressbar")).toBeInTheDocument();
    expectInputsAreDisabled(comp);
    expectSubmitToBeDisabled(comp);
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

    expectInputsAreDisabled(comp);
    expectSubmitToBeDisabled(comp);
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

    submitForm(comp);

    await waitFor(() => {
      expect(
        comp.queryByText(
          "Cloud provider regions are temporarily unavailable. Try again later."
        )
      ).toBeInTheDocument();

      expectInputsAreDisabled(comp);
      expectSubmitToBeDisabled(comp);
    });
  });

  it("should display an error when the provided instance name is already taken", async () => {
    const { comp } = setupCreateInstance({
      createBridge: (_data, _onSuccess, onError) => {
        onError("name-taken");
      },
    });

    await waitForI18n(comp);

    const instanceName = "my instance";
    setName(comp, instanceName);

    submitForm(comp);

    await waitFor(() => {
      expect(
        comp.queryByText(
          "A Smart Events Instance with this name already exists in your account."
        )
      ).toBeInTheDocument();

      expectSubmitToBeDisabled(comp, false);
    });
  });

  it("should display an error when the create request fails", async () => {
    const { comp } = setupCreateInstance({
      createBridge: (_data, _onSuccess, onError) => {
        onError("generic-error");
      },
    });

    await waitForI18n(comp);

    setName(comp, "my instance");
    submitForm(comp);

    await waitFor(() => {
      expect(
        comp.queryByText(
          "Error while creating a Smart Event instance. Please, try again later."
        )
      ).toBeInTheDocument();

      expectSubmitToBeDisabled(comp, false);
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

const expectInputsAreDisabled = (comp: RenderResult): void => {
  expect(comp.getByLabelText("Name *")).toBeDisabled();
  expect(comp.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  expect(comp.baseElement.querySelector("button#cloud-region")).toBeDisabled();
};

const submitLabel = "Create Smart Events instance";

const expectSubmitToBeDisabled = (comp: RenderResult, result = true): void => {
  if (result) {
    expect(comp.getByText(submitLabel)).toBeDisabled();
  } else {
    expect(comp.getByText(submitLabel)).toBeEnabled();
  }
};

const submitForm = (comp: RenderResult): void => {
  fireEvent.click(comp.getByText(submitLabel));
};

const expectValidationErrorAlert = (
  comp: RenderResult,
  result: boolean
): void => {
  const validationMessage = "Address form errors to proceed.";
  if (result) {
    expect(comp.getByText(validationMessage)).toBeInTheDocument();
  } else {
    expect(comp.queryByText(validationMessage)).not.toBeInTheDocument();
  }
};
