import { AxiosError } from "axios";
import { ErrorListResponse,  ModelError } from "@rhoas/smart-events-management-sdk";

// @TODO Temporary workaround because the Error interface is not being
// replaced with ModelError everywhere. See https://issues.redhat.com/browse/MGDOBR-979
// for more details
interface ErrorListResponseFixed {
    items?: Array<ModelError>
}

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
 * Get the first error item returned from the API
 *
 * @param error generic error returned from function
 * @returns error item (a single ErrorResponse)
 */
export const getFirstError = (error: unknown): ModelError | undefined => {
    const errorListResponse = (error as AxiosError).response?.data as ErrorListResponseFixed;
    return errorListResponse?.items?.length ? errorListResponse?.items[0] : undefined;
};

/**
 * Get the error code related to the first error item returned from the API
 *
 * @param error generic error returned from function
 * @returns error code (one of fields of APIErrorCodes)
 */
export const getErrorCode = (error: unknown): string | undefined => {
    return getFirstError(error)?.code;
};

/**
 * Get the error reason related to the first error item returned from the API
 *
 * @param error generic error returned from function
 * @returns error reason
 */
export const getErrorReason = (error: unknown): string | undefined => {
    return getFirstError(error)?.reason;
};
