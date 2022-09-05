import {
  Alert,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import {
  ERROR_HANDLING_METHODS,
  getErrorHandlingMethodByType,
} from "../../../types/ErrorHandlingMethods";
import ProcessorConfigParameters from "@app/Processor/ProcessorConfigParameters/ProcessorConfigParameters";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../types/Processor";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";

interface ErrorHandlingTabContentProps {
  errorHandlingType?: string;
  errorHandlingParameters?: { [p: string]: unknown };
  isBridgeLoading: boolean;
}

export const ErrorHandlingTabContent = ({
  errorHandlingType,
  errorHandlingParameters,
  isBridgeLoading,
}: ErrorHandlingTabContentProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [schema, setSchema] = useState<object>();
  const [schemaError, setSchemaError] = useState<string | undefined>();
  const [schemaLoading, setSchemaLoading] = useState(false);

  const { getSchema } = useGetSchemaApi();

  useEffect(() => {
    if (errorHandlingType) {
      setSchemaLoading(true);
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
        .finally(() => setSchemaLoading(false));
    }
  }, [errorHandlingType, getSchema, t]);

  const errorHandlingParametersSkeleton = useMemo(() => {
    const parametersLength = errorHandlingParameters
      ? Object.keys(errorHandlingParameters).length
      : 1;
    return (
      <DescriptionListGroup key="error-handling-loading-skeletons">
        {[...(Array(parametersLength) as unknown[])].map((_, index) => (
          <React.Fragment key={index}>
            <DescriptionListTerm>
              <Skeleton fontSize="2xl" width={"60px"} />
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Skeleton fontSize="2xl" width={"100px"} />
            </DescriptionListDescription>
          </React.Fragment>
        ))}
      </DescriptionListGroup>
    );
  }, [errorHandlingParameters]);

  const errorHandlingMethodLabel = useMemo(() => {
    if (errorHandlingType) {
      return getErrorHandlingMethodByType(errorHandlingType).label;
    }
    if (isBridgeLoading) {
      return <Skeleton fontSize="2xl" width={"60px"} />;
    }
    return ERROR_HANDLING_METHODS.default.label;
  }, [errorHandlingType, isBridgeLoading]);

  return (
    <PageSection
      className="instance-page__tabs-error-handling__section"
      variant={PageSectionVariants.light}
      isFilled
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.h2} ouiaId="error-handling-section">
              {t("common.errorHandlingMethod")}
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <DescriptionList>
            <DescriptionListGroup key="error-handling-method">
              <DescriptionListTerm>
                {t("common.errorHandlingMethod")}
              </DescriptionListTerm>
              <DescriptionListDescription>
                {errorHandlingMethodLabel}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {errorHandlingParameters &&
              schema &&
              !schemaLoading &&
              !schemaError && (
                <ProcessorConfigParameters
                  schema={schema}
                  parameters={errorHandlingParameters}
                />
              )}
            {schemaLoading && errorHandlingParametersSkeleton}
            {schemaError && (
              <Alert
                className="instance-page__tabs-error-handling__alert"
                ouiaId="error-schema"
                variant="danger"
                title={schemaError}
                aria-live="polite"
                isInline
              />
            )}
          </DescriptionList>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
