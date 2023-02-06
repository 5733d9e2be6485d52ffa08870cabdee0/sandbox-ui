import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { fireEvent } from "@testing-library/react";
import WarningModal from "@app/components/WarningModal/WarningModal";

describe("WarningModal component", () => {
  test("should not display anything if the modal is closed", async () => {
    const title = "Modal Title";
    const comp = customRender(
      <WarningModal onClose={jest.fn} title={title} isOpen={false}>
        body text
      </WarningModal>
    );
    await waitForI18n(comp);

    expect(comp.container).toBeEmptyDOMElement();
    expect(comp.queryByText(title)).not.toBeInTheDocument();
  });

  test("should display a modal with given title and message, if it is open", async () => {
    const title = "Modal Title";
    const message = "Modal Message";
    const comp = customRender(
      <WarningModal onClose={jest.fn} title={title}>
        {message}
      </WarningModal>
    );
    await waitForI18n(comp);

    expect(comp.container).toBeInTheDocument();
    expect(comp.queryByText(title)).toBeInTheDocument();
    expect(comp.queryByText(message)).toBeInTheDocument();
  });

  test("should execute the given action when the modal gets closed", async () => {
    const onCloseFn = jest.fn();
    const title = "Modal Title";
    const message = "Modal Message";
    const closeButtonLabel = "OK, got it.";
    const comp = customRender(
      <WarningModal
        onClose={onCloseFn}
        title={title}
        closeButtonLabel={closeButtonLabel}
      >
        {message}
      </WarningModal>
    );
    await waitForI18n(comp);

    expect(comp.queryByText(closeButtonLabel)).toBeInTheDocument();
    fireEvent.click(comp.getByText(closeButtonLabel));
    expect(onCloseFn).toHaveBeenCalledTimes(1);
  });
});
