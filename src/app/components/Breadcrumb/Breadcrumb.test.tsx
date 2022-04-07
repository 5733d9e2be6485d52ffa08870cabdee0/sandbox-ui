import { customRender } from "@utils/testUtils";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import React from "react";
import { BrowserRouter } from "react-router-dom";

describe("Breadcrumb component", () => {
  it("should display items in the order they are passed to the path", () => {
    const item1 = "item1";
    const item2 = "item2";
    const item3 = "item3";
    const path = [{ label: item1 }, { label: item2 }, { label: item3 }];
    const comp = customRender(<Breadcrumb path={path} />);

    expect(
      comp.container.querySelectorAll("li.pf-c-breadcrumb__item")
    ).toHaveLength(path.length);
    expect(
      comp.container.querySelectorAll("li.pf-c-breadcrumb__item")[0]
    ).toHaveTextContent(item1);
    expect(
      comp.container.querySelectorAll("li.pf-c-breadcrumb__item")[1]
    ).toHaveTextContent(item2);
    expect(
      comp.container.querySelectorAll("li.pf-c-breadcrumb__item")[2]
    ).toHaveTextContent(item3);
  });

  it("should display a link for all items in the path, where `linkTo` property is configured", () => {
    const label = "item";
    const linkTo = "/url";
    const path = [{ label, linkTo }];
    const comp = customRender(
      <BrowserRouter>
        <Breadcrumb path={path} />
      </BrowserRouter>
    );

    expect(comp.getByText(label)).toBeInTheDocument();
    expect(comp.getByText(label)).toHaveAttribute("href", linkTo);
  });
});
