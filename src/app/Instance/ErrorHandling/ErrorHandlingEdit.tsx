import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormAlert,
  FormGroup,
  PageSection,
} from "@patternfly/react-core";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/components/ErrorHandlingSelection";

export interface ErrorHandlingEditProps {
  apiError?: string;
  getSchemaByMethod: (method: string) => Promise<object>;
  isLoading: boolean;
  method?: string;
  onCancelEditing: () => void;
  onSubmit: (method?: string, parameters?: object, schema?: object) => void;
  parameters?: object;
  registerValidateParameters: (validationFunction: () => boolean) => void;
  schema?: object;
}

export const ErrorHandlingEdit = ({
  apiError,
  getSchemaByMethod,
  isLoading,
  method,
  onCancelEditing,
  onSubmit: onErrorHandlingSubmit,
  parameters,
  registerValidateParameters,
  schema,
}: ErrorHandlingEditProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<object | undefined>(
    schema
  );
  const [errorHandlingMethod, setErrorHandlingMethod] = useState<
    string | undefined
  >(method);
  const [errorHandlingParameters, setErrorHandlingParameters] =
    useState(parameters);

  const onErrorHandlingMethodSelection = useCallback(
    (errorMethod: string): void => {
      setErrorHandlingParameters({});
      setCurrentSchema({});
      if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
        setErrorHandlingMethod(undefined);
      } else {
        setIsSchemaLoading(true);
        setErrorHandlingMethod(errorMethod);
        getSchemaByMethod(errorMethod)
          .then((schema) => setCurrentSchema(schema))
          .finally(() => setIsSchemaLoading(false));
      }
    },
    [getSchemaByMethod]
  );

  const onErrorHandlingParametersChange = useCallback((model): void => {
    setErrorHandlingParameters(model as Record<string, unknown>);
  }, []);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onErrorHandlingSubmit(
        errorHandlingMethod,
        errorHandlingParameters,
        currentSchema
      );
      setIsSubmitted(true);
    },
    [
      currentSchema,
      errorHandlingMethod,
      errorHandlingParameters,
      onErrorHandlingSubmit,
    ]
  );

  useEffect(() => {
    if (isSubmitted) {
      document
        .querySelector(".pf-m-error")
        ?.parentElement?.previousElementSibling?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  return (
    <Form
      className="error-handling-edit-form"
      autoComplete="off"
      onSubmit={onSubmit}
    >
      {apiError && (
        <FormAlert>
          <Alert
            className="error-handling-edit__alert"
            ouiaId="error-schema"
            variant="danger"
            title={apiError}
            aria-live="polite"
            isInline
          />
        </FormAlert>
      )}
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
      <PageSection
        stickyOnBreakpoint={{ default: "bottom" }}
        padding={{ default: "noPadding" }}
        style={{ boxShadow: "none" }}
      >
        <ActionGroup className="error-handling-edit__actions">
          <Button
            variant="primary"
            ouiaId="submit"
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading || apiError !== undefined}
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
      </PageSection>
    </Form>
  );
};
