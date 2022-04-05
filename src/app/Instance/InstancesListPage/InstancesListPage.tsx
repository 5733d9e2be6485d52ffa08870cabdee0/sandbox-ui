import React, { useState } from "react";
import { Table, TableColumn } from "@app/components/Table";
import { useTranslation } from "react-i18next";
import {
  Button,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { IRow, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import CreateInstance from "@app/Instance/CreateInstance/CreateInstance";
import { Instance } from "../../../types/Instance";

const InstancesListPage = () => {
  const columnNames: TableColumn[] = [
    {
      accessor: "name",
      label: "Name",
      formatter: (value: IRowData, row?: IRow) => {
        const rowId = (row as Instance)?.id;
        return (
          <Link
            data-testid="tableInstances-linkInstance"
            to={`instance/${rowId}`}
          >
            {value}
          </Link>
        );
      },
    },
    { accessor: "id", label: "ID" },
    { accessor: "status", label: "Status" },
    { accessor: "submitted_at", label: "Time created" },
  ];
  const instances = [
    {
      name: "Instance one",
      id: "87508471-ee0f-4f53-b574-da8a61285986",
      submitted_at: "2022-02-24T13:34:00Z",
      status: "ready",
    },
    {
      name: "Instance two",
      id: "830c8f0d-c677-492f-8d7e-0f81893fbba6",
      submitted_at: "2022-02-20T11:23:00Z",
      status: "ready",
    },
    {
      name: "Instance three",
      id: "ee22ce62-1f23-4dd7-b106-e4158baf8228",
      submitted_at: "2022-02-15T12:03:00Z",
      status: "ready",
    },
    {
      name: "Instance four",
      id: "21ac90ba-76d2-4f88-b08b-2547ef359bae",
      submitted_at: "2022-02-10T16:34:00Z",
      status: "ready",
    },
    {
      name: "Instance five",
      id: "d4de4dd9-42fe-48ec-8ac7-42163e6e971a",
      submitted_at: "2022-02-05T13:58:00Z",
      status: "ready",
    },
    {
      name: "Instance six",
      id: "d7e13602-b046-4120-b377-15d61e21c31a",
      submitted_at: "2022-02-01T12:02:00Z",
      status: "ready",
    },
    {
      name: "Instance seven",
      id: "3a7efbed-3562-4a95-9c32-f49d12d8cab2",
      submitted_at: "2021-12-25T21:46:00Z",
      status: "ready",
    },
    {
      name: "Instance eight",
      id: "fa648473-3662-4bbc-99ba-158d9ab95ccc",
      submitted_at: "2021-12-20T12:21:00Z",
      status: "ready",
    },
    {
      name: "Instance nine",
      id: "04f131c3-b34c-4ee2-b153-fbff0bb91ece",
      submitted_at: "2021-12-15T16:09:00Z",
      status: "ready",
    },
    {
      name: "Instance ten",
      id: "c28da8c0-05e4-42f3-a3fd-615cc7fbb382",
      submitted_at: "2021-12-10T11:34:00Z",
      status: "ready",
    },
    {
      name: "Instance eleven",
      id: "a8c1cb57-0ab3-4ccb-8c55-ef8a8b166846",
      submitted_at: "2021-12-05T11:34:00Z",
      status: "ready",
    },
    {
      name: "Instance twelve",
      id: "e176d63b-6fdc-43ce-afc8-45160f456502",
      submitted_at: "2021-12-01T11:34:00Z",
      status: "ready",
    },
  ];
  const { t } = useTranslation("openbridgeTempDictionary");

  //TODO fake actionResolver
  const actionResolver = (rowData?: IRowData) => {
    // noinspection JSUnusedGlobalSymbols
    return [
      {
        title: "Action",
        onClick: () => console.log(rowData),
      },
    ];
  };

  const [showCreateInstance, setShowCreateInstance] = useState(false);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">
            {t("openbridgeTempDictionary:demoOverview")}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Button onClick={() => setShowCreateInstance(true)}>
          {t("instance.createSEInstance")}
        </Button>
        <CreateInstance
          isLoading={false}
          isModalOpen={showCreateInstance}
          onClose={() => setShowCreateInstance(false)}
          onCreate={() => setShowCreateInstance(false)}
        />
      </PageSection>
      <PageSection>
        <Table
          actionResolver={actionResolver}
          ariaLabel={t("openbridgeTempDictionary:instancesListTable")}
          columns={columnNames}
          cssClasses="tableInstances"
          rows={instances}
        />
      </PageSection>
    </>
  );
};

export default InstancesListPage;
