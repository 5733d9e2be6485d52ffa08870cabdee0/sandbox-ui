import React from "react";
import "./namespace.css";
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListDescription,
  DescriptionListTerm,
  Label,
  Flex,
  FlexItem,
  MenuToggle,
  Menu,
  MenuContent,
  MenuFooter,
  MenuList,
  MenuItem,
  Title,
  Popper,
  Button,
} from "@patternfly/react-core";

import { PlusCircleIcon } from "@patternfly/react-icons";
import { BuildIcon } from "@patternfly/react-icons";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";

import { global_danger_color_100 } from "@patternfly/react-tokens";

type ItemArrayType = unknown[];

export const ComposableContextSelector: React.FunctionComponent = () => {
  const items: ItemArrayType = [
    <Flex key="">
      <Title headingLevel="h3">default-namespace (ROSA)</Title>
      <DescriptionList columnModifier={{ xl: "3Col" }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster name</DescriptionListTerm>
          <DescriptionListDescription>
            order-processing-expedited-delivery
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
          <DescriptionListDescription>
            skjw083200754376de
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster owner</DescriptionListTerm>
          <DescriptionListDescription>sklein</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Label color="purple">ROSA</Label>
    </Flex>,

    <Flex key="">
      <Title headingLevel="h3">default-namespace (ROSA)</Title>
      <DescriptionList columnModifier={{ xl: "3Col" }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster name</DescriptionListTerm>
          <DescriptionListDescription>retention-poc</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
          <DescriptionListDescription>
            soew421106000975bw
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster owner</DescriptionListTerm>
          <DescriptionListDescription>kmontgomery</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Label color="purple">ROSA</Label>
    </Flex>,

    <Flex key="">
      <Title headingLevel="h3">default-namespace (ROSA)</Title>
      <DescriptionList columnModifier={{ xl: "3Col" }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster name</DescriptionListTerm>
          <DescriptionListDescription>shipments</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
          <DescriptionListDescription>
            hwna002186455145sa
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster owner</DescriptionListTerm>
          <DescriptionListDescription>pkapoor</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Label color="purple">ROSA</Label>
    </Flex>,
  ];
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [selected, setSelected] = React.useState(
    typeof items[0] === "string" ? items[0] : items[0].text
  );

  const menuRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuFooterBtnRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpen) {
      return;
    }
    if (menuFooterBtnRef.current?.contains(event.target as Node)) {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          return;
        }
        setIsOpen(!isOpen);
        toggleRef.current?.focus();
      }
    }
    if (menuRef.current?.contains(event.target as Node)) {
      if (event.key === "Escape") {
        setIsOpen(!isOpen);
        toggleRef.current?.focus();
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && !menuRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, menuRef]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setTimeout(() => {
      if (menuRef.current) {
        const firstElement = menuRef.current.querySelector(
          "li > button:not(:disabled), li > a:not(:disabled), input:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsOpen(!isOpen);
  };

  const toggle = (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      {selected}
    </MenuToggle>
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onSelect = (itemId: string) => {
    setSelected(itemId);
    setIsOpen(!isOpen);
  };

  const menu = (
    <Menu
      ref={menuRef}
      id="context-selector"
      onSelect={onSelect}
      isScrollable
      style={
        {
          "--pf-c-menu--Width": "98%",
        } as React.CSSProperties
      }
    >
      <MenuContent>
        <MenuList>
          {/* eslint-disable-next-line react/jsx-key */}
          <div>
            <MenuItem itemId={items[0]} key={0}>
              <Flex spaceItems={{ default: "spaceItemsXl" }}>
                <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                  <BuildIcon size="md" />
                </FlexItem>
                <FlexItem>
                  <Flex direction={{ default: "column" }}>
                    <FlexItem>
                      <Title headingLevel="h3">default-namespace (ROSA)</Title>
                    </FlexItem>
                    <FlexItem>
                      <DescriptionList columnModifier={{ xl: "3Col" }}>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster name
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            order-processing-expedited-delivery
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
                          <DescriptionListDescription>
                            skjw083200754376de
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster owner
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            sklein
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem align={{ default: "alignRight" }}>
                  <Label color="purple">ROSA</Label>
                </FlexItem>
              </Flex>
            </MenuItem>

            <MenuItem itemId={items[1]} key={1}>
              <Flex spaceItems={{ default: "spaceItemsXl" }}>
                <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                  <BuildIcon size="md" />
                </FlexItem>
                <FlexItem>
                  <Flex direction={{ default: "column" }}>
                    <FlexItem>
                      <Title headingLevel="h3">default-namespace (ROSA)</Title>
                    </FlexItem>
                    <FlexItem>
                      <DescriptionList columnModifier={{ xl: "3Col" }}>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster name
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            retention-poc
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
                          <DescriptionListDescription>
                            soew421106000975bw
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster owner
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            kmontgomery
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem align={{ default: "alignRight" }}>
                  <Label color="purple">ROSA</Label>
                </FlexItem>
              </Flex>
            </MenuItem>

            <MenuItem itemId={items[2]} key={2}>
              <Flex spaceItems={{ default: "spaceItemsXl" }}>
                <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                  <BuildIcon size="md" />
                </FlexItem>
                <FlexItem>
                  <Flex direction={{ default: "column" }}>
                    <FlexItem>
                      <Title headingLevel="h3">default-namespace (ROSA)</Title>
                    </FlexItem>
                    <FlexItem>
                      <DescriptionList columnModifier={{ xl: "3Col" }}>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster name
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            shipments
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
                          <DescriptionListDescription>
                            hwna002186455145sa
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Cluster owner
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            pkapoor
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem align={{ default: "alignRight" }}>
                  <Label color="purple">ROSA</Label>
                </FlexItem>
              </Flex>
            </MenuItem>
          </div>
        </MenuList>
      </MenuContent>
      <MenuFooter>
        <PlusCircleIcon color="blue" />
        <Button component="a" href="" variant="link">
          Learn how to create a namespace
        </Button>
      </MenuFooter>
    </Menu>
  );
  return (
    <div ref={containerRef}>
      <Flex>
        Deployment
        <FlexItem>
          <div color={global_danger_color_100.value}> * </div>
        </FlexItem>
        <FlexItem>
          <OutlinedQuestionCircleIcon />
        </FlexItem>
      </Flex>
      <Popper
        trigger={toggle}
        popper={menu}
        isVisible={isOpen}
        popperMatchesTriggerWidth={false}
      />
    </div>
  );
};
