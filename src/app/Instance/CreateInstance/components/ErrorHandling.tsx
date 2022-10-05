import React, { useEffect, useState, VoidFunctionComponent } from "react";
import {
  Alert,
  AlertActionCloseButton,
  FormGroup,
  FormSection,
} from "@patternfly/react-core";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/components/ErrorHandlingSelection";
import { ERROR_HANDLING_METHODS } from "../../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { ProcessorSchemaType } from "../../../../types/Processor";
import { GetSchema } from "../../../../hooks/useSchemasApi/useGetSchemaApi";

interface ErrorHandlingProps {
  getSchema: GetSchema;
  registerValidation: (validationFunction: () => boolean) => void;
  onChange: (method?: string, parameters?: Record<string, unknown>) => void;
  isDisabled: boolean;
}

const ErrorHandling: VoidFunctionComponent<ErrorHandlingProps> = (props) => {
  const { getSchema, registerValidation, onChange, isDisabled } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const [errorHandlingSchemaId, setErrorHandlingSchemaId] = useState<
    string | null
  >(null);
  const [errorHandlingSchema, setErrorHandlingSchema] = useState<object>();
  const [errorHandlingSchemaLoading, setErrorHandlingSchemaLoading] =
    useState<boolean>(false);
  const [errorHandlingParameters, setErrorHandlingParameters] = useState({});
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    setErrorHandlingSchema(undefined);
    if (errorHandlingSchemaId) {
      setErrorHandlingSchemaLoading(true);
      setLoadingError(false);
      getSchema(errorHandlingSchemaId, ProcessorSchemaType.ACTION)
        .then((data) => setErrorHandlingSchema(data))
        .catch(() => {
          setErrorHandlingSchemaId(null);
          setLoadingError(true);
        })
        .finally(() => setErrorHandlingSchemaLoading(false));
    }
  }, [errorHandlingSchemaId, getSchema]);

  useEffect(() => {
    if (errorHandlingSchemaId) {
      onChange(errorHandlingSchemaId, errorHandlingParameters);
    } else {
      registerValidation(() => true);
      onChange(undefined, undefined);
    }
  }, [
    errorHandlingSchemaId,
    errorHandlingParameters,
    onChange,
    registerValidation,
  ]);

  return (
    <FormSection title={t("common.errorHandling")} titleElement="h3">
      <FormGroup
        label={t("common.errorHandlingMethod")}
        fieldId={"error-handling-method"}
        isRequired
      >
        <ErrorHandlingSelection
          selectedMethod={errorHandlingSchemaId}
          errorHandlingMethods={ERROR_HANDLING_METHODS}
          isDisabled={isDisabled}
          onMethodSelection={(errorMethod: string): void => {
            setErrorHandlingParameters({});
            if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
              setErrorHandlingSchemaId(null);
            } else {
              setErrorHandlingSchemaId(errorMethod);
            }
          }}
        />
      </FormGroup>
      {loadingError && (
        <Alert
          variant="warning"
          isInline
          title={t("errorHandling.errors.schemaGenericErrorDuringCreation")}
          actionClose={
            <AlertActionCloseButton
              onClose={(): void => setLoadingError(false)}
            />
          }
        />
      )}
      {errorHandlingSchema && !errorHandlingSchemaLoading && (
        <ConfigurationForm
          configuration={errorHandlingParameters}
          schema={errorHandlingSchema}
          onChange={(model): void => {
            setErrorHandlingParameters(model as Record<string, unknown>);
          }}
          registerValidation={registerValidation}
          readOnly={isDisabled}
          editMode={false}
        />
      )}
    </FormSection>
  );
};

export default ErrorHandling;
