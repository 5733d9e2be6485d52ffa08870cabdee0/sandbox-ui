import React from "react";
import { fireEvent, RenderResult } from "@testing-library/react";
import { customRender, waitForI18n } from "@utils/testUtils";
import ProcessorEdit, {
  ProcessorEditProps,
} from "@app/components/POCs/ProcessorEdit/ProcessorEdit";
import { CamelDSLCodeEditorProps } from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";
import { demoTemplates } from "@app/components/POCs/ProcessorEdit/storyUtils";

const setupCreateProcessor = (
  props: Partial<ProcessorEditProps>
): { comp: RenderResult } => {
  const { onCancel = jest.fn(), createProcessor = jest.fn() } = props;
  const comp = customRender(
    <ProcessorEdit
      onCancel={onCancel}
      processorTemplates={demoTemplates}
      createProcessor={createProcessor}
      sinkValuesSuggestions={[]}
    />
  );
  return { comp };
};

const selectedPFCardCSSClass = "pf-m-selected-raised";

const selectProcessorTemplateString = "Select processor template";
const nextLabel = "Next";
const processorDefaultName = "Processor name";
const processorNameLabel = "Processor name";
const setNameLabel = "Set name";
const editNameLabel = "Edit name";
const cancelNameEditsLabel = "Cancel edits";
const deployProcessorLabel = "Deploy Processor";

jest.mock("@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor", () => {
  const MockedEditor = ({
    code,
    onChange,
  }: CamelDSLCodeEditorProps): JSX.Element => {
    return (
      <textarea
        value={code}
        onChange={(event): void => onChange(event.target.value)}
      />
    );
  };
  MockedEditor.displayName = "CamelDSLCodeEditor";
  return MockedEditor;
});

describe("ProcessorEdit component", () => {
  it("should display template selection as first step", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    expect(comp.getByText(processorDefaultName)).toBeInTheDocument();
    expect(comp.getByText(selectProcessorTemplateString)).toBeInTheDocument();
    expect(comp.queryByText(deployProcessorLabel)).not.toBeInTheDocument();
  });

  it("should display the first template as selected", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    expect(comp.getByText(selectProcessorTemplateString)).toBeInTheDocument();
    // no other ways to check that the first template card is selected without looking at its CSS classes
    expect(comp.getByTestId(demoTemplates[0].id)).toHaveClass(
      selectedPFCardCSSClass
    );
    expect(comp.queryByDisplayValue(demoTemplates[0].code)).toBeInTheDocument();
  });

  it("should allow the user to pick a different template", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    expect(comp.getByText(selectProcessorTemplateString)).toBeInTheDocument();

    fireEvent.click(comp.getByTestId(demoTemplates[1].id));

    expect(
      comp.queryByDisplayValue(demoTemplates[0].code)
    ).not.toBeInTheDocument();
    expect(comp.getByTestId(demoTemplates[0].id)).not.toHaveClass(
      selectedPFCardCSSClass
    );
    expect(comp.getByTestId(demoTemplates[1].id)).toHaveClass(
      selectedPFCardCSSClass
    );
    expect(comp.queryByDisplayValue(demoTemplates[1].code)).toBeInTheDocument();
  });

  it("should display the second step when clicking 'Next'", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    expect(comp.getByText(selectProcessorTemplateString)).toBeInTheDocument();
    expect(comp.queryByText(deployProcessorLabel)).not.toBeInTheDocument();
    expect(comp.getByText(nextLabel)).toBeInTheDocument();

    fireEvent.click(comp.getByText(nextLabel));

    expect(
      comp.queryByText(selectProcessorTemplateString)
    ).not.toBeInTheDocument();
    expect(comp.getByText(deployProcessorLabel)).toBeInTheDocument();
  });

  it("should allow the user to cancel the processor creation", async () => {
    const onCancel = jest.fn();
    const { comp } = setupCreateProcessor({ onCancel });
    await waitForI18n(comp);

    expect(comp.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(comp.getByText("Cancel"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should let the user change the processor name", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    const newProcessorName = "my processor";

    // default name text is present
    expect(comp.getByText(processorDefaultName)).toBeInTheDocument();
    // edit processor button is present and enabled
    expect(comp.getByLabelText(editNameLabel)).toBeInTheDocument();
    expect(comp.getByLabelText(editNameLabel)).toBeEnabled();
    // processor name input field is not present
    expect(comp.queryByLabelText(processorNameLabel)).not.toBeInTheDocument();

    // click on edit button (switching to edit mode)
    fireEvent.click(comp.getByLabelText(editNameLabel));

    // default name text is not present
    expect(comp.queryByText(processorDefaultName)).not.toBeInTheDocument();
    // processor name input field is present
    expect(comp.getByLabelText(processorNameLabel)).toBeInTheDocument();
    // set name button is present and enabled
    expect(comp.getByLabelText(setNameLabel)).toBeInTheDocument();
    expect(comp.getByLabelText(setNameLabel)).toBeEnabled();
    // cancel edits button is present and enabled
    expect(comp.getByLabelText(cancelNameEditsLabel)).toBeInTheDocument();
    expect(comp.getByLabelText(cancelNameEditsLabel)).toBeEnabled();

    // change the value of the processor name input field
    fireEvent.change(comp.getByLabelText(processorNameLabel), {
      target: { value: newProcessorName },
    });

    // confirm the changes by clicking on the set name button (switching back to read mode)
    fireEvent.click(comp.getByLabelText(setNameLabel));

    // set name button is not present
    expect(comp.queryByLabelText(setNameLabel)).not.toBeInTheDocument();
    // old default name text is not present anymore
    expect(comp.queryByText(processorDefaultName)).not.toBeInTheDocument();
    // new name text is now present
    expect(comp.getByText(newProcessorName)).toBeInTheDocument();
  });

  it("should warn the user when he tries to set an empty name", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    const newProcessorName = "my processor";
    const emptyNameMessage = "Please enter a processor name";

    // default name
    expect(comp.getByText(processorDefaultName)).toBeInTheDocument();

    // click on edit button (switching to edit mode)
    fireEvent.click(comp.getByLabelText(editNameLabel));

    // warning message is not present
    expect(comp.queryByText(emptyNameMessage)).not.toBeInTheDocument();

    // change name value to an empty value
    fireEvent.change(comp.getByLabelText(processorNameLabel), {
      target: { value: "" },
    });

    // set name button is disabled
    expect(comp.getByLabelText(setNameLabel)).toBeDisabled();
    // warning message is displayed for empty name
    expect(comp.getByText(emptyNameMessage)).toBeInTheDocument();

    // change name to a non-empty value
    fireEvent.change(comp.getByLabelText(processorNameLabel), {
      target: { value: newProcessorName },
    });

    // set name button is enabled again
    expect(comp.getByLabelText(setNameLabel)).toBeEnabled();

    // click on set name
    fireEvent.click(comp.getByLabelText(setNameLabel));

    // warning message is not shown anymore
    expect(comp.queryByText(emptyNameMessage)).not.toBeInTheDocument();

    // default name is not present
    expect(comp.queryByText(processorDefaultName)).not.toBeInTheDocument();
    // new name is present
    expect(comp.getByText(newProcessorName)).toBeInTheDocument();
  });

  it("should let the user cancel changes to the name", async () => {
    const { comp } = setupCreateProcessor({});
    await waitForI18n(comp);

    const newProcessorName = "my processor";

    // default name
    expect(comp.getByText(processorDefaultName)).toBeInTheDocument();

    // click on edit button (switching to edit mode)
    fireEvent.click(comp.getByLabelText(editNameLabel));

    // change name value
    fireEvent.change(comp.getByLabelText(processorNameLabel), {
      target: { value: newProcessorName },
    });

    // cancel name edits button is enabled
    expect(comp.getByLabelText(cancelNameEditsLabel)).toBeEnabled();

    // click on cancel edits
    fireEvent.click(comp.getByLabelText(cancelNameEditsLabel));

    // old name value is present because changes were canceled
    expect(comp.getByText(processorDefaultName)).toBeInTheDocument();
    // new name is not present
    expect(comp.queryByText(newProcessorName)).not.toBeInTheDocument();
  });

  it("should deploy the processor", async () => {
    const createProcessor = jest.fn();
    const { comp } = setupCreateProcessor({ createProcessor });
    await waitForI18n(comp);

    const newProcessorName = "my processor";

    expect(comp.getByText(nextLabel)).toBeInTheDocument();

    fireEvent.click(comp.getByText(nextLabel));

    fireEvent.click(comp.getByLabelText(editNameLabel));

    fireEvent.change(comp.getByLabelText(processorNameLabel), {
      target: { value: newProcessorName },
    });

    fireEvent.click(comp.getByLabelText(setNameLabel));

    expect(comp.getByText(deployProcessorLabel)).toBeInTheDocument();
    fireEvent.click(comp.getByText(deployProcessorLabel));

    expect(comp.getByText(deployProcessorLabel)).toBeDisabled();

    expect(createProcessor).toHaveBeenCalledTimes(1);
    expect(createProcessor).toHaveBeenCalledWith(
      {
        name: newProcessorName,
        flows: demoTemplates[0].code,
      },
      expect.anything(),
      expect.anything()
    );
  });

  it("should display an error when the processor name is already taken", async () => {
    const processorAlreadyExistingMessage = "Processor already existing";
    const { comp } = setupCreateProcessor({
      createProcessor: (_data, _onSuccess, onError) => {
        onError("name-taken");
      },
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText(nextLabel));

    expect(comp.getByText(deployProcessorLabel)).toBeInTheDocument();

    expect(
      comp.queryByText(processorAlreadyExistingMessage)
    ).not.toBeInTheDocument();

    fireEvent.click(comp.getByText(deployProcessorLabel));

    expect(comp.getByText(processorAlreadyExistingMessage)).toBeInTheDocument();

    fireEvent.click(comp.getByText("Close"));

    expect(
      comp.queryByText(processorAlreadyExistingMessage)
    ).not.toBeInTheDocument();
  });

  it("should display an error when the deploy request fails", async () => {
    const genericErrorMessage = "Something went wrong";

    const { comp } = setupCreateProcessor({
      createProcessor: (_data, _onSuccess, onError) => {
        onError("generic-error");
      },
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText(nextLabel));

    expect(comp.getByText(deployProcessorLabel)).toBeInTheDocument();

    expect(comp.queryByText(genericErrorMessage)).not.toBeInTheDocument();

    fireEvent.click(comp.getByText(deployProcessorLabel));

    expect(comp.getByText(genericErrorMessage)).toBeInTheDocument();

    fireEvent.click(comp.getByText("Close"));

    expect(comp.queryByText(genericErrorMessage)).not.toBeInTheDocument();
  });
});
