import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { CaretDownIcon } from "@patternfly/react-icons";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import { useGetProcessorApi } from "../../../hooks/useProcessorsApi/useGetProcessorApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import ProcessorDetailSkeleton from "@app/Processor/ProcessorDetail/ProcessorDetailSkeleton";
import { ProcessorResponse } from "@rhoas/smart-events-management-sdk";
import axios from "axios";
import { ErrorWithDetail } from "../../../types/Error";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import { canDeleteResource, canEditResource } from "@utils/resourceUtils";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ActionModal } from "@app/components/ActionModal/ActionModal";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { usePolling } from "../../../hooks/usePolling/usePolling";

const ProcessorDetailPage = (): JSX.Element => {
  const { instanceId, processorId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [history, instanceId]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [processorRefreshInterval, setProcessorRefreshInterval] = useState(0);
  const [currentProcessor, setCurrentProcessor] = useState<ProcessorResponse>();
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const actionModalMessage = useRef<string>("");
  const actionModalFn = useRef<() => void>((): void =>
    setShowActionModal(false)
  );

  const actionsToggle = (isOpen: boolean): void => {
    setIsActionsOpen(isOpen);
  };
  const actionsSelect = (): void => {
    setIsActionsOpen(!isActionsOpen);
  };

  const {
    getBridge,
    bridge,
    isLoading: isBridgeLoading,
    error: bridgeError,
  } = useGetBridgeApi();

  useEffect(() => {
    getBridge(instanceId);
  }, [getBridge, instanceId]);

  const {
    getProcessor,
    processor,
    isLoading: isProcessorLoading,
    error: processorError,
  } = useGetProcessorApi();

  useEffect(() => {
    getProcessor(instanceId, processorId);
  }, [getProcessor, instanceId, processorId]);

  usePolling(
    () => getProcessor(instanceId, processorId),
    processorRefreshInterval
  );

  useEffect(() => {
    setCurrentProcessor(processor);
    if (processor && !canEditResource(processor?.status)) {
      setProcessorRefreshInterval(refreshInterval);
    } else {
      setProcessorRefreshInterval(0);
    }
  }, [processor]);

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
              <Text component="h1">
                {processor?.name ?? t("common.processor")}
              </Text>
            </TextContent>
          ),
          t("processor.errors.instanceDetailsGenericError")
        );
      }
    }
  }, [bridgeError, history, processor?.name, t]);

  useEffect(() => {
    if (processorError && axios.isAxiosError(processorError)) {
      if (
        isServiceApiError(processorError) &&
        getErrorCode(processorError) === APIErrorCodes.ERROR_5
      ) {
        /* When the processor is not found on the server, we are going to replace
         * the current URL with a fake URL that does not match any route.
         * In this way, the PageNotFound component will be shown.
         */
        history.replace("/processor-not-found", {
          title: t("processor.notFound"),
          message: t("processor.errors.cantFindProcessor"),
        });
      } else {
        throw new ErrorWithDetail(
          (
            <TextContent>
              <Text component="h1">
                {processor?.name ?? t("common.processor")}
              </Text>
            </TextContent>
          ),
          t("processor.errors.processorDetailsGenericError")
        );
      }
    }
  }, [history, processor?.name, processorError, t]);

  const [showProcessorDeleteModal, setShowProcessorDeleteModal] =
    useState(false);

  const deleteProcessor = (): void => {
    setShowProcessorDeleteModal(true);
  };

  const handleOnDeleteProcessorSuccess = useCallback((): void => {
    setShowProcessorDeleteModal(false);
    goToInstance();
  }, [goToInstance]);

  const actionItems = [
    <DropdownItem
      key="delete"
      ouiaId="delete"
      component="button"
      onClick={(): void => deleteProcessor()}
      isDisabled={
        !currentProcessor || !canDeleteResource(currentProcessor.status)
      }
    >
      {t("processor.delete")}
    </DropdownItem>,
  ];

  return (
    <>
      {(isBridgeLoading || isProcessorLoading) && (
        <>
          <PageHeaderSkeleton
            pageTitle={t("processor.loadingProcessor")}
            hasEditButton={true}
            hasActionDropdown={true}
            hasLabel={true}
          />
          <ProcessorDetailSkeleton />
        </>
      )}
      {bridge && currentProcessor && (
        <>
          <PageSection
            variant={PageSectionVariants.light}
            hasShadowBottom={true}
            type="breadcrumb"
          >
            <Breadcrumb
              path={[
                { label: t("instance.smartEventInstances"), linkTo: "/" },
                { label: bridge.name ?? "", linkTo: `/instance/${instanceId}` },
                { label: currentProcessor.name ?? "" },
              ]}
            />
          </PageSection>
          <PageSection
            variant={PageSectionVariants.light}
            hasShadowBottom={true}
          >
            <Split hasGutter={true}>
              <SplitItem isFilled={true}>
                <Stack hasGutter={true}>
                  <StackItem>
                    <TextContent>
                      <Text component="h1" ouiaId="processor-name">
                        {currentProcessor.name}
                      </Text>
                    </TextContent>
                  </StackItem>
                  <StackItem>
                    <SEStatusLabel
                      status={currentProcessor.status}
                      resourceType={"processor"}
                      requestedAt={
                        new Date(
                          currentProcessor.modified_at ??
                            currentProcessor.submitted_at
                        )
                      }
                    />
                  </StackItem>
                </Stack>
              </SplitItem>
              {!isEditing && (
                <SplitItem>
                  <Split hasGutter={true}>
                    <SplitItem>
                      <Button
                        isAriaDisabled={
                          !canEditResource(currentProcessor.status)
                        }
                        ouiaId="edit"
                        onClick={(): void => setIsEditing(true)}
                      >
                        {t("common.edit")}
                      </Button>
                    </SplitItem>
                    <SplitItem>
                      <Dropdown
                        ouiaId="processor-actions"
                        onSelect={actionsSelect}
                        alignments={{ sm: "right" }}
                        toggle={
                          <DropdownToggle
                            id="toggle-id"
                            ouiaId="actions-toggle"
                            onToggle={actionsToggle}
                            toggleIndicator={CaretDownIcon}
                          >
                            {t("common.actions")}
                          </DropdownToggle>
                        }
                        isOpen={isActionsOpen}
                        dropdownItems={actionItems}
                      />
                    </SplitItem>
                  </Split>
                </SplitItem>
              )}
            </Split>
          </PageSection>
          <PageSection variant={PageSectionVariants.light}>
            {isEditing ? (
              <Alert variant="default" isInline title="Processor Editing TBD" />
            ) : (
              <>
                <Alert
                  variant="default"
                  isInline
                  title="Processor Detail TBD"
                />
                <DeleteProcessor
                  showDeleteModal={showProcessorDeleteModal}
                  bridgeId={bridge.id}
                  processorId={currentProcessor.id}
                  processorName={currentProcessor.name}
                  onDeleted={handleOnDeleteProcessorSuccess}
                  onCanceled={(): void => setShowProcessorDeleteModal(false)}
                />
              </>
            )}
          </PageSection>
        </>
      )}
      <ActionModal
        action={actionModalFn.current}
        message={actionModalMessage.current}
        showDialog={showActionModal}
        title={t("processor.errors.cantUpdateProcessor")}
      />
    </>
  );
};

export default ProcessorDetailPage;

type ProcessorRouteParams = {
  instanceId: string;
  processorId: string;
};

const refreshInterval = 10000;
