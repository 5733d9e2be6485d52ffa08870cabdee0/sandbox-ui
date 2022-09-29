import React, { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  DrawerColorVariant,
  DrawerContent,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPosition,
  DropdownSeparator,
  DropdownToggle,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { CaretDownIcon } from "@patternfly/react-icons";
import "./InstancePage.css";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { BridgeResponse } from "@rhoas/smart-events-management-sdk";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";
import { canDeleteResource } from "@utils/resourceUtils";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import axios from "axios";
import { ErrorWithDetail } from "../../../types/Error";
import { ProcessorsTabContent } from "@app/Instance/InstancePage/ProcessorsTabContent";
import { ErrorHandlingTabContent } from "@app/Instance/InstancePage/ErrorHandlingTabContent";

const INSTANCE_PAGE_TAB_KEYS = {
  processors: 0,
  "error-handling": 1,
};

export interface InstanceRouteParams {
  instanceId: string;
  tabName?: keyof typeof INSTANCE_PAGE_TAB_KEYS;
}

const InstancePage = (): JSX.Element => {
  const { instanceId, tabName = "processors" } =
    useParams<InstanceRouteParams>();
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const history = useHistory();

  const {
    getBridge,
    bridge,
    isLoading: isBridgeLoading,
    error: bridgeError,
  } = useGetBridgeApi();

  const [activeTabKey, setActiveTabKey] = useState<number | string>(
    INSTANCE_PAGE_TAB_KEYS[tabName]
  );
  const [isDropdownActionOpen, setIsDropdownActionOpen] =
    useState<boolean>(false);
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);
  const [currentBridge, setCurrentBridge] = useState<
    BridgeResponse | undefined
  >(bridge);

  useEffect(() => {
    setActiveTabKey(INSTANCE_PAGE_TAB_KEYS[tabName]);
  }, [tabName]);

  useEffect(() => {
    getBridge(instanceId);
  }, [getBridge, instanceId]);

  useEffect(() => {
    setCurrentBridge(bridge);
  }, [bridge]);

  const getPageTitle = useCallback(
    (bridge?: BridgeResponse) => {
      const name = bridge ? bridge.name : t("instance.smartEventInstance");
      return (
        <TextContent>
          <Text ouiaId="instance-name" component="h1">
            {name}
          </Text>
        </TextContent>
      );
    },
    [t]
  );

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
        history.replace("/instance-not-found", {
          title: t("instance.notFound"),
          message: t("instance.errors.cantFindInstance"),
        });
      } else {
        throw new ErrorWithDetail(
          getPageTitle(),
          t("instance.errors.instanceDetailsGenericError")
        );
      }
    }
  }, [bridgeError, getPageTitle, history, t]);

  const handleTabClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    tabNumber: number | string
  ): void => {
    setActiveTabKey(tabNumber);

    const selectedTabName =
      Object.keys(INSTANCE_PAGE_TAB_KEYS).find(
        (tabName) =>
          (INSTANCE_PAGE_TAB_KEYS as { [tabName: string]: number })[tabName] ===
          (tabNumber as number)
      ) ?? "";
    history.push(`/instance/${instanceId}/${selectedTabName}`);
  };

  const [showInstanceDeleteModal, setShowInstanceDeleteModal] = useState(false);

  const deleteInstance = (): void => {
    setShowInstanceDeleteModal(true);
  };

  const handleOnDeleteInstanceSuccess = useCallback((): void => {
    setShowInstanceDeleteModal(false);
    history.push(`/`);
  }, [history]);

  const onErrorHandlingUpdate = useCallback((updatedBridge: BridgeResponse) => {
    setCurrentBridge(updatedBridge);
  }, []);

  return (
    <Drawer isExpanded={showInstanceDrawer}>
      <DrawerContent
        colorVariant={DrawerColorVariant.light200}
        data-ouia-component-id="instance-drawer"
        panelContent={
          currentBridge && (
            <InstanceDetails
              onClosingDetails={(): void => setShowInstanceDrawer(false)}
              instance={currentBridge}
            />
          )
        }
      >
        {isBridgeLoading && (
          <PageHeaderSkeleton
            pageTitle={t("instance.loadingInstance")}
            hasActionDropdown={true}
            hasLabel={false}
            noShadowBottom
          />
        )}
        {currentBridge && (
          <>
            <PageSection variant={PageSectionVariants.light} type="breadcrumb">
              <Breadcrumb
                path={[
                  { label: t("instance.smartEventInstances"), linkTo: "/" },
                  { label: currentBridge.name ?? "" },
                ]}
              />
            </PageSection>
            <PageSection variant={PageSectionVariants.light}>
              <Split>
                <SplitItem isFilled>
                  <TextContent>
                    <Text ouiaId="instance-name" component="h1">
                      {currentBridge.name}
                    </Text>
                  </TextContent>
                </SplitItem>
                <SplitItem>
                  <Dropdown
                    className="instance-page__actions"
                    ouiaId="actions"
                    onSelect={(): void => setIsDropdownActionOpen(false)}
                    position={DropdownPosition.right}
                    toggle={
                      <DropdownToggle
                        ouiaId="actions"
                        onToggle={(isOpen: boolean): void =>
                          setIsDropdownActionOpen(isOpen)
                        }
                        toggleIndicator={CaretDownIcon}
                      >
                        {t("common.actions")}
                      </DropdownToggle>
                    }
                    isOpen={isDropdownActionOpen}
                    dropdownItems={[
                      <DropdownGroup
                        key="details-group"
                        label={t("instance.viewInformation")}
                      >
                        <DropdownItem
                          key="details"
                          ouiaId="details"
                          onClick={(): void => {
                            setShowInstanceDrawer(true);
                          }}
                        >
                          {t("common.details")}
                        </DropdownItem>
                      </DropdownGroup>,
                      <DropdownSeparator key="separator" />,
                      <DropdownItem
                        key="delete"
                        ouiaId="delete"
                        onClick={deleteInstance}
                        isDisabled={!canDeleteResource(currentBridge.status)}
                      >
                        {t("instance.delete")}
                      </DropdownItem>,
                    ]}
                  />
                </SplitItem>
              </Split>
            </PageSection>
          </>
        )}
        <PageSection variant={PageSectionVariants.light} type="tabs">
          <Tabs
            mountOnEnter
            unmountOnExit
            className="instance-page__tabs"
            ouiaId="instance-details"
            usePageInsets
            activeKey={activeTabKey}
            onSelect={handleTabClick}
          >
            <Tab
              eventKey={INSTANCE_PAGE_TAB_KEYS.processors}
              ouiaId="processors"
              tabContentId="instance-page__tabs-processors"
              title={
                isBridgeLoading ? (
                  <Skeleton fontSize="xl" width={"100px"} />
                ) : (
                  <TabTitleText>{t("common.processors")}</TabTitleText>
                )
              }
            >
              <PageSection>
                <ProcessorsTabContent
                  instanceId={instanceId}
                  pageTitle={getPageTitle(currentBridge)}
                />
              </PageSection>
            </Tab>
            <Tab
              eventKey={INSTANCE_PAGE_TAB_KEYS["error-handling"]}
              ouiaId="error-handling"
              tabContentId="instance-page__tabs-error-handling"
              title={
                isBridgeLoading ? (
                  <Skeleton fontSize="xl" width={"100px"} />
                ) : (
                  <TabTitleText>{t("common.errorHandling")}</TabTitleText>
                )
              }
            >
              <PageSection>
                <ErrorHandlingTabContent
                  bridge={currentBridge}
                  isBridgeLoading={isBridgeLoading}
                  onErrorHandlingUpdate={onErrorHandlingUpdate}
                />
              </PageSection>
            </Tab>
          </Tabs>
        </PageSection>
        <DeleteInstance
          instanceId={currentBridge?.id}
          instanceName={currentBridge?.name}
          showDeleteModal={showInstanceDeleteModal}
          onCanceled={(): void => setShowInstanceDeleteModal(false)}
          onDeleted={handleOnDeleteInstanceSuccess}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default InstancePage;
