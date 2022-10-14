import React, { VoidFunctionComponent } from "react";
import { Flex, FlexItem } from "@patternfly/react-core";
import "./StickyActionsLayout.css";

interface StickyActionsLayoutProps {
  /** The element(s) rendered in the body of the layout (like a form) */
  children: React.ReactNode;
  /** The element(s) rendered in the fixed bottom area (like a form actions buttons) */
  actions: React.ReactNode;
}

const StickyActionsLayout: VoidFunctionComponent<StickyActionsLayoutProps> = (
  props
) => {
  const { children, actions } = props;
  return (
    <section className={"sticky-actions-layout"}>
      <section className={"sticky-actions-layout__container"}>
        <Flex
          direction={{ default: "column" }}
          className={"sticky-actions-layout__root-flex"}
        >
          <Flex
            direction={{ default: "column" }}
            grow={{ default: "grow" }}
            flexWrap={{ default: "nowrap" }}
            className={"sticky-actions-layout__outer-wrap"}
          >
            <Flex
              direction={{ default: "column" }}
              grow={{ default: "grow" }}
              className={"sticky-actions-layout__inner-wrap"}
            >
              <FlexItem
                grow={{ default: "grow" }}
                className={"sticky-actions-layout__content-wrap"}
              >
                {children}
              </FlexItem>
            </Flex>
            <Flex flexWrap={{ default: "wrap" }} shrink={{ default: "shrink" }}>
              <section className={"sticky-actions-layout__actions"}>
                {actions}
              </section>
            </Flex>
          </Flex>
        </Flex>
      </section>
    </section>
  );
};

export default StickyActionsLayout;
