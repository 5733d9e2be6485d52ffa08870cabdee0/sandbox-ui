import { customRender, waitForI18n } from "@utils/testUtils";
import { ActionModal } from "@app/components/ActionModal/ActionModal";
import React from "react";
import { fireEvent } from "@testing-library/react";

describe("Action Modal component", () => {
  test("should not display anything if the modal is closed", async () => {
    const title = "Modal Title";
    const comp = customRender(
      <ActionModal
        action={jest.fn}
        message={""}
        showDialog={false}
        title={title}
      />
    );
    await waitForI18n(comp);

    expect(comp.container).toBeEmptyDOMElement();
    expect(comp.queryByText(title)).not.toBeInTheDocument();
  });

  test("should display a modal with given title and message, if it is open", async () => {
    const title = "Modal Title";
    const message = "Modal Message";
    const comp = customRender(
      <ActionModal
        action={jest.fn}
        message={message}
        showDialog={true}
        title={title}
      />
    );
    await waitForI18n(comp);

    expect(comp.container).toBeInTheDocument();
    expect(comp.queryByText(title)).toBeInTheDocument();
    expect(comp.queryByText(message)).toBeInTheDocument();
  });

  test("should execute the given action when the modal gets closed", async () => {
    const actionFn = jest.fn();
    const title = "Modal Title";
    const message = "Modal Message";
    const comp = customRender(
      <ActionModal
        action={actionFn}
        message={message}
        showDialog={true}
        title={title}
      />
    );
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Close"));
    expect(actionFn).toHaveBeenCalledTimes(1);
  });
});
