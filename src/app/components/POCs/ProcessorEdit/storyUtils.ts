/* eslint-disable @typescript-eslint/await-thenable */

import { ProcessorTemplate } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";
import { CodeIcon, DataSinkIcon } from "@patternfly/react-icons";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { PlayFunction } from "@storybook/csf";
import { ReactFramework } from "@storybook/react";
import { ProcessorEditProps } from "@app/components/POCs/ProcessorEdit/ProcessorEdit";

const demoTemplates: ProcessorTemplate[] = [
  {
    id: "first",
    title: "First Template",
    description: "First template description.",
    icon: CodeIcon,
    code: "first-template-code",
  },
  {
    id: "second",
    title: "Second Template",
    description: "Second Template description.",
    icon: DataSinkIcon,
    code: "second-template-code",
  },
];

const moreTemplates: ProcessorTemplate[] = [
  ...demoTemplates,
  {
    id: "third",
    title: "Third Template",
    description: "Third template description.",
    icon: CodeIcon,
    code: "third-template-code",
  },
  {
    id: "fourth",
    title: "Fourth Template",
    description: "Fourth Template description.",
    icon: CodeIcon,
    code: "fourth-template-code",
  },
  {
    id: "fifth",
    title: "Fifth Template",
    description: "Fifth Template description.",
    icon: CodeIcon,
    code: "fifth-template-code",
  },
];

const waitForNextButton = async (canvas: unknown): Promise<void> => {
  await waitFor(
    async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await expect(canvas.getByText("Next")).toBeEnabled();
    },
    { timeout: 3000 }
  );
};

const deployFunction: PlayFunction<
  ReactFramework,
  ProcessorEditProps
> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitForNextButton(canvas);
  await userEvent.click(await canvas.getByText("Next"));
  await userEvent.click(await canvas.getByText("Deploy Processor"));
};

export { demoTemplates, moreTemplates, waitForNextButton, deployFunction };
