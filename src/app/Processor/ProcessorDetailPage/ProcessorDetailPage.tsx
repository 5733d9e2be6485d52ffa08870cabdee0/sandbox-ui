import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
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
import { useAuth } from "@rhoas/app-services-ui-shared";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import { useGetProcessorApi } from "../../../hooks/useProcessorsApi/useGetProcessorApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { Processor } from "../../../types/Processor";
import ProcessorDetailSkeleton from "@app/Processor/ProcessorDetail/ProcessorDetailSkeleton";
import config from "../../../../config/config";

const ProcessorDetailPage = (): JSX.Element => {
  const { instanceId, processorId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const goToInstance = useCallback(
    (): void => history.push(`/instance/${instanceId}`),
    [history, instanceId]
  );
  const goToHome = useCallback((): void => history.push(`/`), [history]);

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
      {t("common.delete")}
    </DropdownItem>,
  ];

  const auth = useAuth();
  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const {
    getBridge,
    bridge,
    isLoading: isBridgeLoading,
    error: bridgeError,
  } = useGetBridgeApi(getToken, config.apiBasePath);

  useEffect(() => {
    void getBridge(instanceId);
  }, [getBridge, instanceId]);

  const {
    getProcessor,
    processor,
    isLoading: isProcessorLoading,
    error: processorError,
  } = useGetProcessorApi(getToken, config.apiBasePath);

  useEffect(() => {
    void getProcessor(instanceId, processorId);
  }, [getProcessor, instanceId, processorId]);

  useEffect(() => {
    if (bridgeError) {
      console.error(bridgeError);
      goToHome();
    }
    if (processorError) {
      console.error(processorError);
      goToInstance();
    }
  }, [bridgeError, processorError, goToHome, goToInstance]);

  return (
    <>
      {(isBridgeLoading || isProcessorLoading) && (
        <>
          <PageHeaderSkeleton
            pageTitle={t("instance.processor.loadingProcessor")}
            hasActionDropdown={true}
            hasLabel={true}
          />
          <ProcessorDetailSkeleton />
        </>
      )}
      {bridge && processor && (
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
                { label: processor.name ?? "" },
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
                      <Text component="h1">{processor.name}</Text>
                    </TextContent>
                  </StackItem>
                  <StackItem>
                    <StatusLabel status={processor.status ?? ""} />
                  </StackItem>
                </Stack>
              </SplitItem>
              <SplitItem>
                <Dropdown
                  onSelect={actionsSelect}
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
          </PageSection>
          <ProcessorDetail processor={processor as unknown as Processor} />
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
