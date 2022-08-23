import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { ProcessorRequest } from "@rhoas/smart-events-management-sdk";
import { ErrorWithDetail } from "../../../types/Error";
import ProcessorEditSkeleton from "@app/Processor/ProcessorEdit/ProcessorEditSkeleton";
import { useGetSchemasApi } from "../../../hooks/useSchemasApi/useGetSchemasApi";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import {
  getErrorCode,
  getErrorReason,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ActionModal } from "@app/components/ActionModal/ActionModal";

const CreateProcessorPage = (): JSX.Element => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const [existingProcessorName, setExistingProcessorName] = useState<
    string | undefined
  >();
  const [malformedTemplate, setMalformedTemplate] = useState<
    string | undefined
  >();
  const [requestData, setRequestData] = useState<ProcessorRequest>();

  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const actionModalMessage = useRef<string>("");
  const actionModalFn = useRef<() => void>((): void =>
    setShowActionModal(false)
  );
  const history = useHistory();
  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [instanceId, history]
  );
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
    if (bridgeError && axios.isAxiosError(bridgeError)) {
      if (
        isServiceApiError(bridgeError) &&
        getErrorCode(bridgeError) === APIErrorCodes.ERROR_4
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

  const {
    addProcessorToBridge,
    isLoading: isAddLoading,
    processor: addedProcessor,
    error: createProcessorError,
  } = useAddProcessorToBridgeApi();

  const {
    schemas,
    isLoading: areSchemasLoading,
    error: schemasError,
  } = useGetSchemasApi();
  const { getSchema } = useGetSchemaApi();

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
    if (createProcessorError && axios.isAxiosError(createProcessorError)) {
      if (
        isServiceApiError(createProcessorError) &&
        getErrorCode(createProcessorError) === APIErrorCodes.ERROR_1
      ) {
        setExistingProcessorName(requestData?.name);
      } else if (
        (isServiceApiError(createProcessorError) &&
          getErrorCode(createProcessorError) === APIErrorCodes.ERROR_2) ||
        getErrorCode(createProcessorError) === APIErrorCodes.ERROR_4
      ) {
        setShowActionModal(true);
        actionModalFn.current = (): void => {
          setShowActionModal(false);
          history.replace("/");
        };
        actionModalMessage.current = t(
          "processor.errors.cantCreateProcessorBecauseInstanceNotAvailable"
        );
      } else if (
        isServiceApiError(createProcessorError) &&
        getErrorCode(createProcessorError) === APIErrorCodes.ERROR_22
      ) {
        setMalformedTemplate(
          getErrorReason(createProcessorError) ??
            t("processor.errors.malformedTransformation")
        );
      } else {
        setShowActionModal(true);
        actionModalFn.current = (): void => {
          setShowActionModal(false);
        };
        actionModalMessage.current = t("common.tryAgainLater");
      }
    }
  }, [createProcessorError, history, requestData, t]);

  useEffect(() => {
    if (schemasError && axios.isAxiosError(schemasError)) {
      throw new ErrorWithDetail(
        (
          <TextContent>
            <Text component="h1">{t("common.processor")}</Text>
          </TextContent>
        ),
        t("processor.errors.processorDetailsGenericError")
      );
    }
  }, [schemasError, t]);

  return (
    <>
      {(isBridgeLoading || areSchemasLoading) && (
        <>
          <PageHeaderSkeleton
            pageTitle={t("instance.processor.loadingProcessor")}
            hasActionDropdown={false}
            hasLabel={false}
          />
          <ProcessorEditSkeleton />
        </>
      )}
      {bridge && schemas && (
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
          <ProcessorEdit
            saveButtonLabel={t("common.create")}
            onSave={handleSave}
            onCancel={goToInstance}
            isLoading={isAddLoading}
            existingProcessorName={existingProcessorName}
            malformedTransformationTemplate={malformedTemplate}
            schemaCatalog={schemas}
            getSchema={getSchema}
          />
        </>
      )}
      <ActionModal
        action={actionModalFn.current}
        message={actionModalMessage.current}
        showDialog={showActionModal}
        title={t("processor.errors.cantCreateProcessor")}
      />
    </>
  );
};

type InstanceRouteParams = {
  instanceId: string;
};

export default CreateProcessorPage;
