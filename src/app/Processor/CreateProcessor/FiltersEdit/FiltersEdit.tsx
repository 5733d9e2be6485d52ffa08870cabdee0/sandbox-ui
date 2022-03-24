import React from 'react';
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
} from '@patternfly/react-core';
import { PlusCircleIcon, TrashAltIcon } from '@patternfly/react-icons';

interface FiltersEditProps {
  filters: EventFilter[];
  onChange: (filters: EventFilter[]) => void;
}

const FiltersEdit = (props: FiltersEditProps) => {
  const { filters, onChange } = props;

  const filterTypesOptions = [
    {
      value: '',
      label: 'Select a type',
    },
    {
      value: 'StringEquals',
      label: 'String equals',
    },
    {
      value: 'StringContains',
      label: 'String contains',
    },
    {
      value: 'StringBeginsWith',
      label: 'String begins with',
    },
    {
      value: 'ValuesIn',
      label: 'Values in',
    },
  ];

  const addFilter = () => {
    onChange([...filters, { key: '', type: '', value: '' }]);
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

  return (
    <Stack hasGutter={true}>
      <StackItem>
        <Stack hasGutter={true}>
          {filters.map((filter, index) => (
            <StackItem>
              <Split hasGutter={true}>
                <SplitItem isFilled>
                  <FormGroup fieldId={`filter-key-${index}`} label="Key">
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
                  <FormGroup fieldId={`filter-type-${index}`} label="Type">
                    <FormSelect
                      id={`filter-type-${index}`}
                      aria-label="Filter type"
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
                        />
                      ))}
                    </FormSelect>
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled>
                  <FormGroup fieldId={`filter-value-${index}`} label="Value">
                    <TextInput
                      type="text"
                      id={`filter-value-${index}`}
                      name={`filter-value-${index}`}
                      aria-describedby="filter-value"
                      value={filter.value}
                      onChange={(value) =>
                        updateFilter({ ...filter, value }, index)
                      }
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <Flex
                    direction={{ default: 'column' }}
                    justifyContent={{ default: 'justifyContentFlexEnd' }}
                    style={{ height: '100%' }}
                  >
                    <FlexItem>
                      <Button
                        variant="plain"
                        aria-label="Delete filter"
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
          Add filter
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
