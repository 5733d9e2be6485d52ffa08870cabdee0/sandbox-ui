import "@testing-library/jest-dom";
import * as React from "react";
import { render } from "@testing-library/react";
import { AppLayout } from "./AppLayout";
import { BrowserRouter } from "react-router-dom";

describe("AppLayout component", () => {
  test("should render children element content", () => {
    const textContent = "test";
    const children = <div>{textContent}</div>;

    const { container } = render(
      <BrowserRouter>
        <AppLayout children={children} />
      </BrowserRouter>
    );

    expect(container).toHaveTextContent(textContent);
  });
});
