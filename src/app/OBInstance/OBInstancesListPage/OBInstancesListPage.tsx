import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from '@patternfly/react-core';
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OBInstancesListPage = () => {
  const columnNames = ['Name', 'ID', 'Creation date', 'Status'];
  const instances = [
    {
      name: 'Instance one',
      id: '87508471-ee0f-4f53-b574-da8a61285986',
      creationDate: '2022-02-24T13:34:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance two',
      id: '830c8f0d-c677-492f-8d7e-0f81893fbba6',
      creationDate: '2022-02-20T11:23:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance three',
      id: 'ee22ce62-1f23-4dd7-b106-e4158baf8228',
      creationDate: '2022-02-15T12:03:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance four',
      id: '21ac90ba-76d2-4f88-b08b-2547ef359bae',
      creationDate: '2022-02-10T16:34:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance five',
      id: 'd4de4dd9-42fe-48ec-8ac7-42163e6e971a',
      creationDate: '2022-02-05T13:58:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance six',
      id: 'd7e13602-b046-4120-b377-15d61e21c31a',
      creationDate: '2022-02-01T12:02:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance seven',
      id: '3a7efbed-3562-4a95-9c32-f49d12d8cab2',
      creationDate: '2021-12-25T21:46:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance eight',
      id: 'fa648473-3662-4bbc-99ba-158d9ab95ccc',
      creationDate: '2021-12-20T12:21:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance nine',
      id: '04f131c3-b34c-4ee2-b153-fbff0bb91ece',
      creationDate: '2021-12-15T16:09:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance ten',
      id: 'c28da8c0-05e4-42f3-a3fd-615cc7fbb382',
      creationDate: '2021-12-10T11:34:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance eleven',
      id: 'a8c1cb57-0ab3-4ccb-8c55-ef8a8b166846',
      creationDate: '2021-12-05T11:34:00Z',
      status: 'Ready',
    },
    {
      name: 'Instance twelve',
      id: 'e176d63b-6fdc-43ce-afc8-45160f456502',
      creationDate: '2021-12-01T11:34:00Z',
      status: 'Ready',
    },
  ];
  const { t } = useTranslation();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">
            {t('openbridgeTempDictionary:demoOverview')}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <TableComposable aria-label="Simple table">
          <Thead>
            <Tr>
              {columnNames.map((columnName) => (
                <Th key={columnName}>{columnName}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {instances.map((instance) => (
              <Tr key={instance.id}>
                <Td dataLabel={columnNames[0]}>
                  <Link to={`instance/${instance.id}`}>{instance.name}</Link>
                </Td>
                <Td
                  dataLabel={columnNames[1]}
                  style={{ fontFamily: 'monospace' }}
                >
                  {instance.id}
                </Td>
                <Td dataLabel={columnNames[2]}>
                  {new Date(instance.creationDate).toLocaleString()}
                </Td>
                <Td dataLabel={columnNames[3]}>{instance.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </PageSection>
    </>
  );
};

export default OBInstancesListPage;
