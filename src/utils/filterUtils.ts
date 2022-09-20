import { EventFilter, FilterType } from "../types/Processor";

export const isCommaSeparatedFilterType = (
  filter: Partial<EventFilter>
): boolean => {
  return [
    FilterType.STRING_BEGINS,
    FilterType.STRING_CONTAINS,
    FilterType.STRING_IN,
    FilterType.NUMBER_IN,
  ].includes(filter.type as FilterType);
};

export const getFilterValue = (filter: EventFilter): string => {
  if (filter.values && isCommaSeparatedFilterType(filter)) {
    return filter.values.join(",");
  }
  return filter.value;
};
