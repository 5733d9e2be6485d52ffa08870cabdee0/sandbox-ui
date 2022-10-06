import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormAlert,
  PageSection,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import ErrorHandlingCreate from "@app/Instance/ErrorHandling/ErrorHandlingCreate";

export interface ErrorHandlingEditProps {
  apiError?: string;
  getSchema: (method: string) => Promise<object>;
  isLoading: boolean;
  method?: string;
  onCancelEditing: () => void;
  onSubmit: (method?: string, parameters?: object, schema?: object) => void;
  parameters?: Record<string, unknown>;
  registerValidateParameters: (validationFunction: () => boolean) => void;
  schema?: object;
}

export const ErrorHandlingEdit = ({
  apiError,
  getSchema,
  isLoading,
  method,
  onCancelEditing,
  onSubmit: onErrorHandlingSubmit,
  parameters,
  registerValidateParameters,
}: ErrorHandlingEditProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorHandlingMethod, setErrorHandlingMethod] = useState<
    string | undefined
  >(method);
  const [errorHandlingParameters, setErrorHandlingParameters] =
    useState(parameters);

  const onErrorHandlingParametersChange = useCallback(
    (method?: string, parameters?: Record<string, unknown>): void => {
      setErrorHandlingMethod(method);
      setErrorHandlingParameters(parameters);
    },
    []
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onErrorHandlingSubmit(errorHandlingMethod, errorHandlingParameters);
      setIsSubmitted(true);
    },
    [errorHandlingMethod, errorHandlingParameters, onErrorHandlingSubmit]
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
      <ErrorHandlingCreate
        schemaId={errorHandlingMethod}
        getSchema={getSchema}
        registerValidation={registerValidateParameters}
        onChange={onErrorHandlingParametersChange}
        parameters={errorHandlingParameters}
      />
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
      </PageSection>
    </Form>
  );
};
