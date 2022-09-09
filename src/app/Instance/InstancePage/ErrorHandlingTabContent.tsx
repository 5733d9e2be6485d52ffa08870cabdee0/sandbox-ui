import {
  ActionGroup,
  Button,
  Form,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../types/Processor";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { ErrorHandlingDetail } from "@app/Instance/ErrorHandling/ErrorHandlingDetail";
import { ErrorHandlingEdit } from "@app/Instance/ErrorHandling/ErrorHandlingEdit";

interface ErrorHandlingTabContentProps {
  bridgeStatus?: ManagedResourceStatus;
  errorHandlingType?: string;
  errorHandlingParameters?: { [p: string]: unknown };
  isBridgeLoading: boolean;
}

export const ErrorHandlingTabContent = ({
  bridgeStatus,
  errorHandlingType,
  errorHandlingParameters,
  isBridgeLoading,
}: ErrorHandlingTabContentProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const validateParameters = useRef<(() => boolean) | undefined>();

  const registerValidateParameters = (callback: () => boolean): void => {
    validateParameters.current = callback;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [schema, setSchema] = useState<object>();
  const [schemaError, setSchemaError] = useState<string | undefined>();
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);

  const { getSchema } = useGetSchemaApi();

  useEffect(() => {
    if (errorHandlingType) {
      setIsSchemaLoading(true);
      setSchema(undefined);
      setSchemaError(undefined);
      getSchema(errorHandlingType, ProcessorSchemaType.ACTION)
        .then((data) => setSchema(data))
        .catch((error) => {
          if (error && axios.isAxiosError(error)) {
            if (
              isServiceApiError(error) &&
              getErrorCode(error) === APIErrorCodes.ERROR_4
            ) {
              setSchemaError(t("errorHandling.errors.cantFindSchema"));
            } else {
              setSchemaError(t("errorHandling.errors.schemaGenericError"));
            }
          }
        })
        .finally(() => setIsSchemaLoading(false));
    }
  }, [errorHandlingType, getSchema, t]);

  const onErrorHandlingMethodSelection = useCallback(
    (errorMethod: string): void => {
      console.log(errorMethod); //TODO
      // setErrorHandlingParameters({});
      // if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
      //   setErrorHandlingSchemaId(null);
      // } else {
      //   setErrorHandlingSchemaId(errorMethod);
      // }
    },
    []
  );

  const onErrorHandlingParametersChange = useCallback((model): void => {
    console.log(model); //TODO
    // setErrorHandlingParameters(model as Record<string, unknown>);
    // setHasParametersError(false);
  }, []);

  const formIsDisabled =
    bridgeStatus !== ManagedResourceStatus.Ready ||
    isBridgeLoading ||
    isSchemaLoading ||
    schemaError !== undefined;

  return (
    <PageSection
      className="instance-page__tabs-error-handling__section"
      variant={PageSectionVariants.light}
      isFilled
    >
      <Stack hasGutter>
        <StackItem>
          <Split hasGutter>
            <SplitItem isFilled>
              <TextContent>
                <Text
                  component={TextVariants.h2}
                  ouiaId="error-handling-section"
                >
                  {t("common.errorHandlingMethod")}
                </Text>
              </TextContent>
            </SplitItem>
            {!isEditing && (
              <SplitItem>
                <Button
                  isAriaDisabled={formIsDisabled}
                  ouiaId="edit"
                  onClick={(): void => setIsEditing(true)}
                >
                  {t("common.edit")}
                </Button>
              </SplitItem>
            )}
          </Split>
        </StackItem>
        <StackItem>
          {isEditing ? (
            <Form
              id="error-handling-edit-form"
              onSubmit={(): void => console.log("form submit")}
            >
              <ErrorHandlingEdit
                errorHandlingParameters={errorHandlingParameters}
                errorHandlingSchema={schema}
                errorHandlingSchemaLoading={isSchemaLoading}
                formIsDisabled={formIsDisabled}
                onErrorHandlingMethodSelection={onErrorHandlingMethodSelection}
                onErrorHandlingParametersChange={
                  onErrorHandlingParametersChange
                }
                registerValidateParameters={registerValidateParameters}
              />
              <ActionGroup className={"error-handling-edit__actions"}>
                <Button
                  variant="primary"
                  ouiaId="submit"
                  onClick={(): void => console.log("form submit")}
                  isLoading={false}
                  isDisabled={false}
                >
                  {t("common.save")}
                </Button>
                <Button
                  variant="link"
                  ouiaId="cancel"
                  onClick={(): void => setIsEditing(false)}
                  isDisabled={false}
                >
                  {t("common.cancel")}
                </Button>
              </ActionGroup>
            </Form>
          ) : (
            <ErrorHandlingDetail
              errorHandlingType={errorHandlingType}
              errorHandlingParameters={errorHandlingParameters}
              isBridgeLoading={isBridgeLoading}
              isSchemaLoading={isSchemaLoading}
              schema={schema}
              schemaError={schemaError}
            />
          )}
        </StackItem>
      </Stack>
    </PageSection>
  );
};
