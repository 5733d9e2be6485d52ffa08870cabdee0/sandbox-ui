import React, {
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from "react";

import { useMachine } from "@xstate/react";
import CloudProvidersMachine from "@app/Instance/CreateInstance/machines/cloudProvidersMachine";
import {
  Flex,
  FlexItem,
  FormGroup,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
  Skeleton,
  Tile,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { AwsIcon } from "@patternfly/react-icons";
import { CreateInstanceError } from "@app/Instance/CreateInstance/types";
import { CreateInstanceProps } from "@app/Instance/CreateInstance/CreateInstance";
import "./CloudProviders.css";

interface CloudProvidersProps {
  /** Callback to retrieve providers and regions */
  getCloudProviders: CreateInstanceProps["getCloudProviders"];
  /** Callback to update the selected provider in the parent machine */
  onChange: (
    providerId: string | undefined,
    regionId: string | undefined
  ) => void;
  /** Callback to notify about errors while retrieving providers */
  onProviderError: (error: CreateInstanceError) => void;
  /** Flag to disable the form */
  isDisabled: boolean;
}

const CloudProviders: VoidFunctionComponent<CloudProvidersProps> = (props) => {
  const { getCloudProviders, onChange, onProviderError, isDisabled } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const [current, send] = useMachine(CloudProvidersMachine, {
    services: {
      fetchCloudProviders: () => getCloudProviders(),
    },
    actions: {
      notifyProviderUnavailable: () => onProviderError("region-unavailable"),
    },
    devTools: true,
  });
  const isLoading = current.matches("fetching providers");
  const { cloudProviders, selectedCloudProvider, selectedCloudRegion } =
    current.context;

  useEffect(() => {
    onChange(selectedCloudProvider, selectedCloudRegion);
  }, [selectedCloudRegion, selectedCloudProvider, onChange]);

  const handleCloudProviderClick = (id?: string): void => {
    if (id && id !== selectedCloudProvider) {
      send({
        type: "providerChange",
        providerId: id,
      });
    }
  };

  const [isCloudRegionSelectOpen, setIsCloudRegionsSelectOpen] =
    useState(false);

  const toggleCloudRegionSelect = (): void => {
    setIsCloudRegionsSelectOpen((prev) => !prev);
  };

  const handleCloudRegionSelect: SelectProps["onSelect"] = (
    _e,
    value
  ): void => {
    if (value && value !== selectedCloudRegion) {
      send({
        type: "regionChange",
        regionId: value as string,
      });
    }
    setIsCloudRegionsSelectOpen(false);
  };

  const cloudRegionsOptions = useMemo(() => {
    if (isLoading || !selectedCloudProvider) {
      return [
        <SelectOption
          key="placeholder"
          isPlaceholder={true}
          value={t("instance.selectRegion")}
          isDisabled={true}
          isSelected={true}
        />,
      ];
    }
    if (selectedCloudProvider) {
      const provider = cloudProviders.find(
        (provider) => provider.id === selectedCloudProvider
      );
      return provider?.regions.map((region) => (
        <SelectOption
          isDisabled={!region.enabled}
          key={region.name}
          value={region.name}
        >
          {region.display_name}
        </SelectOption>
      ));
    }
    return [];
  }, [isLoading, selectedCloudProvider, cloudProviders, t]);

  return (
    <>
      <FormGroup
        label={t("instance.cloudProvider")}
        isRequired
        fieldId="cloud-provider"
      >
        <Flex
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          spacer={{ default: "spacerNone" }}
          spaceItems={{ default: "spaceItemsXs" }}
        >
          {!isLoading && (
            <>
              {cloudProviders.map((provider) => (
                <FlexItem grow={{ default: "grow" }} key={provider.id}>
                  <Tile
                    className={"pf-u-w-100"}
                    title={provider.display_name ?? ""}
                    key={provider.id}
                    icon={getTileIcon(provider.id)}
                    isSelected={provider.id === selectedCloudProvider}
                    style={{ height: "100%" }}
                    onClick={(): void => {
                      handleCloudProviderClick(provider.id);
                    }}
                    isDisabled={isDisabled}
                  />
                </FlexItem>
              ))}
              {cloudProviders.length === 0 && (
                <FlexItem grow={{ default: "grow" }} key={0}>
                  <Tile
                    className={"pf-u-w-100"}
                    title={t("common.temporaryUnavailable")}
                    key={0}
                    style={{ height: "100%" }}
                    isDisabled={isDisabled}
                  />
                </FlexItem>
              )}
            </>
          )}
          {isLoading && <CloudProviderSkeleton />}
        </Flex>
      </FormGroup>

      <FormGroup
        label={t("instance.cloudRegion")}
        isRequired
        fieldId="cloud-region"
      >
        <Select
          id="cloud-region"
          toggleId="cloud-region"
          name="cloud-region"
          ouiaId="cloud-region"
          variant={SelectVariant.single}
          onToggle={toggleCloudRegionSelect}
          onSelect={handleCloudRegionSelect}
          selections={selectedCloudRegion}
          isOpen={isCloudRegionSelectOpen}
          aria-describedby={"cloud-region"}
          menuAppendTo={"parent"}
          isDisabled={isDisabled || !selectedCloudProvider}
        >
          {cloudRegionsOptions}
        </Select>
      </FormGroup>
    </>
  );
};

export default CloudProviders;

export const CloudProviderSkeleton = (): JSX.Element => {
  const { t } = useTranslation("openbridgeTempDictionary");

  return (
    <FlexItem grow={{ default: "grow" }} key={"skeleton"}>
      <div className="cloud-provider__skeleton">
        <Skeleton
          height="100%"
          width="100%"
          screenreaderText={t("instance.loadingCloudProviders")}
          data-ouia-component-id="cloud-provider"
          data-ouia-component-type="skeleton"
        />
      </div>
    </FlexItem>
  );
};

const getTileIcon = (id?: string): JSX.Element => {
  let icon;
  switch (id) {
    case "aws":
      icon = (
        <AwsIcon size="lg" color="black" className="cloud-provider__icon" />
      );
      break;
    default:
      icon = <></>;
  }
  return icon;
};
