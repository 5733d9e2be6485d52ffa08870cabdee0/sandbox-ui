import {
  Alert,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import React, { useMemo } from "react";
import { useTranslation } from "@rhoas/app-services-ui-components";
import {
  ERROR_HANDLING_METHODS,
  getErrorHandlingMethodByType,
} from "../../../types/ErrorHandlingMethods";
import ConfigParameters from "@app/components/ConfigParameters/ConfigParameters";

export interface ErrorHandlingDetailProps {
  errorHandlingType?: string;
  errorHandlingParameters?: object;
  isBridgeLoading: boolean;
  schema?: object;
  isSchemaLoading: boolean;
  apiError?: string;
  onEdit: () => void;
  isEditDisabled: boolean;
}

export const ErrorHandlingDetail = ({
  errorHandlingType,
  isBridgeLoading,
  errorHandlingParameters,
  schema,
  isSchemaLoading,
  apiError,
  onEdit,
  isEditDisabled,
}: ErrorHandlingDetailProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const errorHandlingMethodLabel = useMemo(() => {
    if (errorHandlingType) {
      return getErrorHandlingMethodByType(errorHandlingType).label;
    }
    if (isBridgeLoading) {
      return <Skeleton fontSize="2xl" width={"60px"} />;
    }
    return ERROR_HANDLING_METHODS.default.label;
  }, [errorHandlingType, isBridgeLoading]);

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

  return (
    <PageSection
      variant={PageSectionVariants.light}
      isFilled
      className={"pf-u-h-100"}
    >
      <Stack hasGutter>
        <StackItem>
          <Split hasGutter>
            <SplitItem isFilled>
              <TextContent>
                <Text
                  component={TextVariants.h3}
                  ouiaId="error-handling-section"
                >
                  {t("common.errorHandlingMethod")}
                </Text>
              </TextContent>
            </SplitItem>
            <SplitItem>
              <Button
                isAriaDisabled={isEditDisabled}
                ouiaId="edit"
                onClick={onEdit}
              >
                {t("common.edit")}
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
        <StackItem>
          <DescriptionList>
            <DescriptionListGroup
              data-ouia-component-type="ProcessorConfig/FormGroup"
              data-ouia-component-id="error_handling_method"
              key="error-handling-method"
            >
              <DescriptionListTerm data-testid="error_handling_method">
                {t("common.errorHandlingMethod")}
              </DescriptionListTerm>
              <DescriptionListDescription data-testid="error_handling_method-value">
                {errorHandlingMethodLabel}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {errorHandlingParameters &&
              schema &&
              !isSchemaLoading &&
              !apiError && (
                <ConfigParameters
                  schema={schema}
                  parameters={
                    errorHandlingParameters as { [key: string]: unknown }
                  }
                />
              )}
            {isSchemaLoading && errorHandlingParametersSkeleton}
            {apiError && (
              <Alert
                className="instance-page__tabs-error-handling__alert"
                ouiaId="error-schema"
                variant="danger"
                title={apiError}
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
