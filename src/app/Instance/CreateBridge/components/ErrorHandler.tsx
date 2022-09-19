import React, { useEffect, useState, VoidFunctionComponent } from "react";
import { FormGroup, FormSection } from "@patternfly/react-core";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/ErrorHandlingSelection";
import { ERROR_HANDLING_METHODS } from "../../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { useTranslation } from "react-i18next";
import { ProcessorSchemaType } from "../../../../types/Processor";
import { GetSchema } from "../../../../hooks/useSchemasApi/useGetSchemaApi";

interface ErrorHandlerProps {
  getSchema: GetSchema;
  registerValidation: (validationFunction: () => boolean) => void;
}

const ErrorHandler: VoidFunctionComponent<ErrorHandlerProps> = (props) => {
  const { getSchema, registerValidation } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const [errorHandlingSchemaId, setErrorHandlingSchemaId] = useState<
    string | null
  >(null);
  const [errorHandlingSchema, setErrorHandlingSchema] = useState<object>();
  const [errorHandlingSchemaLoading, setErrorHandlingSchemaLoading] =
    useState<boolean>(false);
  const [errorHandlingParameters, setErrorHandlingParameters] = useState({});

  useEffect(() => {
    setErrorHandlingSchema(undefined);
    if (errorHandlingSchemaId) {
      setErrorHandlingSchemaLoading(true);
      getSchema(errorHandlingSchemaId, ProcessorSchemaType.ACTION)
        .then((data) => setErrorHandlingSchema(data))
        // .catch(() => setGenericError("Internal Server Error"))
        .catch(() => console.log("Internal Server Error"))
        .finally(() => setErrorHandlingSchemaLoading(false));
    }
  }, [errorHandlingSchemaId, getSchema]);

  return (
    <FormSection title={t("common.errorHandling")} titleElement="h3">
      <FormGroup
        label={t("common.errorHandlingMethod")}
        fieldId={"error-handling-method"}
        isRequired
      >
        <ErrorHandlingSelection
          defaultMethod={ERROR_HANDLING_METHODS.default.value}
          errorHandlingMethods={ERROR_HANDLING_METHODS}
          // isDisabled={formIsDisabled}
          isDisabled={false}
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
      {errorHandlingSchema && !errorHandlingSchemaLoading && (
        <ConfigurationForm
          configuration={errorHandlingParameters}
          schema={errorHandlingSchema}
          onChange={(model): void => {
            setErrorHandlingParameters(model as Record<string, unknown>);
            // setHasParametersError(false);
          }}
          registerValidation={registerValidation}
          // readOnly={formIsDisabled}
          editMode={false}
        />
      )}
    </FormSection>
  );
};

export default ErrorHandler;
