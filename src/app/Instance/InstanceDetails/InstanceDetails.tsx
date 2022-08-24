import React from "react";
import {
  ClipboardCopy,
  ClipboardCopyVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Skeleton,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { BridgeResponse } from "@rhoas/smart-events-management-sdk";

interface InstanceDetailsProps {
  instance: BridgeResponse;
  onClosingDetails: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const InstanceDetails = ({
  instance,
  onClosingDetails,
}: InstanceDetailsProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const formatDate = (dateStr: string): string =>
    format(new Date(dateStr), "PPPP p");

  return (
    <DrawerPanelContent
      widths={{ default: "width_33" }}
      data-ouia-component-id="instance-details-panel"
    >
      <DrawerHead>
        <Stack>
          <StackItem>
            <TextContent>
              <Text ouiaId="instance-details-name-label" component="small">
                {t("common.name")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text ouiaId="instance-details-name" component="h2">
                {instance.name}
              </Text>
            </TextContent>
          </StackItem>
        </Stack>
        <DrawerActions>
          <DrawerCloseButton
            onClick={onClosingDetails}
            data-ouia-component-id="close-instance-details"
          />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <DescriptionList isHorizontal isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.id")}</DescriptionListTerm>
            <DescriptionListDescription data-ouia-component-id="instance-details-id">
              {instance.id}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.owner")}</DescriptionListTerm>
            <DescriptionListDescription data-ouia-component-id="instance-details-owner">
              {instance.owner}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.submittedAt")}</DescriptionListTerm>
            <DescriptionListDescription data-ouia-component-id="instance-details-submitted-date">
              {instance.submitted_at && formatDate(instance.submitted_at)}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.publishedAt")}</DescriptionListTerm>
            <DescriptionListDescription data-ouia-component-id="instance-details-published-date">
              {instance.published_at && formatDate(instance.published_at)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </DrawerPanelBody>
      <DrawerPanelBody>
        <DescriptionList isCompact>
          <DescriptionListGroup>
            <TextContent>
              <Text component={TextVariants.h3}>
                {t("common.ingressEndpoint")}
              </Text>
            </TextContent>
            <DescriptionListDescription>
              <Stack hasGutter>
                <StackItem>
                  <Text component={TextVariants.small}>
                    {t("common.ingressEndpointDescription")}
                  </Text>
                </StackItem>
                <StackItem>
                  {instance.endpoint ? (
                    <ClipboardCopy
                      data-ouia-component-id="instance-details-endpoint"
                      isBlock
                      isReadOnly
                      hoverTip={t("common.copy")}
                      clickTip={t("common.copied")}
                      variant={ClipboardCopyVariant.inlineCompact}
                    >
                      {instance.endpoint}
                    </ClipboardCopy>
                  ) : (
                    <Skeleton fontSize="4xl" width="100%" />
                  )}
                </StackItem>
              </Stack>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};
