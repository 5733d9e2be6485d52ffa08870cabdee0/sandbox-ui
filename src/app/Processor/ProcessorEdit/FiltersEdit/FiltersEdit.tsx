import React from "react";
import {
  Button,
  Flex,
  FlexItem,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput,
} from "@patternfly/react-core";
import {
  HelpIcon,
  PlusCircleIcon,
  TrashAltIcon,
} from "@patternfly/react-icons";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { EventFilter, FilterType } from "../../../../types/Processor";
import { getFilterValue, isCommaSeparatedFilterType } from "@utils/filterUtils";

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
      value: FilterType.STRING_EQUALS,
      label: t("processor.StringEquals"),
      isPlaceholder: false,
    },
    {
      value: FilterType.STRING_CONTAINS,
      label: t("processor.StringContains"),
      isPlaceholder: false,
    },
    {
      value: FilterType.STRING_BEGINS,
      label: t("processor.StringBeginsWith"),
      isPlaceholder: false,
    },
    {
      value: FilterType.STRING_IN,
      label: t("processor.StringIn"),
      isPlaceholder: false,
    },
    {
      value: FilterType.NUMBER_IN,
      label: t("processor.NumberIn"),
      isPlaceholder: false,
    },
  ];

  const getOptionalTooltipIcon = (
    filter: EventFilter
  ): JSX.Element | undefined =>
    isCommaSeparatedFilterType(filter) ? (
      <Popover
        headerContent={t("processor.multipleValues")}
        bodyContent={t("processor.commaSeparatedValuesTooltip")}
      >
        <button
          type="button"
          aria-label={t("processor.moreInfoForFilterValues")}
          onClick={(e): void => e.preventDefault()}
          aria-describedby="form-group-label-info"
          className="pf-c-form__group-label-help"
        >
          <HelpIcon noVerticalAlign={true} />
        </button>
      </Popover>
    ) : undefined;

  const getOptionalPlaceholder = (filter: EventFilter): string | undefined => {
    if (filter.type === FilterType.STRING_IN) {
      return "hello,world,how,are,you";
    }
    if (filter.type === FilterType.NUMBER_IN) {
      return "1,-2,3";
    }
    return undefined;
  };

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
                    labelIcon={getOptionalTooltipIcon(filter)}
                  >
                    <TextInput
                      type="text"
                      id={`filter-value-${index}`}
                      ouiaId="filter-value"
                      name={`filter-value-${index}`}
                      aria-describedby={`filter-value-${index}`}
                      defaultValue={getFilterValue(filter)}
                      placeholder={getOptionalPlaceholder(filter)}
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
