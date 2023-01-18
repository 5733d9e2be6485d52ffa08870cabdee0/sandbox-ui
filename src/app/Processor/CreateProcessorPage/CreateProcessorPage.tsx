import React, { useEffect } from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "@rhoas/app-services-ui-components";
import axios from "axios";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { ErrorWithDetail } from "../../../types/Error";
import ProcessorEditSkeleton from "@app/Processor/ProcessorEdit/ProcessorEditSkeleton";

import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";

const CreateProcessorPage = (): JSX.Element => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const history = useHistory();
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const {
    getBridge,
    bridge,
    isLoading: isBridgeLoading,
    error: bridgeError,
  } = useGetBridgeApi();

  useEffect(() => {
    getBridge(instanceId);
  }, [getBridge, instanceId]);

  useEffect(() => {
    if (bridgeError && axios.isAxiosError(bridgeError)) {
      if (
        isServiceApiError(bridgeError) &&
        getErrorCode(bridgeError) === APIErrorCodes.ERROR_5
      ) {
        /* When the instance is not found on the server, we are going to replace
         * the current URL with a fake URL that does not match any route.
         * In this way, the PageNotFound component will be shown.
         */
        history.replace("/processor-instance-not-found", {
          title: t("instance.notFound"),
          message: t("processor.errors.cantFindInstance"),
        });
      } else {
        throw new ErrorWithDetail(
          (
            <TextContent>
              <Text component="h1">{t("common.processor")}</Text>
            </TextContent>
          ),
          t("processor.errors.instanceDetailsGenericError")
        );
      }
    }
  }, [bridgeError, history, t]);

  return (
    <>
      {isBridgeLoading && (
        <>
          <PageHeaderSkeleton
            pageTitle={t("instance.processor.loadingProcessor")}
            hasActionDropdown={false}
            hasLabel={false}
          />
          <ProcessorEditSkeleton />
        </>
      )}
      {bridge && (
        <>
          <PageSection type="breadcrumb">
            <Breadcrumb
              path={[
                { label: t("instance.smartEventInstances"), linkTo: "/" },
                { label: bridge.name ?? "", linkTo: `/instance/${instanceId}` },
                { label: t("processor.createProcessor") },
              ]}
            />
          </PageSection>
          <PageSection
            variant={PageSectionVariants.light}
            hasShadowBottom={true}
          >
            <TextContent>
              <Text component="h1" ouiaId="page-name">
                {t("processor.createProcessor")}
              </Text>
            </TextContent>
          </PageSection>
          <ProcessorEdit />
        </>
      )}
    </>
  );
};

type InstanceRouteParams = {
  instanceId: string;
};

export default CreateProcessorPage;
