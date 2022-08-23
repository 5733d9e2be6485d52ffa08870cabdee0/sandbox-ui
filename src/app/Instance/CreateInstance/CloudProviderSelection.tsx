import React, { useEffect, useMemo, useState } from "react";
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
import {
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";
import { AwsIcon } from "@patternfly/react-icons";
import "./CloudProviderSelection.css";
import { useTranslation } from "react-i18next";

interface CloudProviderSelectionProps {
  cloudProviders: CloudProviderResponse[];
  cloudRegions: CloudRegionResponse[] | undefined;
  onCloudProviderChange: (providerId: string, regionId: string) => void;
  isDisabled: boolean;
}

const CloudProviderSelection = (
  props: CloudProviderSelectionProps
): JSX.Element => {
  const { cloudProviders, cloudRegions, onCloudProviderChange, isDisabled } =
    props;
  const [cloudProvider, setCloudProvider] = useState<string>();
  const [cloudRegion, setCloudRegion] = useState<string>();
  const [isCloudRegionSelectOpen, setIsCloudRegionsSelectOpen] =
    useState(false);
  const { t } = useTranslation("openbridgeTempDictionary");

  useEffect(() => {
    if (cloudProviders.length > 0) {
      const enabledProvider = cloudProviders.find(
        (provider) => provider.enabled
      );
      if (enabledProvider && enabledProvider.id) {
        setCloudProvider(enabledProvider.id);
        onCloudProviderChange(enabledProvider.id, cloudRegion ?? "");
      }
    }
  }, [cloudProviders, cloudRegion, onCloudProviderChange]);

  useEffect(() => {
    if (cloudProvider && cloudRegions && cloudRegions.length > 0) {
      const enabledRegion = cloudRegions.find((region) => region.enabled);
      if (enabledRegion && enabledRegion.name) {
        setCloudRegion(enabledRegion.name);
        onCloudProviderChange(cloudProvider, enabledRegion.name);
      }
    }
  }, [cloudRegions, cloudProvider, onCloudProviderChange]);

  const cloudRegionsOptions = useMemo(() => {
    if (isDisabled || !cloudRegions) {
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
    if (cloudRegions) {
      return cloudRegions.map((region) => (
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
  }, [cloudRegions, isDisabled, t]);

  const handleCloudProviderClick = (id?: string): void => {
    if (id && id !== cloudProvider) {
      setCloudProvider(id);
    }
  };

  const toggleCloudRegionSelect = (): void => {
    setIsCloudRegionsSelectOpen((prev) => !prev);
  };

  const handleCloudRegionSelect: SelectProps["onSelect"] = (
    _e,
    value
  ): void => {
    setCloudRegion(value as string);
    setIsCloudRegionsSelectOpen(false);
  };

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
          {cloudProviders.length > 0 && (
            <>
              {cloudProviders.map((provider) => (
                <FlexItem grow={{ default: "grow" }} key={provider.id}>
                  <Tile
                    className={"pf-u-w-100"}
                    title={provider.display_name ?? ""}
                    key={provider.id}
                    icon={getTileIcon(provider.id)}
                    isSelected={provider.id === cloudProvider}
                    style={{ height: "100%" }}
                    onClick={(): void => {
                      handleCloudProviderClick(provider.id);
                    }}
                    isDisabled={isDisabled}
                  />
                </FlexItem>
              ))}
            </>
          )}
          {cloudProviders.length === 0 && <CloudProviderSelectionSkeleton />}
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
          variant={SelectVariant.single}
          onToggle={toggleCloudRegionSelect}
          onSelect={handleCloudRegionSelect}
          selections={cloudRegion}
          isOpen={isCloudRegionSelectOpen}
          aria-describedby={"cloud-region"}
          menuAppendTo={"parent"}
          isDisabled={isDisabled || !cloudRegions}
        >
          {cloudRegionsOptions}
        </Select>
      </FormGroup>
    </>
  );
};

export default CloudProviderSelection;

export const CloudProviderSelectionSkeleton = (): JSX.Element => {
  const { t } = useTranslation("openbridgeTempDictionary");

  return (
    <FlexItem grow={{ default: "grow" }} key={"skeleton"}>
      <div className="cloud-provider__skeleton">
        <Skeleton
          height="100%"
          width="100%"
          screenreaderText={t("instance.loadingCloudProviders")}
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
