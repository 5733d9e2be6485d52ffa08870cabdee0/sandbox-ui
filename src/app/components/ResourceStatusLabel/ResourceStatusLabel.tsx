import React, { forwardRef } from "react";
import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";
import {
  Alert,
  Button,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Spinner,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import "./ResourceStatusLabel.css";

export interface ResourceStatusLabelProps {
  status: ResourceStatus;
  creationDelayed?: ResourceStatusDelayed;
}

export const ResourceStatusLabel = forwardRef<
  HTMLButtonElement,
  ResourceStatusLabelProps
>((props, ref) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const { status, creationDelayed } = props;
  switch (status) {
    case ResourceStatus.READY:
      return (
        <Split hasGutter className="mas-c-status">
          <SplitItem>
            <CheckCircleIcon className="mas-m-ready" />
          </SplitItem>
          <SplitItem>{t("common.statuses.ready")}</SplitItem>
        </Split>
      );
    case ResourceStatus.CREATING:
      return (
        <Split hasGutter className="mas-c-status">
          <SplitItem>
            <Spinner size="md" />
          </SplitItem>
          <SplitItem>
            <Button ref={ref} variant={"link"} isInline>
              {t("common.statuses.creating")}
            </Button>
            {!creationDelayed && (
              <Flex>
                <FlexItem>
                  <HelperText>
                    <HelperTextItem variant="indeterminate">
                      {t("common.thisWillBeReadyShortly")}
                    </HelperTextItem>
                  </HelperText>
                </FlexItem>
              </Flex>
            )}
            {creationDelayed && (
              <Alert
                variant={creationDelayed}
                isInline
                isPlain
                title={t("common.thisIsTakingLongerThanExpected")}
              />
            )}
          </SplitItem>
        </Split>
      );
    case ResourceStatus.FAILED:
      return (
        <Split hasGutter className="mas-c-status">
          <SplitItem>
            <ExclamationTriangleIcon className="mas-m-failed" />
          </SplitItem>
          <SplitItem>{t("common.statuses.failed")}</SplitItem>
        </Split>
      );
    case ResourceStatus.DELETING:
      return (
        <div>
          <p className="mas-m-deleting"> {t("common.statuses.deleting")}</p>
        </div>
      );
    default:
      return <></>;
  }
});

ResourceStatusLabel.displayName = "ResourceStatusLabel";
