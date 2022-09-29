import {
  Alert,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Skeleton,
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
}

export const ErrorHandlingDetail = ({
  errorHandlingType,
  isBridgeLoading,
  errorHandlingParameters,
  schema,
  isSchemaLoading,
  apiError,
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
    <DescriptionList>
      <DescriptionListGroup key="error-handling-method">
        <DescriptionListTerm>
          {t("common.errorHandlingMethod")}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {errorHandlingMethodLabel}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {errorHandlingParameters && schema && !isSchemaLoading && !apiError && (
        <ConfigParameters
          schema={schema}
          parameters={errorHandlingParameters as { [key: string]: unknown }}
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
  );
};
