import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Drawer,
  DrawerContent,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { IRow, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Instance } from "../../../types/Instance";
import { TableWithPagination } from "@app/components/TableWithPagination/TableWithPagination";
import CreateInstance from "@app/Instance/CreateInstance/CreateInstance";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";

const InstancesListPage = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance>();

  const columnNames = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const bridgeId = (row as Instance)?.id;
        return (
          <Link
            data-testid="tableInstances-linkInstance"
            to={`/instance/${bridgeId}`}
          >
            {value}
          </Link>
        );
      },
    },
    { accessor: "description", label: t("common.description") },
    {
      accessor: "status",
      label: t("common.status"),
      formatter: (value: IRowData): JSX.Element => {
        const statusString = (value as unknown as string) ?? "";
        return <StatusLabel status={statusString} />;
      },
    },
    {
      accessor: "submitted_at",
      label: t("common.submittedAt"),
      formatter: (value: IRowData): string => {
        const date = new Date(value as unknown as string);
        return formatDistance(date, new Date()) + " " + t("common.ago");
      },
    },
  ];
  const instances = [
    {
      description: "Description for the instance one",
      id: "3543edaa-1851-4ad7-96be-ebde7d20d717",
      name: "Instance one",
      status: "ready",
      submitted_at: "2022-02-24T13:34:00Z",
      published_at: "2022-02-24T13:35:00Z",
      endpoint:
        "https://87508471-ee0f-4f53-b574-da8a61285986.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance two",
      id: "830c8f0d-c677-492f-8d7e-0f81893fbba6",
      name: "Instance two",
      status: "ready",
      submitted_at: "2022-02-20T11:23:00Z",
      published_at: "2022-02-20T11:24:00Z",
      endpoint:
        "https://830c8f0d-c677-492f-8d7e-0f81893fbba6.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance three",
      id: "ee22ce62-1f23-4dd7-b106-e4158baf8228",
      name: "Instance three",
      status: "ready",
      submitted_at: "2022-02-15T12:03:00Z",
      published_at: "2022-02-15T12:04:00Z",
      endpoint:
        "https://ee22ce62-1f23-4dd7-b106-e4158baf8228.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance four",
      id: "21ac90ba-76d2-4f88-b08b-2547ef359bae",
      name: "Instance four",
      status: "ready",
      submitted_at: "2022-02-10T16:34:00Z",
      published_at: "2022-02-10T16:35:00Z",
      endpoint:
        "https://21ac90ba-76d2-4f88-b08b-2547ef359bae.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance five",
      id: "d4de4dd9-42fe-48ec-8ac7-42163e6e971a",
      name: "Instance five",
      status: "ready",
      submitted_at: "2022-02-05T13:58:00Z",
      published_at: "2022-02-05T13:59:00Z",
      endpoint:
        "https://d4de4dd9-42fe-48ec-8ac7-42163e6e971a.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance six",
      id: "d7e13602-b046-4120-b377-15d61e21c31a",
      name: "Instance six",
      status: "ready",
      submitted_at: "2022-02-01T12:02:00Z",
      published_at: "2022-02-01T12:03:00Z",
      endpoint:
        "https://d7e13602-b046-4120-b377-15d61e21c31a.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance seven",
      id: "3a7efbed-3562-4a95-9c32-f49d12d8cab2",
      name: "Instance seven",
      status: "ready",
      submitted_at: "2021-12-25T21:46:00Z",
      published_at: "2021-12-25T21:47:00Z",
      endpoint:
        "https://3a7efbed-3562-4a95-9c32-f49d12d8cab2.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance eight",
      id: "fa648473-3662-4bbc-99ba-158d9ab95ccc",
      name: "Instance eight",
      status: "ready",
      submitted_at: "2021-12-20T12:21:00Z",
      published_at: "2021-12-20T12:22:00Z",
      endpoint:
        "https://fa648473-3662-4bbc-99ba-158d9ab95ccc.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance nine",
      id: "04f131c3-b34c-4ee2-b153-fbff0bb91ece",
      name: "Instance nine",
      status: "ready",
      submitted_at: "2021-12-15T16:09:00Z",
      published_at: "2021-12-15T16:10:00Z",
      endpoint:
        "https://04f131c3-b34c-4ee2-b153-fbff0bb91ece.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance ten",
      id: "c28da8c0-05e4-42f3-a3fd-615cc7fbb382",
      name: "Instance ten",
      status: "ready",
      submitted_at: "2021-12-10T11:34:00Z",
      published_at: "2021-12-10T11:35:00Z",
      endpoint:
        "https://c28da8c0-05e4-42f3-a3fd-615cc7fbb382.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance eleven",
      id: "a8c1cb57-0ab3-4ccb-8c55-ef8a8b166846",
      name: "Instance eleven",
      status: "ready",
      submitted_at: "2021-12-05T11:34:00Z",
      published_at: "2021-12-05T11:35:00Z",
      endpoint:
        "https://a8c1cb57-0ab3-4ccb-8c55-ef8a8b166846.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
    {
      description: "Description for the instance twelve",
      id: "e176d63b-6fdc-43ce-afc8-45160f456502",
      name: "Instance twelve",
      status: "ready",
      submitted_at: "2021-12-01T11:34:00Z",
      published_at: "2021-12-01T11:35:00Z",
      endpoint:
        "https://e176d63b-6fdc-43ce-afc8-45160f456502.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
    },
  ];

  const [showCreateInstance, setShowCreateInstance] = useState(false);

  const pageContent = (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">
            {t("openbridgeTempDictionary:instance.instancesListPageTitle")}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <TableWithPagination
          columns={columnNames}
          customToolbarElement={
            <React.Fragment>
              <Button
                ouiaId="create-smart-event-instance"
                onClick={(): void => setShowCreateInstance(true)}
              >
                {t("instance.createSEInstance")}
              </Button>
              <CreateInstance
                isLoading={false}
                isModalOpen={showCreateInstance}
                onClose={(): void => setShowCreateInstance(false)}
                onCreate={(): void => setShowCreateInstance(false)}
              />
            </React.Fragment>
          }
          onDetailsClick={(rowData): void => {
            setSelectedInstance(rowData as unknown as Instance);
            setShowInstanceDrawer(true);
          }}
          rows={instances}
          tableLabel={t("openbridgeTempDictionary:instance.instancesListTable")}
        />
      </PageSection>
    </>
  );
  return selectedInstance ? (
    <Drawer isExpanded={showInstanceDrawer}>
      <DrawerContent
        data-ouia-component-id="instance-drawer"
        panelContent={
          <InstanceDetails
            onClosingDetails={(): void => setShowInstanceDrawer(false)}
            instance={selectedInstance}
          />
        }
      >
        {pageContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <>{pageContent}</>
  );
};

export default InstancesListPage;
