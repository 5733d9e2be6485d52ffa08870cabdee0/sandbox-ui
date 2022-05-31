import { AxiosError } from "axios";

/**
 * Check if the error code originates from the API
 *
 * @param error generic error returned from function
 * @returns true if error originated from the API
 */
export const isServiceApiError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).response?.data.code !== undefined;
};

/**
 * Get the error code from the API error
 *
 * @param error generic error returned from function
 * @returns error code (one of fields of APIErrorCodes)
 */
export const getErrorCode = (error: unknown): string | undefined => {
    return (error as AxiosError).response?.data?.code;
};
