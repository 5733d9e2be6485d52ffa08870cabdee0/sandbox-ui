import React, { FunctionComponent } from "react";
import { Flex, FlexItem } from "@patternfly/react-core";
import "./StickyActionsLayout.css";

interface StickyActionsLayoutProps {
  children: React.ReactNode;
  actions: React.ReactNode;
}

const StickyActionsLayout: FunctionComponent<StickyActionsLayoutProps> = (
  props
) => {
  const { children, actions } = props;
  return (
    <div>
      <section className={"sticky-actions__container"}>
        <Flex direction={{ default: "column" }} style={{ height: "100%" }}>
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
                {/*<Form*/}
                {/*  className={"sticky-actions__form"}*/}
                {/*  autoComplete="off"*/}
                {/*></Form>*/}
              </FlexItem>
            </Flex>
            <Flex flexWrap={{ default: "wrap" }} shrink={{ default: "shrink" }}>
              {/*<ActionGroup className={"processor-edit__actions"}>*/}
              {/*  */}
              {/*</ActionGroup>*/}
              <section className={"sticky-actions__actions"}>{actions}</section>
            </Flex>
          </Flex>
        </Flex>
      </section>
    </div>
  );
};

export default StickyActionsLayout;
