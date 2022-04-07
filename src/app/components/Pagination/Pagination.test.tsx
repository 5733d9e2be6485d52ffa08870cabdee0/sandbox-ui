import React from "react";
import { customRender } from "@utils/testUtils";
import { Pagination } from "./Pagination";
import { fireEvent } from "@testing-library/react";

const PAGINATION_LABEL = "Pagination";
const FIRST_PAGE_LABEL = "Go to first page";
const LAST_PAGE_LABEL = "Go to last page";

describe("Pagination component", () => {
  it("should display the total number of items", () => {
    const itemCount = 50;
    const comp = customRender(
      <Pagination
        itemCount={itemCount}
        page={1}
        perPage={1}
        onChange={jest.fn}
      />
    );

    expect(
      comp.container.querySelector(".pf-c-pagination__total-items")
    ).toHaveTextContent(itemCount.toString());
  });

  it("should be displayed in no-compact mode, by default", () => {
    const itemCount = 50;
    const comp = customRender(
      <Pagination
        itemCount={itemCount}
        page={1}
        perPage={1}
        onChange={jest.fn}
      />
    );

    expect(comp.getByLabelText(PAGINATION_LABEL).children).toHaveLength(5);
    expect(comp.getByLabelText(FIRST_PAGE_LABEL)).toBeInTheDocument();
    expect(comp.getByLabelText(LAST_PAGE_LABEL)).toBeInTheDocument();
  });

  it("should be displayed in compact mode, when required", () => {
    const itemCount = 50;
    const comp = customRender(
      <Pagination
        isCompact
        itemCount={itemCount}
        page={1}
        perPage={1}
        onChange={jest.fn}
      />
    );

    expect(comp.getByLabelText(PAGINATION_LABEL).children).toHaveLength(2);
    expect(comp.queryByLabelText(FIRST_PAGE_LABEL)).not.toBeInTheDocument();
    expect(comp.queryByLabelText(LAST_PAGE_LABEL)).not.toBeInTheDocument();
  });

  it("should trigger onChange function, when the page gets changed", () => {
    const itemCount = 50;
    const onChangeMock = jest.fn();

    const comp = customRender(
      <Pagination
        itemCount={itemCount}
        page={1}
        perPage={1}
        onChange={onChangeMock}
      />
    );

    fireEvent.click(comp.getByLabelText("Go to next page"));

    expect(onChangeMock).toHaveBeenCalledWith(2, 1);
  });
});
