import { useTranslation } from "react-i18next";
import { FieldValidation } from "../../../types/Processor";

export function useValidationBase(): {
  isRequired: (value: string) => FieldValidation;
  isHTTPUrl: (value: string) => FieldValidation;
} {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const isRequired = (value: string): FieldValidation => {
    return {
      isValid: value.trim().length > 0,
      errorMessage: t("common.required"),
    };
  };

  const isHTTPUrl = (value: string): FieldValidation => {
    if (value.trim().length === 0) {
      return {
        isValid: false,
        errorMessage: t("common.required"),
      };
    }
    const isValidUrl = (value: string): boolean => {
      let url: URL;
      try {
        url = new URL(value);
      } catch (e) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };
    return {
      isValid: isValidUrl(value),
      errorMessage: t("processor.errors.invalidUrl"),
    };
  };
  return { isRequired, isHTTPUrl };
}
