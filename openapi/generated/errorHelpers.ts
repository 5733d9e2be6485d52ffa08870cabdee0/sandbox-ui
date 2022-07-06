import { AxiosError } from "axios";
import { ErrorListResponse } from "@openapi/generated/model";

/**
 * Check if the error code originates from the API
 *
 * @param error generic error returned from function
 * @returns true if error originated from the API
 */
export const isServiceApiError = (error: unknown): error is AxiosError => {
    const errorListResponse = (error as AxiosError).response?.data as ErrorListResponse;
    return errorListResponse?.items !== undefined;
};

/**
 * Get the error code related to the first error item returned from the API
 *
 * @param error generic error returned from function
 * @returns error code (one of fields of APIErrorCodes)
 */
export const getErrorCode = (error: unknown): string | undefined => {
    const errorListResponse = (error as AxiosError).response?.data as ErrorListResponse;
    return errorListResponse?.items?.length ? errorListResponse?.items[0].code : undefined;
};
