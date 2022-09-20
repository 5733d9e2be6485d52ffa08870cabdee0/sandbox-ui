import "@testing-library/jest-dom";
import * as React from "react";

import {
  DeleteModal,
  DeleteModalProps,
} from "@app/components/DeleteModal/DeleteModal";
import { customRender, waitForI18n } from "@utils/testUtils";

import { fireEvent, RenderResult } from "@testing-library/react";

const title = "Test delete";
const testName = "Test resource name";
const testType = "Instance";

const setupModal = (
  props: Partial<DeleteModalProps>
): { comp: RenderResult } => {
  const {
    onCancel = jest.fn(),
    onConfirm = jest.fn(),
    showDialog = false,
    isLoading = false,
    isPreloading = false,
    modalTitle = title,
    resourceName = testName,
    resourceType = testType,
    blockedDeletionReason,
    ouiaId = "delete-instance",
  } = props;

  const comp = customRender(
    <DeleteModal
      ouiaId={ouiaId}
      onCancel={onCancel}
      onConfirm={onConfirm}
      showDialog={showDialog}
      isLoading={isLoading}
      isPreloading={isPreloading}
      modalTitle={modalTitle}
      resourceName={resourceName}
      resourceType={resourceType}
      blockedDeletionReason={blockedDeletionReason}
    />
  );
  return { comp };
};

describe("Delete Modal component", () => {
  test("should not display anything if the modal is closed", async () => {
    const { comp } = setupModal({});
    await waitForI18n(comp);

    expect(comp.container).toBeEmptyDOMElement();
    expect(comp.queryByText(title)).not.toBeInTheDocument();
  });

  test("should display a pre-loading spinner if a check if necessary before displaying the delete controls", async () => {
    const onDelete = jest.fn();
    const { comp } = setupModal({
      showDialog: true,
      isPreloading: true,
      onConfirm: onDelete,
    });

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.getByRole("progressbar")).toBeInTheDocument();
    expect(comp.getByText("Delete")).toBeDisabled();
  });

  test("should display an error if the deletion is blocked", async () => {
    const testBlockedReason = "Test reason";
    const onCancel = jest.fn();
    const { comp } = setupModal({
      showDialog: true,
      blockedDeletionReason: testBlockedReason,
      onCancel,
    });

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(comp.queryByText(testBlockedReason)).toBeInTheDocument();

    expect(comp.queryByText("Delete")).not.toBeInTheDocument();
    expect(comp.queryByText("Cancel")).not.toBeInTheDocument();
    expect(onCancel).toHaveBeenCalledTimes(0);
    fireEvent.click(comp.getByText("Close"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("should ask the user to type the name of the resource to confirm deletion", async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { comp } = setupModal({
      showDialog: true,
      onCancel,
      onConfirm,
    });
    await waitForI18n(comp);

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.getByText("Delete")).toBeDisabled();

    fireEvent.change(comp.getByTestId("delete-confirmation-value"), {
      target: { value: testName },
    });
    expect(comp.getByText("Delete")).toBeEnabled();
    fireEvent.click(comp.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("should error when deletion was not confirmed properly", async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { comp } = setupModal({
      showDialog: true,
      onCancel,
      onConfirm,
    });
    await waitForI18n(comp);

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.getByText("Delete")).toBeDisabled();

    fireEvent.change(comp.getByTestId("delete-confirmation-value"), {
      target: { value: "WRONG_VALUE" },
    });
    expect(comp.getByText("Cancel")).toBeEnabled();
    expect(comp.getByText("Delete")).toBeDisabled();
  });

  test("should allow the user to cancel the deletion", async () => {
    const onCancel = jest.fn();
    const { comp } = setupModal({
      showDialog: true,
      onCancel,
    });

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.getByText("Delete")).toBeDisabled();
    expect(comp.getByText("Cancel")).toBeEnabled();
    expect(onCancel).toHaveBeenCalledTimes(0);
    fireEvent.click(comp.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("should disable the delete button while the deletion is in progress", async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { comp } = setupModal({
      showDialog: true,
      isLoading: true,
      onCancel,
      onConfirm,
    });

    expect(await comp.findByText(title)).toBeInTheDocument();
    expect(comp.getByText("Delete")).toBeDisabled();
  });
});
