import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Bullseye,
  Button,
  Card,
  CodeBlock,
  CodeBlockCode,
  PaginationVariant,
  Spinner,
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
  const [data, setData] = useState<unknown>();
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleCreate = (name: string) => {
    setShowCreateInstance(false);
    fetch("bridges", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        update();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const update = () => {
    setDataIsLoading(true);
    fetch("/bridges")
      .then((res) => res.json())
      .then((data: unknown) => {
        console.log(data);
        setData(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDataIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const refresh = () => {
    setIsRefreshing(true);
    update();
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <Card>
      <Toolbar ouiaId="instances-toolbar">
        <ToolbarContent>
          <ToolbarItem alignment={{ default: "alignLeft" }}>
            <Button onClick={() => setShowCreateInstance(true)}>
              {t("instance.createSEInstance")}
            </Button>
            <CreateInstance
              isLoading={false}
              isModalOpen={showCreateInstance}
              onClose={() => setShowCreateInstance(false)}
              onCreate={handleCreate}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              onClick={refresh}
              isDisabled={dataIsLoading}
              isLoading={isRefreshing}
            >
              Refresh
            </Button>
          </ToolbarItem>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            {getPagination(instances.length, false)}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <br />
      <br />
      <CodeBlock>
        <CodeBlockCode id="code-content">
          {dataIsLoading ? (
            <Bullseye style={{ margin: "2em 0" }}>
              <Spinner
                isSVG
                size="lg"
                aria-label="Contents of the medium example"
              />
            </Bullseye>
          ) : (
            (data as string)
          )}
        </CodeBlockCode>
      </CodeBlock>
      <br />
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
