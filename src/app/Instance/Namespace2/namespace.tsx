import React from "react";
import "./namespace.css";
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
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
  FormGroup,
} from "@patternfly/react-core";

import { PlusCircleIcon } from "@patternfly/react-icons";
import { BuildIcon } from "@patternfly/react-icons";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";

type ItemArrayType = unknown[];

export const ComposableContextSelector: React.FunctionComponent = () => {
  const items: ItemArrayType = [
    <Flex key="">
      <FlexItem>
        <Title headingLevel="h3">
          default-namespace <Label color="purple">ROSA</Label>
        </Title>
      </FlexItem>
      <FlexItem>
        <DescriptionList
          isAutoColumnWidths
          columnModifier={{ default: "3Col" }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster owner</DescriptionListTerm>
            <DescriptionListDescription className="pf-u-disabled-color-100">
              sklein
            </DescriptionListDescription>
          </DescriptionListGroup>
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
        </DescriptionList>
      </FlexItem>
    </Flex>,

    <Flex direction={{ default: "row" }} key="">
      <FlexItem>
        <Title headingLevel="h3">
          default-namespace <Label color="purple">ROSA</Label>
        </Title>
      </FlexItem>
      <FlexItem>
        <DescriptionList
          isAutoColumnWidths
          columnModifier={{ default: "3Col" }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster owner</DescriptionListTerm>
            <DescriptionListDescription className="pf-u-disabled-color-100">
              kmontgomery
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster name</DescriptionListTerm>
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
        </DescriptionList>
      </FlexItem>
    </Flex>,

    <Flex direction={{ default: "row" }} key="">
      <FlexItem>
        <Title headingLevel="h3">
          default-namespace <Label color="purple">ROSA</Label>
        </Title>
      </FlexItem>
      <FlexItem>
        <DescriptionList
          isAutoColumnWidths
          columnModifier={{ default: "3Col" }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster owner</DescriptionListTerm>
            <DescriptionListDescription className="pf-u-disabled-color-100">
              pkapoor
            </DescriptionListDescription>
          </DescriptionListGroup>
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
        </DescriptionList>
      </FlexItem>
    </Flex>,
  ];
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [selected, setSelected] = React.useState(
    // eslint-disable-next-line no-constant-condition
    typeof items[0] === "string"
      ? items[0]
      : // eslint-disable-next-line no-constant-condition
      "number"
      ? items[0]
      : // eslint-disable-next-line no-constant-condition
      "undefined"
      ? items[0]
      : ""
  );
  const [selectedDataListItemId, setSelectedDataListItemId] =
    React.useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuFooterBtnRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onSelectDataListItem = (id: React.SetStateAction<string>) => {
    setSelectedDataListItemId(id);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  const handleInputChange = (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.FormEvent<HTMLInputElement>
  ) => {
    setSelectedDataListItemId(id);
  };

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
  const onSelect = (
    _ev: React.MouseEvent<Element, MouseEvent> | undefined,
    itemId: string | number | undefined
  ) => {
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
      <DataList
        aria-label="selectable data list example"
        selectedDataListItemId={selectedDataListItemId}
        onSelectDataListItem={onSelectDataListItem}
        selectableRow={{ onChange: handleInputChange }}
      >
        <MenuContent>
          <MenuList>
            {/* eslint-disable-next-line react/jsx-key */}
            <MenuItem itemId={items[0]} key={0}>
              <DataListItem
                aria-labelledby="selectable-action-item1"
                id="item1"
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      // eslint-disable-next-line react/jsx-key
                      <DataListCell key="primary content">
                        <Flex spaceItems={{ default: "spaceItemsXl" }}>
                          <FlexItem>
                            <BuildIcon size="sm" />
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: "column" }}>
                              <FlexItem>
                                <Title headingLevel="h3">
                                  default-namespace
                                </Title>
                              </FlexItem>
                              <DescriptionList
                                isAutoColumnWidths
                                columnModifier={{ default: "3Col" }}
                              >
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Cluster owner
                                  </DescriptionListTerm>
                                  <DescriptionListDescription className="pf-u-disabled-color-100">
                                    sklein
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Cluster name
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    order-processing-expedited-delivery
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Cluster ID
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    skjw083200754376de
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </Flex>
                          </FlexItem>
                          <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                            <Label color="purple">ROSA</Label>
                          </FlexItem>
                        </Flex>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </MenuItem>

            <MenuItem itemId={items[1]} key={1}>
              <DataListItem
                aria-labelledby="selectable-action-item2"
                id="item2"
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      // eslint-disable-next-line react/jsx-key
                      <DataListCell>
                        <Flex spaceItems={{ default: "spaceItemsXl" }}>
                          <FlexItem>
                            <BuildIcon size="sm" />
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: "column" }}>
                              <FlexItem>
                                <Title headingLevel="h3">
                                  default-namespace
                                </Title>
                              </FlexItem>
                              <FlexItem>
                                <DescriptionList
                                  isAutoColumnWidths
                                  columnModifier={{ default: "3Col" }}
                                >
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster owner
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      kmontgomery
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster name
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      retention-poc
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster ID
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      soew421106000975bw
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                            <Label color="purple">ROSA</Label>
                          </FlexItem>
                        </Flex>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </MenuItem>

            <MenuItem itemId={items[2]} key={2}>
              <DataListItem
                aria-labelledby="selectable-action-item3"
                id="item3"
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      // eslint-disable-next-line react/jsx-key
                      <DataListCell>
                        <Flex spaceItems={{ default: "spaceItemsXl" }}>
                          <FlexItem>
                            <BuildIcon size="sm" />
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: "column" }}>
                              <FlexItem>
                                <Title headingLevel="h3">
                                  default-namespace
                                </Title>
                              </FlexItem>
                              <FlexItem>
                                <DescriptionList
                                  isAutoColumnWidths
                                  columnModifier={{ default: "3Col" }}
                                >
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster owner
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      pkapoor
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster name
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      shipments
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Cluster ID
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      hwna002186455145sa
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
                            <Label color="purple">ROSA</Label>
                          </FlexItem>
                        </Flex>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </MenuItem>
          </MenuList>
        </MenuContent>
      </DataList>
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
      <FormGroup
        label="Deployment"
        isRequired
        labelIcon={<OutlinedQuestionCircleIcon />}
        fieldId="menu-toggle-cluster-namespace"
      >
        <Popper
          trigger={toggle}
          popper={menu}
          isVisible={isOpen}
          popperMatchesTriggerWidth={false}
        />
      </FormGroup>
    </div>
  );
};
