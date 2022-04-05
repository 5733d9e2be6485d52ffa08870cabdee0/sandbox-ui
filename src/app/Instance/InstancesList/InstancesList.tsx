import React, { FunctionComponent, useState } from "react";
import {
  Button,
  Card,
  PaginationVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import CreateInstance from "@app/Instance/CreateInstance/CreateInstance";
import { Table, TableColumn } from "@app/components/Table";
import { Instance } from "../../../types/Instance";
import { Pagination } from "@app/components/Pagination/Pagination";
import { useTranslation } from "react-i18next";

interface InstancesListProps {
  /** List of columns for the instances table */
  columnNames: TableColumn[];
  /** List of instances */
  instances: Instance[];
}

export const InstancesList: FunctionComponent<InstancesListProps> = ({
  columnNames,
  instances,
}) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

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

  const getPagination = (itemCount: number, isBottom: boolean) => (
    <Pagination
      itemCount={itemCount}
      page={1}
      perPage={20}
      isCompact={!isBottom}
      {...(isBottom ? { variant: PaginationVariant.bottom } : {})}
      onChange={() =>
        // @TODO missing action when changing the page
        {}
      }
    />
  );

  return (
    <Card>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem alignment={{ default: "alignLeft" }}>
            <Button onClick={() => setShowCreateInstance(true)}>
              {t("instance.createSEInstance")}
            </Button>
            <CreateInstance
              isLoading={false}
              isModalOpen={showCreateInstance}
              onClose={() => setShowCreateInstance(false)}
              onCreate={() => setShowCreateInstance(false)}
            />
          </ToolbarItem>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            {getPagination(instances.length, false)}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table
        actionResolver={actionResolver}
        ariaLabel={t("openbridgeTempDictionary:instancesListTable")}
        columns={columnNames}
        cssClasses="tableInstances"
        rows={instances}
      />
      {getPagination(instances.length, true)}
    </Card>
  );
};
