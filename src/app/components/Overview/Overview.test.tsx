import { customRender, waitForI18n } from "@utils/testUtils";
import { Overview } from "@app/components/Overview/Overview";
import React from "react";

describe("Overview component", () => {
  it("should display a toolbar with the top-pagination section", async () => {
    const comp = customRender(
      <Overview columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    const toolbar = comp.container.querySelector(".pf-c-toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(
      toolbar?.querySelector(".pf-c-toolbar__item.pf-m-pagination")
    ).toBeInTheDocument();
  });

  it("should display a toolbar item, containing to the `customToolbarElement`", async () => {
    const content = "custom";
    const comp = customRender(
      <Overview
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
      <Overview columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    expect(comp.container.querySelector("table")).toBeInTheDocument();
  });

  it("should display a bottom pagination", async () => {
    const comp = customRender(
      <Overview columns={[]} rows={[]} tableLabel="table" />
    );
    await waitForI18n(comp);

    expect(
      comp.container.querySelector(".pf-c-pagination.pf-m-bottom")
    ).toBeInTheDocument();
  });
});
