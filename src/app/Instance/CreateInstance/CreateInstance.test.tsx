import React from "react";
import { customRender, waitForI18n } from "../../../utils/testUtils";
import CreateInstance, { CreateInstanceProps } from "./CreateInstance";
import { fireEvent, waitFor } from "@testing-library/react";

const setupCreateInstance = (props: Partial<CreateInstanceProps>) => {
  const {
    onClose = jest.fn(),
    onCreate = jest.fn(),
    isModalOpen = true,
    isLoading = false,
  } = props;

  const comp = customRender(
    <CreateInstance
      onClose={onClose}
      onCreate={onCreate}
      isLoading={isLoading}
      isModalOpen={isModalOpen}
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

  it("should create an instance when a name is provided", async () => {
    const onCreate = jest.fn();
    const { comp } = setupCreateInstance({ onCreate });
    await waitForI18n(comp);

    expect(comp.queryByLabelText("Name *")).toBeInTheDocument();
    expect(comp.queryByLabelText("Name *")).toBeEnabled();

    fireEvent.change(comp.getByLabelText("Name *"), {
      target: { value: "my instance" },
    });

    fireEvent.click(comp.getByText("Create Smart Events instance"));

    expect(comp.queryByText("Required")).not.toBeInTheDocument();

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith("my instance");
  });

  it("should disable create button and name input while loading", async () => {
    const { comp } = setupCreateInstance({ isLoading: true });
    await waitForI18n(comp);

    expect(comp.getByRole("progressbar")).toBeInTheDocument();
    expect(comp.getByLabelText("Name *")).toBeDisabled();
    expect(comp.getByText("Create Smart Events instance")).toBeDisabled();
  });

  it("should be dismissed when canceling", async () => {
    const onClose = jest.fn();

    const { comp } = setupCreateInstance({ onClose });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
