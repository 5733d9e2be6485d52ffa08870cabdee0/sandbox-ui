import { customRender, waitForI18n } from "@utils/testUtils";
import { TableWithPagination } from "@app/components/TableWithPagination/TableWithPagination";
import React from "react";

describe("TableWithPagination component", () => {
  it("should display a toolbar with the top-pagination section", async () => {
    const comp = customRender(
      <TableWithPagination columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    const toolbar = comp.container.querySelector(
      "[data-ouia-component-id='rows-toolbar']"
    );
    expect(toolbar).toBeInTheDocument();
    expect(
      toolbar?.querySelector(
        "[data-ouia-component-type='pagination-control'][data-ouia-component-id='rows-top']"
      )
    ).toBeInTheDocument();
    expect(
      toolbar?.querySelector(
        "[data-ouia-component-type='pagination-control'][data-ouia-component-id='rows-bottom']"
      )
    ).not.toBeInTheDocument();
  });

  it("should display a toolbar item, containing to the `customToolbarElement`", async () => {
    const content = "custom";
    const comp = customRender(
      <TableWithPagination
        columns={[]}
        rows={[]}
        tableLabel="table"
        customToolbarElement={<div>{content}</div>}
      />
    );
    await waitForI18n(comp);

    const toolbarItem = comp.container.querySelector(
      ".pf-c-toolbar .pf-c-toolbar__item.overview__toolbar-custom"
    );
    expect(toolbarItem).toBeInTheDocument();
    expect(toolbarItem).toHaveTextContent(content);
  });

  it("should display a table", async () => {
    const comp = customRender(
      <TableWithPagination columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    expect(comp.container.querySelector("table")).toBeInTheDocument();
  });

  it("should display a bottom pagination", async () => {
    const comp = customRender(
      <TableWithPagination columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    expect(
      comp.container.querySelector(
        "[data-ouia-component-type='pagination-control'][data-ouia-component-id='rows-bottom']"
      )
    ).toBeInTheDocument();
  });
});
