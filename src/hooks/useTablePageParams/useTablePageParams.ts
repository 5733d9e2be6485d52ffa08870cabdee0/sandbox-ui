import {
  FilterType,
  usePaginationSearchParams,
  useTranslation,
  useURLSearchParams,
  useURLSearchParamsChips,
} from "@rhoas/app-services-ui-components";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";

/**
 * Custom hook useful for managing page parameters in pages where we have overview tables
 * Managed page parameters are: pagination and filters (resource's name and status)
 */
export function useTablePageParams(): {
  pagination: {
    page: number;
    perPage: number;
    setPagination: (page: number, perPage: number) => void;
  };
  filters: {
    filtersConfig: { [p: string]: FilterType };
    onClearAllFilters: () => void;
    nameSearchParam: string | null;
    statuses: ManagedResourceStatus[];
  };
} {
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const { page, perPage, setPagination, setPaginationQuery } =
    usePaginationSearchParams();

  const { query: querySearchParams, update: updateSearchParams } =
    useURLSearchParams();

  const resetPaginationQuery = useCallback(
    () => setPaginationQuery(1, perPage),
    [perPage, setPaginationQuery]
  );

  const statusesChips = useURLSearchParamsChips<ManagedResourceStatus>(
    "status",
    resetPaginationQuery
  );

  const nameSearchParam = querySearchParams.get("name");

  const onClearAllFilters = useCallback(() => {
    const urlSearchParams = statusesChips.clearChained(
      setPaginationQuery(1, perPage)
    );
    urlSearchParams.delete("name");
    updateSearchParams(urlSearchParams);
  }, [perPage, setPaginationQuery, statusesChips, updateSearchParams]);

  const onClearNameFilter = (): void => {
    const urlQueryParams = setPaginationQuery(1, perPage);
    urlQueryParams.delete("name");
    updateSearchParams(urlQueryParams);
  };

  const onNameSearch = (name: string): void => {
    const urlQueryParams = setPaginationQuery(1, perPage);
    urlQueryParams.set("name", name);
    updateSearchParams(urlQueryParams);
  };

  return {
    pagination: {
      page,
      perPage,
      setPagination,
    },
    filters: {
      filtersConfig: {
        [t("common.name")]: {
          type: "search",
          chips: nameSearchParam ? [nameSearchParam] : [],
          onSearch: onNameSearch,
          onRemoveChip: onClearNameFilter,
          onRemoveGroup: onClearNameFilter,
          validate: () => true,
          errorMessage: "",
        },
        [t("common.status")]: {
          type: "checkbox",
          chips: statusesChips.chips,
          options: {
            [ManagedResourceStatus.Ready]: t("common.statuses.ready"),
            [ManagedResourceStatus.Preparing]: t("common.statuses.preparing"),
            [ManagedResourceStatus.Deleting]: t("common.statuses.deleting"),
            [ManagedResourceStatus.Failed]: t("common.statuses.failed"),
          },
          onToggle: statusesChips.toggle,
          onRemoveChip: statusesChips.remove,
          onRemoveGroup: statusesChips.clear,
        },
      },
      onClearAllFilters,
      nameSearchParam,
      statuses: statusesChips.chips,
    },
  };
}
