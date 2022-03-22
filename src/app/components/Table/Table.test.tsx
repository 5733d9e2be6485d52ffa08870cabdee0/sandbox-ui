import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Table } from './Table';

describe('Table component', () => {
  const columns = [{ accessor: 'col', label: 'Column' }];
  const rows = [{ col: 'abc' }, { col: 'efg' }];

  test('should render configured columns', () => {
    const { container } = render(<Table columns={columns} rows={[]} />);

    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const thead = table?.querySelector('thead');
    expect(thead).not.toBeNull();
    const headers = thead?.querySelectorAll('th');
    expect(headers).toHaveLength(columns.length);
    expect(headers?.[0]).toHaveTextContent(columns[0].label);
  });

  test('should render configured rows', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);

    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const tbody = table?.querySelector('tbody');
    expect(tbody).not.toBeNull();
    const tr = tbody?.querySelectorAll('tr');
    expect(tr).toHaveLength(rows.length);
    const td = tbody?.querySelectorAll('td');
    expect(td?.[0]).toHaveTextContent(rows[0].col);
    expect(td?.[1]).toHaveTextContent(rows[1].col);
  });

  test('should render action cells, when `actionResolver` is configured', () => {
    const actionResolver = () => {
      return [
        {
          title: 'actions...',
          onClick: jest.fn(),
        },
      ];
    };

    const { container } = render(
      <Table columns={columns} rows={rows} actionResolver={actionResolver} />
    );

    expect(container.querySelector('.pf-c-table__action')).toBeInTheDocument();
    expect(container.querySelectorAll('.pf-c-table__action')).toHaveLength(
      rows.length
    );
  });

  test('should append to the table, all configured css classes', () => {
    const cssClasses = 'further-class';

    const { container } = render(
      <Table columns={columns} rows={rows} cssClasses={cssClasses} />
    );

    expect(container.querySelector('table')).toHaveClass(cssClasses);
  });
});
