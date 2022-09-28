import React, { FormEvent, useCallback, useState } from "react";
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormAlert,
  FormGroup,
} from "@patternfly/react-core";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/ErrorHandlingSelection";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "react-i18next";
import { ProcessorSchemaType } from "../../../types/Processor";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";

interface ErrorHandlingEditProps {
  parameters?: object;
  method?: string;
  schema?: object;
  isLoading: boolean;
  onCancelEditing: () => void;
  onSubmit: (method?: string, parameters?: object, schema?: object) => void;
  registerValidateParameters: (validationFunction: () => boolean) => void;
}

export const ErrorHandlingEdit = ({
  parameters,
  method,
  schema,
  isLoading,
  onCancelEditing,
  onSubmit: onErrorHandlingSubmit,
  registerValidateParameters,
}: ErrorHandlingEditProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [genericError, setGenericError] = useState<string | undefined>();
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<object | undefined>(
    schema
  );
  const [errorHandlingMethod, setErrorHandlingMethod] = useState<
    string | undefined
  >(method);
  const [errorHandlingParameters, setErrorHandlingParameters] =
    useState(parameters);

  const { getSchema } = useGetSchemaApi();

  const onErrorHandlingMethodSelection = useCallback(
    (errorMethod: string): void => {
      setGenericError(undefined);
      setErrorHandlingParameters({});
      setCurrentSchema({});
      if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
        setErrorHandlingMethod(undefined);
      } else {
        setIsSchemaLoading(true);
        setErrorHandlingMethod(errorMethod);
        getSchema(errorMethod, ProcessorSchemaType.ACTION)
          .then((data) => setCurrentSchema(data))
          .catch(() => setGenericError("Internal Server Error"))
          .finally(() => setIsSchemaLoading(false));
      }
    },
    [getSchema]
  );

  const onErrorHandlingParametersChange = useCallback((model): void => {
    setErrorHandlingParameters(model as Record<string, unknown>);
    setGenericError(undefined);
  }, []);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onErrorHandlingSubmit(
        errorHandlingMethod,
        errorHandlingParameters,
        currentSchema
      );
    },
    [
      currentSchema,
      errorHandlingMethod,
      errorHandlingParameters,
      onErrorHandlingSubmit,
    ]
  );

  return (
    <Form id="error-handling-edit-form" autoComplete="off" onSubmit={onSubmit}>
      <FormGroup
        label={t("common.errorHandlingMethod")}
        fieldId={"error-handling-method"}
        isRequired
      >
        <ErrorHandlingSelection
          selectedMethod={method ?? ERROR_HANDLING_METHODS.default.value}
          errorHandlingMethods={ERROR_HANDLING_METHODS}
          isDisabled={isSchemaLoading}
          onMethodSelection={onErrorHandlingMethodSelection}
        />
      </FormGroup>
      {currentSchema && !isSchemaLoading && (
        <ConfigurationForm
          configuration={errorHandlingParameters}
          schema={currentSchema}
          onChange={onErrorHandlingParametersChange}
          registerValidation={registerValidateParameters}
          readOnly={isSchemaLoading}
          editMode={false}
        />
      )}
      {genericError && (
        <FormAlert>
          <Alert
            className="error-handling-edit__alert"
            ouiaId="error-schema"
            variant="danger"
            title={genericError}
            aria-live="polite"
            isInline
          />
        </FormAlert>
      )}
      <ActionGroup className={"error-handling-edit__actions"}>
        <Button
          variant="primary"
          ouiaId="submit"
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {t("common.save")}
        </Button>
        <Button
          variant="link"
          ouiaId="cancel"
          onClick={onCancelEditing}
          isDisabled={isLoading}
        >
          {t("common.cancel")}
        </Button>
      </ActionGroup>
    </Form>
  );
};
