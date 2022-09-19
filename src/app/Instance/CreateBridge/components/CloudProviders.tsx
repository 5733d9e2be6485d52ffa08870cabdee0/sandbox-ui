import React, { useMemo, useState, VFC } from "react";

import { useMachine } from "@xstate/react";
import CloudProvidersMachine from "@app/Instance/CreateBridge/machines/cloudProvidersMachine";
import { useGetCloudProvidersWithRegionsApi } from "../../../../hooks/useCloudProvidersApi/useGetProvidersWithRegions";
import {
  Flex,
  FlexItem,
  FormGroup,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
  Tile,
} from "@patternfly/react-core";
import { CloudProviderSelectionSkeleton } from "@app/Instance/CreateInstance/CloudProviderSelection";
import { useTranslation } from "react-i18next";
import { AwsIcon } from "@patternfly/react-icons";

const CloudProviders: VFC = () => {
  const { t } = useTranslation("openbridgeTempDictionary");

  const { getCloudProvidersWithRegions } = useGetCloudProvidersWithRegionsApi();
  const [current, send, service] = useMachine(CloudProvidersMachine, {
    services: {
      fetchCloudProviders: () => getCloudProvidersWithRegions(),
    },
  });
  const isLoading = current.matches("fetching providers");
  const isError = current.matches("failure");
  const { cloudProviders, selectedCloudProvider, selectedCloudRegion } =
    current.context;

  service.onTransition((state) => {
    if (state.changed) {
      console.log(state);
    }
  });

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
      {isError && <h1>There was an error fetching providers</h1>}
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
                    isSelected={provider.id === selectedCloudProvider}
                    style={{ height: "100%" }}
                    onClick={(): void => {
                      handleCloudProviderClick(provider.id);
                    }}
                    // isDisabled={isDisabled}
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
          ouiaId="cloud-region"
          variant={SelectVariant.single}
          onToggle={toggleCloudRegionSelect}
          onSelect={handleCloudRegionSelect}
          selections={selectedCloudRegion}
          isOpen={isCloudRegionSelectOpen}
          aria-describedby={"cloud-region"}
          menuAppendTo={"parent"}
          // isDisabled={isDisabled || !cloudRegions}
          isDisabled={!selectedCloudProvider}
        >
          {cloudRegionsOptions}
        </Select>
      </FormGroup>
    </>
  );
};

export default CloudProviders;

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
