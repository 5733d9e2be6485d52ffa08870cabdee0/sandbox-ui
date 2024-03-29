import React, { useCallback, VoidFunctionComponent } from "react";
import { useMachine } from "@xstate/react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import ProcessorMachine, {
  CreateProcessorError,
} from "@app/components/POCs/ProcessorEdit/ProcessorMachine";
import ProcessorEditHeader from "@app/components/POCs/ProcessorEditHeader/ProcessorEditHeader";
import ProcessorCodeEditor from "@app/components/POCs/ProcessorCodeEditor/ProcessorCodeEditor";
import { ProcessorTemplateSelector } from "@app/components/POCs/ProcessorTemplateSelector/ProcessorTemplateSelector";
import { ProcessorTemplate } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";
import DeployBlockedModal from "@app/components/POCs/ProcessorEdit/components/DeployBlockedModal";
import { useTranslation } from "@rhoas/app-services-ui-components";
import "./ProcessorEdit.css";
import { ProcessorRequest } from "@rhoas/smart-events-management-sdk";
import { yamlToJson } from "@app/components/POCs/ProcessorEdit/utils";
import NameTakenModal from "@app/components/POCs/ProcessorEdit/components/NameTakenModal";
import GenericErrorModal from "@app/components/POCs/ProcessorEdit/components/GenericErrorModal";

export interface ProcessorEditProps {
  /** List of processor templates */
  processorTemplates: ProcessorTemplate[];
  /** List of sink values to use as suggestions while editing */
  sinkValuesSuggestions: string[];
  /** Callback to create a processor */
  createProcessor: (
    data: ProcessorRequest,
    onSuccess: () => void,
    onError: (error: CreateProcessorError) => void
  ) => void;
  /** Callback to cancel the creation flow */
  onCancel: () => void;
  /** Existing name of the processor */
  existingProcessorName?: string;
  /** Existing code of the processor */
  existingCode?: string;
}

const ProcessorEdit: VoidFunctionComponent<ProcessorEditProps> = (props) => {
  const {
    processorTemplates,
    sinkValuesSuggestions,
    createProcessor,
    onCancel,
    existingCode,
    existingProcessorName,
  } = props;
  const { t } = useTranslation("smartEventsTempDictionary");

  const [current, send] = useMachine(ProcessorMachine, {
    context: {
      processorName: existingProcessorName ?? t("processor.processorName"),
      code: existingCode ?? processorTemplates[0].code,
      templates: processorTemplates,
      selectedTemplate: processorTemplates[0].id,
      sinkSuggestions: sinkValuesSuggestions,
    },
    services: {
      createProcessor: (context) => {
        const { code, processorName } = context;
        const flows = yamlToJson(code);
        return (send) => {
          function onSuccess(): void {
            send("create success");
          }
          function onError(error: CreateProcessorError): void {
            send({ type: "create error", error });
          }
          createProcessor(
            { name: processorName, flows: flows as object },
            onSuccess,
            onError
          );
        };
      },
    },
    devTools: true,
  });

  const {
    processorName,
    templates,
    selectedTemplate,
    code,
    codeErrors,
    sinkSuggestions,
    creationError,
  } = current.context;

  const templateSelectionStep = current.hasTag("step 1");
  const codeEditingStep = current.hasTag("step 2");
  const isSaving = current.matches("processor deployment.saving");
  const isDeployBlocked = current.matches("code editing.deploy blocked");
  const isNameTaken = creationError === "name-taken";
  const isGenericError = creationError === "generic-error";

  const handleCreateProcessor = useCallback((): void => {
    send({ type: "create processor" });
  }, [send]);

  const handleNameChange = useCallback(
    (name: string): void => {
      send({ type: "change processor name", name });
    },
    [send]
  );

  const handleSelectTemplate = useCallback(
    (templateId: string): void => {
      send({ type: "select template", templateId });
    },
    [send]
  );

  const handleNextStep = useCallback((): void => {
    send("next step");
  }, [send]);

  const handleSkip = useCallback((): void => {
    send("skip template");
  }, [send]);

  const handleCodeChange = useCallback(
    (value: string): void => {
      send({ type: "change code", value });
    },
    [send]
  );

  const handleCodeValidation = useCallback(
    (errorsCount: number): void => {
      send({ type: "update validation", errorsCount });
    },
    [send]
  );

  const handleCloseInvalidModal = useCallback((): void => {
    send("close invalid alert");
  }, [send]);

  const handleCloseErrorModals = useCallback((): void => {
    send("close error alert");
  }, [send]);

  return (
    <>
      <ProcessorEditHeader
        name={processorName}
        onNameChange={handleNameChange}
        showCreateAction={codeEditingStep}
        onCreate={handleCreateProcessor}
        isLoading={isSaving}
      />
      {templateSelectionStep && (
        <PageSection
          isFilled={true}
          variant={PageSectionVariants.light}
          padding={{ default: "noPadding" }}
        >
          <div className="processor-edit__step-container">
            <ProcessorTemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate ?? ""}
              onSelect={handleSelectTemplate}
              onCancel={onCancel}
              onNext={handleNextStep}
              onSkip={handleSkip}
            />
          </div>
        </PageSection>
      )}
      {codeEditingStep && (
        <PageSection isFilled={true} variant={PageSectionVariants.default}>
          <div className="processor-edit__step-container">
            <ProcessorCodeEditor
              code={code}
              onChange={handleCodeChange}
              onValidate={handleCodeValidation}
              onGuideClick={(): void => {
                console.log("guide click");
              }}
              sinkConnectorsNames={sinkSuggestions}
              errors={codeErrors}
              readOnly={isSaving}
            />
          </div>
          {isDeployBlocked && (
            <DeployBlockedModal
              errorsCount={codeErrors}
              onClose={handleCloseInvalidModal}
            />
          )}
          {isNameTaken && (
            <NameTakenModal
              processorName={processorName}
              onClose={handleCloseErrorModals}
            />
          )}
          {isGenericError && (
            <GenericErrorModal onClose={handleCloseErrorModals} />
          )}
        </PageSection>
      )}
    </>
  );
};

export default ProcessorEdit;
