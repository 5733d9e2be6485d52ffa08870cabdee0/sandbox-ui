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

interface FiltersEditProps {
  filters: EventFilter[];
  onChange: (filters: EventFilter[]) => void;
}

const FiltersEdit = (props: FiltersEditProps) => {
  const { filters, onChange } = props;

  const addFilter = () => {
    onChange([...filters, { key: "", type: "", value: "" }]);
  };

  const deleteFilter = (index: number) => {
    onChange(filters.filter((_event, eventIndex) => eventIndex !== index));
  };

  const updateFilter = (filter: EventFilter, index: number) => {
    onChange(
      filters.map((_event, eventIndex) => {
        if (eventIndex === index) {
          return filter;
        }
        return _event;
      })
    );
  };

  const { t } = useTranslation();

  const filterTypesOptions = [
    {
      value: "",
      label: t("openbridgeTempDictionary:common:selectType"),
      isPlaceholder: true,
    },
    {
      value: "StringEquals",
      label: t("openbridgeTempDictionary:processor:stringEquals"),
      isPlaceholder: false,
    },
    {
      value: "StringContains",
      label: t("openbridgeTempDictionary:processor:stringContains"),
      isPlaceholder: false,
    },
    {
      value: "StringBeginsWith",
      label: t("openbridgeTempDictionary:processor:stringBeginsWith"),
      isPlaceholder: false,
    },
    {
      value: "ValuesIn",
      label: t("openbridgeTempDictionary:processor:valuesIn"),
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
              data-testid="filter-item"
            >
              <Split hasGutter={true}>
                <SplitItem isFilled>
                  <FormGroup
                    fieldId={`filter-key-${index}`}
                    label={t("openbridgeTempDictionary:common:key")}
                  >
                    <TextInput
                      type="text"
                      id={`filter-key-${index}`}
                      name={`filter-key-${index}`}
                      aria-describedby={`filter-key-${index}`}
                      value={filter.key}
                      onChange={(key) =>
                        updateFilter({ ...filter, key }, index)
                      }
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled>
                  <FormGroup
                    fieldId={`filter-type-${index}`}
                    label={t("openbridgeTempDictionary:common:type")}
                  >
                    <FormSelect
                      id={`filter-type-${index}`}
                      aria-label={t("openbridgeTempDictionary:common:type")}
                      value={filter.type}
                      onChange={(type) =>
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
                    label={t("openbridgeTempDictionary:common:value")}
                  >
                    <TextInput
                      type="text"
                      id={`filter-value-${index}`}
                      name={`filter-value-${index}`}
                      aria-describedby={`filter-value-${index}`}
                      value={filter.value}
                      onChange={(value) =>
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
                        aria-label={t(
                          "openbridgeTempDictionary:processor:deleteFilter"
                        )}
                        onClick={() => deleteFilter(index)}
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
          icon={<PlusCircleIcon />}
          onClick={addFilter}
          isInline={true}
        >
          {t("openbridgeTempDictionary:processor:addFilter")}
        </Button>
      </StackItem>
    </Stack>
  );
};

export default FiltersEdit;

export interface EventFilter {
  key: string;
  type: string;
  value: string;
}
