import React from "react";
import { FormGroup } from "@patternfly/react-core";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/ErrorHandlingSelection";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "react-i18next";

interface ErrorHandlingCreateProps {
  errorHandlingParameters?: object;
  errorHandlingSchema?: object;
  errorHandlingSchemaLoading: boolean;
  formIsDisabled: boolean;
  onErrorHandlingMethodSelection: (errorMethod: string) => void;
  onErrorHandlingParametersChange: (model: object) => void;
  registerValidateParameters: (validationFunction: () => boolean) => void;
}

export const ErrorHandlingCreate = ({
  errorHandlingParameters,
  errorHandlingSchema,
  errorHandlingSchemaLoading,
  formIsDisabled,
  onErrorHandlingMethodSelection,
  onErrorHandlingParametersChange,
  registerValidateParameters,
}: ErrorHandlingCreateProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <FormGroup
        label={t("common.errorHandlingMethod")}
        fieldId={"error-handling-method"}
        isRequired
      >
        <ErrorHandlingSelection
          selectedMethod={ERROR_HANDLING_METHODS.default.value}
          errorHandlingMethods={ERROR_HANDLING_METHODS}
          isDisabled={formIsDisabled}
          onMethodSelection={onErrorHandlingMethodSelection}
        />
      </FormGroup>
      {errorHandlingSchema && !errorHandlingSchemaLoading && (
        <ConfigurationForm
          configuration={errorHandlingParameters}
          schema={errorHandlingSchema}
          onChange={onErrorHandlingParametersChange}
          registerValidation={registerValidateParameters}
          readOnly={formIsDisabled}
          editMode={false}
        />
      )}
    </>
  );
};
