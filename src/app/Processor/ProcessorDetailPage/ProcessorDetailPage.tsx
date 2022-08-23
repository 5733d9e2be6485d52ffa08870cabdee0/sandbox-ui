import React, { useCallback, useEffect, useRef, useState } from "react";
import isEqual from "lodash.isequal";
import isEqualWith from "lodash.isequalwith";
import { useHistory, useParams } from "react-router-dom";
import {
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
import { useTranslation } from "react-i18next";
import ProcessorDetail from "@app/Processor/ProcessorDetail/ProcessorDetail";
import { CaretDownIcon } from "@patternfly/react-icons";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import { useGetProcessorApi } from "../../../hooks/useProcessorsApi/useGetProcessorApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { Processor } from "../../../types/Processor";
import ProcessorDetailSkeleton from "@app/Processor/ProcessorDetail/ProcessorDetailSkeleton";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";
import { useUpdateProcessorApi } from "../../../hooks/useProcessorsApi/useUpdateProcessorApi";
import {
  ManagedResourceStatus,
  ProcessorRequest,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import axios from "axios";
import { ErrorWithDetail } from "../../../types/Error";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import { canDeleteResource } from "@utils/resourceUtils";
import { useGetSchemasApi } from "../../../hooks/useSchemasApi/useGetSchemasApi";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import {
  getErrorCode,
  getErrorReason,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ActionModal } from "@app/components/ActionModal/ActionModal";

const ProcessorDetailPage = (): JSX.Element => {
  const { instanceId, processorId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [history, instanceId]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [currentProcessor, setCurrentProcessor] = useState<ProcessorResponse>();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
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

  const {
    updateProcessor,
    processor: updatedProcessor,
    isLoading: updateProcessorLoading,
    error: updateProcessorError,
  } = useUpdateProcessorApi();

  const {
    schemas,
    isLoading: areSchemasLoading,
    error: schemasError,
  } = useGetSchemasApi();

  const { getSchema, error: schemaError } = useGetSchemaApi();

  useEffect(() => {
    setCurrentProcessor(processor);
  }, [processor]);

  useEffect(() => {
    setCurrentProcessor(updatedProcessor);
    setIsEditing(false);
  }, [updatedProcessor]);

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
        getErrorCode(processorError) === APIErrorCodes.ERROR_4
      ) {
        /* When the instance is not found on the server, we are going to replace
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

  useEffect(() => {
    if (schemasError && axios.isAxiosError(schemasError)) {
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
  }, [processor?.name, schemasError, t]);

  useEffect(() => {
    if (updateProcessorError && axios.isAxiosError(updateProcessorError)) {
      if (
        isServiceApiError(updateProcessorError) &&
        getErrorCode(updateProcessorError) === APIErrorCodes.ERROR_1
      ) {
        setExistingProcessorName(requestData?.name);
      } else if (
        isServiceApiError(updateProcessorError) &&
        getErrorCode(updateProcessorError) === APIErrorCodes.ERROR_19
      ) {
        setShowActionModal(true);
        actionModalFn.current = (): void => {
          setShowActionModal(false);
          goToInstance();
        };
        actionModalMessage.current = t(
          "processor.errors.cantUpdateProcessorBecauseNotReadyState"
        );
      } else if (
        isServiceApiError(updateProcessorError) &&
        getErrorCode(updateProcessorError) === APIErrorCodes.ERROR_22
      ) {
        setMalformedTemplate(
          getErrorReason(updateProcessorError) ??
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
  }, [goToInstance, requestData?.name, t, updateProcessorError]);

  const processorNotChanged = useCallback(
    (prevDef: ProcessorResponse, updatedDef: ProcessorRequest): boolean =>
      isEqualWith(
        prevDef,
        updatedDef,
        (prev: ProcessorResponse, next: ProcessorRequest) =>
          isEqual(prev.name, next.name) &&
          isEqual(prev.filters, next.filters) &&
          isEqual(prev.transformationTemplate, next.transformationTemplate) &&
          isEqual(prev.action, next.action) &&
          isEqual(prev.source, next.source)
      ),
    []
  );

  const handleUpdateProcessorSaving = useCallback(
    (processorRequest: ProcessorRequest) => {
      if (
        currentProcessor &&
        processorNotChanged(currentProcessor, processorRequest)
      ) {
        setIsEditing(false);
        return;
      }
      setRequestData(processorRequest);
      updateProcessor(instanceId, processorId, processorRequest);
    },
    [
      currentProcessor,
      instanceId,
      processorId,
      processorNotChanged,
      updateProcessor,
    ]
  );

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
      {(isBridgeLoading || isProcessorLoading || areSchemasLoading) && (
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
      {bridge && currentProcessor && schemas && (
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
                    <StatusLabel status={currentProcessor.status ?? ""} />
                  </StackItem>
                </Stack>
              </SplitItem>
              {!isEditing && (
                <SplitItem>
                  <Split hasGutter={true}>
                    <SplitItem>
                      <Button
                        isAriaDisabled={
                          currentProcessor.status !==
                            ManagedResourceStatus.Ready ||
                          schemaError !== undefined
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
          {isEditing ? (
            <ProcessorEdit
              processor={currentProcessor}
              isLoading={updateProcessorLoading}
              saveButtonLabel={t("common.save")}
              onSave={handleUpdateProcessorSaving}
              onCancel={(): void => {
                setMalformedTemplate(undefined);
                setIsEditing(false);
              }}
              existingProcessorName={existingProcessorName}
              malformedTransformationTemplate={malformedTemplate}
              schemaCatalog={schemas}
              getSchema={getSchema}
            />
          ) : (
            <>
              <ProcessorDetail
                processor={currentProcessor as unknown as Processor}
                schemaCatalog={schemas}
                getSchema={getSchema}
              />
              <DeleteProcessor
                showDeleteModal={showProcessorDeleteModal}
                bridgeId={bridge.id}
                processorId={currentProcessor.id}
                processorName={currentProcessor.name as string}
                onDeleted={handleOnDeleteProcessorSuccess}
                onCanceled={(): void => setShowProcessorDeleteModal(false)}
              />
            </>
          )}
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
