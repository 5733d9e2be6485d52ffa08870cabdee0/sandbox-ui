import React, { VoidFunctionComponent } from "react";
import { Flex, FlexItem } from "@patternfly/react-core";
import "./StickyActionsLayout.css";

interface StickyActionsLayoutProps {
  children: React.ReactNode;
  actions: React.ReactNode;
}

const StickyActionsLayout: VoidFunctionComponent<StickyActionsLayoutProps> = (
  props
) => {
  const { children, actions } = props;
  return (
    <div>
      <section className={"sticky-actions__container"}>
        <Flex
          direction={{ default: "column" }}
          className={"sticky-actions__root-flex"}
        >
          <Flex
            direction={{ default: "column" }}
            grow={{ default: "grow" }}
            flexWrap={{ default: "nowrap" }}
            className={"sticky-actions__outer-wrap"}
          >
            <Flex
              direction={{ default: "column" }}
              grow={{ default: "grow" }}
              className={"sticky-actions__inner-wrap"}
            >
              <FlexItem
                grow={{ default: "grow" }}
                className={"sticky-actions__content-wrap"}
              >
                {children}
              </FlexItem>
            </Flex>
            <Flex flexWrap={{ default: "wrap" }} shrink={{ default: "shrink" }}>
              <section className={"sticky-actions__actions"}>{actions}</section>
            </Flex>
          </Flex>
        </Flex>
      </section>
    </div>
  );
};

export default StickyActionsLayout;
