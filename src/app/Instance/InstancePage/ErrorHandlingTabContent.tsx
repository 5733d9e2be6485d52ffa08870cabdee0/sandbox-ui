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
import { getErrorHandlingMethodByType } from "../../../types/ErrorHandlingMethods";
import ProcessorDetailConfigParameters from "@app/Processor/ProcessorDetail/ProcessorDetailConfigParameters";
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
}

export const ErrorHandlingTabContent = ({
  errorHandlingType,
  errorHandlingParameters,
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
    return [...(Array(parametersLength) as unknown[])].map(() => (
      <DescriptionListGroup key="error-handling-loading-skeletons">
        <DescriptionListTerm>
          <Skeleton fontSize="2xl" width={"60px"} />
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Skeleton fontSize="2xl" width={"100px"} />
        </DescriptionListDescription>
      </DescriptionListGroup>
    ));
  }, [errorHandlingParameters]);

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
                {errorHandlingType ? (
                  getErrorHandlingMethodByType(errorHandlingType).label
                ) : (
                  <Skeleton fontSize="2xl" width={"60px"} />
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {errorHandlingParameters &&
              schema &&
              !schemaLoading &&
              !schemaError && (
                <ProcessorDetailConfigParameters
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
