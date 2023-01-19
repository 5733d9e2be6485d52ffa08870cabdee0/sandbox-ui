/* eslint-disable @typescript-eslint/await-thenable */

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProcessorEdit from "@app/components/POCs/ProcessorEdit/ProcessorEdit";
import { Page } from "@patternfly/react-core";
import { PROCESSOR_TEMPLATES } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  demoTemplates,
  deployFunction,
  moreTemplates,
  waitForNextButton,
} from "@app/components/POCs/ProcessorEdit/storyUtils";

export default {
  title: "PoCs/Create Processor",
  component: ProcessorEdit,
  args: {
    onCancel: () => {},
    createProcessor: () => {},
    processorTemplates: PROCESSOR_TEMPLATES,
    sinkValuesSuggestions: ["MyFirstSink", "MySecondSink"],
  },
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ProcessorEdit>;

const Template: ComponentStory<typeof ProcessorEdit> = (args) => {
  return (
    <Page>
      <ProcessorEdit {...args} />
    </Page>
  );
};

export const CreationFlow = Template.bind({});

export const CodeErrorsValidation = Template.bind({});
CodeErrorsValidation.args = {
  processorTemplates: demoTemplates,
};
CodeErrorsValidation.play = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForNextButton(canvas);
  await userEvent.click(await canvas.getByText("Next"));
};

export const SyntaxErrorWarning = Template.bind({});
SyntaxErrorWarning.storyName = "Syntax error warning on deploy";
SyntaxErrorWarning.args = {
  processorTemplates: demoTemplates,
};
SyntaxErrorWarning.play = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForNextButton(canvas);
  await userEvent.click(await canvas.getByText("Next"));

  await waitFor(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await expect(canvas.getByText("1 Issue found")).toBeInTheDocument();
  });
  await userEvent.click(await canvas.getByText("Deploy Processor"));
};

export const CreationPending = Template.bind({});
CreationPending.args = {
  createProcessor: (): void => {
    // Doing nothing to remain in the loading status
  },
};
CreationPending.play = deployFunction;

export const NameAlreadyTaken = Template.bind({});
NameAlreadyTaken.storyName = "Creation Error - Name taken";
NameAlreadyTaken.args = {
  createProcessor: (_data, _onSuccess, onError): void => {
    onError("name-taken");
  },
};
NameAlreadyTaken.play = deployFunction;

export const GenericCreationError = Template.bind({});
GenericCreationError.storyName = "Creation Error - Generic error";
GenericCreationError.args = {
  createProcessor: (_data, _onSuccess, onError): void => {
    onError("generic-error");
  },
};
GenericCreationError.play = deployFunction;

export const ManyTemplatesOptions = Template.bind({});
ManyTemplatesOptions.args = {
  processorTemplates: moreTemplates,
};
