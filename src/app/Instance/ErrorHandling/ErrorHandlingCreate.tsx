import React, {
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from "react";
import {
  Alert,
  AlertActionCloseButton,
  FormGroup,
} from "@patternfly/react-core";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/components/ErrorHandlingSelection";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../types/Processor";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";

interface ErrorHandlingProps {
  schemaId?: string;
  getSchema: GetSchema;
  registerValidation: (validationFunction: () => boolean) => void;
  onChange: (method?: string, parameters?: Record<string, unknown>) => void;
  parameters?: Record<string, unknown>;
  isDisabled?: boolean;
  alertErrorManagedInternally?: boolean;
}

const ErrorHandlingCreate: VoidFunctionComponent<ErrorHandlingProps> = (
  props
) => {
  const {
    schemaId,
    getSchema,
    registerValidation,
    onChange,
    parameters = {},
    isDisabled = false,
    alertErrorManagedInternally = true,
  } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const [errorHandlingSchemaId, setErrorHandlingSchemaId] = useState<
    string | undefined
  >(schemaId);
  const [errorHandlingSchema, setErrorHandlingSchema] = useState<
    object | undefined
  >();
  const [errorHandlingSchemaLoading, setErrorHandlingSchemaLoading] =
    useState<boolean>(false);
  const [errorHandlingParameters, setErrorHandlingParameters] =
    useState(parameters);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    setErrorHandlingSchema(undefined);
    if (errorHandlingSchemaId) {
      setErrorHandlingSchemaLoading(true);
      setLoadingError(false);
      getSchema(errorHandlingSchemaId, ProcessorSchemaType.ACTION)
        .then((data) => setErrorHandlingSchema(data))
        .catch(() => {
          setErrorHandlingSchemaId(undefined);
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

  const alertError = useMemo(
    () =>
      loadingError && (
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
      ),
    [loadingError, t]
  );

  return (
    <>
      <FormGroup
        label={t("common.errorHandlingMethod")}
        fieldId={"error-handling-method"}
        isRequired
      >
        <ErrorHandlingSelection
          selectedMethod={errorHandlingSchemaId}
          errorHandlingMethods={ERROR_HANDLING_METHODS}
          isDisabled={isDisabled || errorHandlingSchemaLoading}
          onMethodSelection={(errorMethod: string): void => {
            setErrorHandlingParameters({});
            if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
              setErrorHandlingSchemaId(undefined);
            } else {
              setErrorHandlingSchemaId(errorMethod);
            }
          }}
        />
      </FormGroup>
      {alertErrorManagedInternally && alertError}
      {errorHandlingSchema && !errorHandlingSchemaLoading && (
        <ConfigurationForm
          configuration={errorHandlingParameters}
          schema={errorHandlingSchema}
          onChange={setErrorHandlingParameters}
          registerValidation={registerValidation}
          readOnly={isDisabled || errorHandlingSchemaLoading}
          editMode={false}
        />
      )}
    </>
  );
};

export default ErrorHandlingCreate;
