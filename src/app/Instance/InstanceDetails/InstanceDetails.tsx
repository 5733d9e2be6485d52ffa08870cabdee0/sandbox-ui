import React from "react";
import { Instance } from "../../../types/Instance";
import {
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface InstanceDetailsProps {
  instance: Instance;
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
      <DrawerContentBody>
        <DescriptionList isHorizontal isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.id")}</DescriptionListTerm>
            <DescriptionListDescription data-ouia-component-id="instance-details-id">
              {instance.id}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t("common.url")}</DescriptionListTerm>
            <DescriptionListDescription>
              <ClipboardCopy
                data-ouia-component-id="instance-details-endpoint"
                isReadOnly
                hoverTip={t("common.copy")}
                clickTip={t("common.copied")}
              >
                {instance.endpoint}
              </ClipboardCopy>
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
      </DrawerContentBody>
    </DrawerPanelContent>
  );
};
