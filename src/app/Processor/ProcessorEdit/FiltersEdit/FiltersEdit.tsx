import React from "react";
import {
  Button,
  Flex,
  FlexItem,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput,
} from "@patternfly/react-core";
import { PlusCircleIcon, TrashAltIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { EventFilter } from "../../../../types/Processor";

interface FiltersEditProps {
  filters: EventFilter[];
  onChange: (filters: EventFilter[]) => void;
}

const FiltersEdit = (props: FiltersEditProps): JSX.Element => {
  const { filters, onChange } = props;

  const addFilter = (): void => {
    onChange([...filters, { key: "", type: "", value: "" }]);
  };

  const deleteFilter = (index: number): void => {
    onChange(filters.filter((_event, eventIndex) => eventIndex !== index));
  };

  const updateFilter = (filter: EventFilter, index: number): void => {
    onChange(
      filters.map((_event, eventIndex): EventFilter => {
        if (eventIndex === index) {
          return filter;
        }
        return _event;
      })
    );
  };

  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const filterTypesOptions = [
    {
      value: "",
      label: t("common.selectType"),
      isPlaceholder: true,
    },
    {
      value: "StringEquals",
      label: t("processor.stringEquals"),
      isPlaceholder: false,
    },
    {
      value: "StringContains",
      label: t("processor.stringContains"),
      isPlaceholder: false,
    },
    {
      value: "StringBeginsWith",
      label: t("processor.stringBeginsWith"),
      isPlaceholder: false,
    },
    {
      value: "ValuesIn",
      label: t("processor.valuesIn"),
      isPlaceholder: false,
    },
  ];

  return (
    <Stack hasGutter={true}>
      <StackItem>
        <Stack hasGutter={true}>
          {filters.map((filter, index) => (
            <StackItem
              key={`filter-${filter.type}-${index}`}
              data-ouia-component-id={`item-${index}`}
              data-testid="filter-item"
            >
              <Split hasGutter={true}>
                <SplitItem isFilled>
                  <FormGroup
                    fieldId={`filter-key-${index}`}
                    label={t("common.key")}
                  >
                    <TextInput
                      type="text"
                      id={`filter-key-${index}`}
                      ouiaId="filter-key"
                      name={`filter-key-${index}`}
                      aria-describedby={`filter-key-${index}`}
                      value={filter.key}
                      onChange={(key): void =>
                        updateFilter({ ...filter, key }, index)
                      }
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled>
                  <FormGroup
                    fieldId={`filter-type-${index}`}
                    label={t("common.type")}
                  >
                    <FormSelect
                      id={`filter-type-${index}`}
                      ouiaId="filter-type"
                      aria-label={t("common.type")}
                      value={filter.type}
                      onChange={(type): void =>
                        updateFilter({ ...filter, type }, index)
                      }
                    >
                      {filterTypesOptions.map((option, index) => (
                        <FormSelectOption
                          key={index}
                          value={option.value}
                          label={option.label}
                          isPlaceholder={option.isPlaceholder}
                        />
                      ))}
                    </FormSelect>
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled>
                  <FormGroup
                    fieldId={`filter-value-${index}`}
                    label={t("common.value")}
                  >
                    <TextInput
                      type="text"
                      id={`filter-value-${index}`}
                      ouiaId="filter-value"
                      name={`filter-value-${index}`}
                      aria-describedby={`filter-value-${index}`}
                      value={filter.value}
                      onChange={(value): void =>
                        updateFilter({ ...filter, value }, index)
                      }
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <Flex
                    direction={{ default: "column" }}
                    justifyContent={{ default: "justifyContentFlexEnd" }}
                    style={{ height: "100%" }}
                  >
                    <FlexItem>
                      <Button
                        variant="plain"
                        ouiaId="delete-item"
                        aria-label={t("processor.deleteFilter")}
                        onClick={(): void => deleteFilter(index)}
                        isDisabled={filters.length === 1}
                      >
                        <TrashAltIcon />
                      </Button>
                    </FlexItem>
                  </Flex>
                </SplitItem>
              </Split>
            </StackItem>
          ))}
        </Stack>
      </StackItem>
      <StackItem>
        <Button
          variant="link"
          ouiaId="add-filter"
          icon={<PlusCircleIcon />}
          onClick={addFilter}
          isInline={true}
        >
          {t("processor.addFilter")}
        </Button>
      </StackItem>
    </Stack>
  );
};

export default FiltersEdit;
