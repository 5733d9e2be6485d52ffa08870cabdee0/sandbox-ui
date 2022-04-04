import "./InstancesListPage.css";
import React, { useState } from "react";
import { Table } from "@app/components/Table";
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
import { formatDistance } from "date-fns";
import { Pagination } from "@app/components/Pagination/Pagination";

const InstancesListPage = () => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const columnNames = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow) => (
        <Link
          data-testid="tableInstances-linkInstance"
          to={`instance/${row?.id}`}
        >
          {value}
        </Link>
      ),
    },
    { accessor: "description", label: t("common.description") },
    {
      accessor: "status",
      label: t("common.status"),
    },
    {
      accessor: "submitted_at",
      label: t("common.submittedAt"),
      formatter: (value: IRowData) => {
        const date = new Date(value as unknown as string);
        return formatDistance(date, new Date()) + " " + t("common.ago");
      },
    },
  ];
  const instances = [
    {
      description: "Description for the instance one",
      id: "87508471-ee0f-4f53-b574-da8a61285986",
      name: "Instance one",
      status: "accepted",
      submitted_at: "2022-02-24T13:34:00Z",
    },
    {
      description: "Description for the instance two",
      id: "830c8f0d-c677-492f-8d7e-0f81893fbba6",
      name: "Instance two",
      status: "ready",
      submitted_at: "2022-02-20T11:23:00Z",
    },
    {
      description: "Description for the instance three",
      id: "ee22ce62-1f23-4dd7-b106-e4158baf8228",
      name: "Instance three",
      status: "ready",
      submitted_at: "2022-02-15T12:03:00Z",
    },
    {
      description: "Description for the instance four",
      id: "21ac90ba-76d2-4f88-b08b-2547ef359bae",
      name: "Instance four",
      status: "ready",
      submitted_at: "2022-02-10T16:34:00Z",
    },
    {
      description: "Description for the instance five",
      id: "d4de4dd9-42fe-48ec-8ac7-42163e6e971a",
      name: "Instance five",
      status: "ready",
      submitted_at: "2022-02-05T13:58:00Z",
    },
    {
      description: "Description for the instance six",
      id: "d7e13602-b046-4120-b377-15d61e21c31a",
      name: "Instance six",
      status: "ready",
      submitted_at: "2022-02-01T12:02:00Z",
    },
    {
      description: "Description for the instance seven",
      id: "3a7efbed-3562-4a95-9c32-f49d12d8cab2",
      name: "Instance seven",
      status: "ready",
      submitted_at: "2021-12-25T21:46:00Z",
    },
    {
      description: "Description for the instance eight",
      id: "fa648473-3662-4bbc-99ba-158d9ab95ccc",
      name: "Instance eight",
      status: "ready",
      submitted_at: "2021-12-20T12:21:00Z",
    },
    {
      description: "Description for the instance nine",
      id: "04f131c3-b34c-4ee2-b153-fbff0bb91ece",
      name: "Instance nine",
      status: "ready",
      submitted_at: "2021-12-15T16:09:00Z",
    },
    {
      description: "Description for the instance ten",
      id: "c28da8c0-05e4-42f3-a3fd-615cc7fbb382",
      name: "Instance ten",
      status: "ready",
      submitted_at: "2021-12-10T11:34:00Z",
    },
    {
      description: "Description for the instance eleven",
      id: "a8c1cb57-0ab3-4ccb-8c55-ef8a8b166846",
      name: "Instance eleven",
      status: "ready",
      submitted_at: "2021-12-05T11:34:00Z",
    },
    {
      description: "Description for the instance twelve",
      id: "e176d63b-6fdc-43ce-afc8-45160f456502",
      name: "Instance twelve",
      status: "ready",
      submitted_at: "2021-12-01T11:34:00Z",
    },
  ];

  const actionResolver = () => {
    return [
      {
        title: t("common.details"),
        onClick: () =>
          // @TODO missing action to perform when clicking on details action
          {},
      },
      {
        title: t("common.delete"),
        onClick: () =>
          // @TODO missing action to perform when clicking on delete action
          {},
      },
    ];
  };

  const [showCreateInstance, setShowCreateInstance] = useState(false);

  const getPagination = (isCompact: boolean, className: string) => (
    <Pagination
      className={className}
      itemCount={instances.length}
      page={1}
      perPage={20}
      isCompact={isCompact}
      onChange={() =>
        // @TODO missing action when changing the page
        {}
      }
    />
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">
            {t("openbridgeTempDictionary:demoOverview")}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection className="instances-list-page__page-section">
        <Table
          caption={
            <section>
              <Button onClick={() => setShowCreateInstance(true)}>
                {t("instance.createSEInstance")}
              </Button>
              <CreateInstance
                isLoading={false}
                isModalOpen={showCreateInstance}
                onClose={() => setShowCreateInstance(false)}
                onCreate={() => setShowCreateInstance(false)}
              />
              {getPagination(true, "instances-list-page__pagination--top")}
            </section>
          }
          actionResolver={actionResolver}
          ariaLabel={t("openbridgeTempDictionary:instancesListTable")}
          columns={columnNames}
          cssClasses="tableInstances"
          rows={instances}
        />
        {getPagination(false, "instances-list-page__pagination--bottom")}
      </PageSection>
    </>
  );
};

export default InstancesListPage;
