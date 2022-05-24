import React, { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import isEqualWith from "lodash.isequalwith";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  Label,
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
} from "@openapi/generated";

const ProcessorDetailPage = (): JSX.Element => {
  const { instanceId, processorId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [history, instanceId]
  );
  const goToHome = useCallback((): void => history.push(`/`), [history]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProcessor, setCurrentProcessor] = useState<ProcessorResponse>();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsToggle = (isOpen: boolean): void => {
    setIsActionsOpen(isOpen);
  };
  const actionsSelect = (): void => {
    setIsActionsOpen(!isActionsOpen);
  };
  const actionItems = [
    <DropdownItem
      key="delete"
      component="button"
      onClick={(): void => goToInstance()}
    >
      {t("processor.delete")}
    </DropdownItem>,
  ];

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

  useEffect(() => {
    setCurrentProcessor(processor);
  }, [processor]);

  useEffect(() => {
    setCurrentProcessor(updatedProcessor);
    setIsEditing(false);
  }, [updatedProcessor]);

  useEffect(() => {
    if (bridgeError) {
      console.error(bridgeError);
      goToHome();
    }
    if (processorError) {
      console.error(processorError);
      goToInstance();
    }
    if (updateProcessorError) {
      console.error(updateProcessorError);
    }
  }, [
    bridgeError,
    processorError,
    goToHome,
    goToInstance,
    updateProcessorError,
  ]);

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

  const getProcessorTypeSection = useCallback(
    (processor: ProcessorResponse) => (
      <Stack>
        <StackItem>
          <FormGroup
            label={t("processor.processorType")}
            fieldId={"processor-type"}
          />
        </StackItem>
        <StackItem>
          <Label color={"blue"} data-testid="processor-type-label">
            {processor.type && t(`processor.${processor.type}`)}
          </Label>
        </StackItem>
      </Stack>
    ),
    [t]
  );

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
                      <Text component="h1">{currentProcessor.name}</Text>
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
                          ManagedResourceStatus.Ready
                        }
                        onClick={(): void => setIsEditing(true)}
                      >
                        {t("common.edit")}
                      </Button>
                    </SplitItem>
                    <SplitItem>
                      <Dropdown
                        onSelect={actionsSelect}
                        alignments={{ sm: "right" }}
                        toggle={
                          <DropdownToggle
                            id="toggle-id"
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
              processorTypeSection={getProcessorTypeSection(currentProcessor)}
              processor={currentProcessor}
              isLoading={updateProcessorLoading}
              saveButtonLabel={t("common.save")}
              onSave={handleUpdateProcessorSaving}
              onCancel={(): void => setIsEditing(false)}
            />
          ) : (
            <ProcessorDetail
              processor={currentProcessor as unknown as Processor}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProcessorDetailPage;

type ProcessorRouteParams = {
  instanceId: string;
  processorId: string;
};
