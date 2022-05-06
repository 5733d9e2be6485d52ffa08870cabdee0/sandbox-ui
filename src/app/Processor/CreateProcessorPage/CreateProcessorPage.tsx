import React, { useCallback, useEffect, useState } from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { useAddProcessorToBridgeApi } from "../../../hooks/useProcessorsApi/useAddProcessorToBridgeApi";
import { ProcessorRequest } from "@openapi/generated";
import { ResponseError } from "../../../types/Error";
import ProcessorEditSkeleton from "@app/Processor/ProcessorEdit/ProcessorEditSkeleton";

const CreateProcessorPage = (): JSX.Element => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const [existingProcessorName, setExistingProcessorName] = useState<
    string | undefined
  >();
  const [requestData, setRequestData] = useState<ProcessorRequest>();
  const history = useHistory();
  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [instanceId, history]
  );
  const goToHome = useCallback((): void => history.push(`/`), [history]);
  const { t } = useTranslation(["openbridgeTempDictionary"]);

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
    if (bridgeError) {
      goToHome();
    }
  }, [bridgeError, goToHome]);

  const {
    addProcessorToBridge,
    isLoading: isAddLoading,
    processor: addedProcessor,
    error: processorError,
  } = useAddProcessorToBridgeApi();

  const handleSave = (requestData: ProcessorRequest): void => {
    setRequestData(requestData);
    addProcessorToBridge(instanceId, requestData);
  };

  useEffect(() => {
    if (addedProcessor) {
      goToInstance();
    }
  }, [addedProcessor, goToInstance]);

  useEffect(() => {
    if (processorError && axios.isAxiosError(processorError)) {
      if (
        (processorError.response?.data as ResponseError).code === "OPENBRIDGE-1"
      ) {
        setExistingProcessorName(requestData?.name);
      }
    }
  }, [processorError, requestData]);

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
              <Text component="h1">{t("processor.createProcessor")}</Text>
            </TextContent>
          </PageSection>
          <ProcessorEdit
            onSave={handleSave}
            onCancel={goToInstance}
            isLoading={isAddLoading}
            existingProcessorName={existingProcessorName}
          />
        </>
      )}
    </>
  );
};

type InstanceRouteParams = {
  instanceId: string;
};

export default CreateProcessorPage;
