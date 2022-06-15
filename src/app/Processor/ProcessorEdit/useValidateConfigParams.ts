import { useCallback, useState } from "react";
import { omit } from "lodash";
import { Action, Source } from "@openapi/generated";
import { useTranslation } from "react-i18next";
import { ConfigType, ProcessorValidation } from "../../../types/Processor";
import { getParameterValue } from "@utils/parametersUtils";

export function useValidateConfigParams(
  // Current value of the source or action configuration provided by the user
  config: Action | Source | undefined,
  // List of supported configuration types
  configTypes: ConfigType[]
): {
  // Validation object containing the validation status
  validation: ProcessorValidation;
  // Validate function that will validate the whole action or source configuration
  validate: () => boolean;
  // Function to reset the validation status of a single field
  resetValidation: (propertyName: string) => void;
  // Function to validate a single field
  validateField: (typeName: string, propertyName: string) => boolean;
} {
  const [validation, setValidation] = useState<ProcessorValidation>({
    isValid: undefined,
    errors: {},
  });
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const isEmpty = (value: string): boolean => {
    return value.trim().length === 0;
  };

  const resetValidation = useCallback((propertyName: string): void => {
    setValidation((prevState) => ({
      ...prevState,
      errors: omit(prevState.errors, propertyName),
    }));
  }, []);

  const validateType = useCallback((): boolean => {
    if (isEmpty(config?.type ?? "")) {
      setValidation((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, type: t("common.required") },
      }));
      return false;
    } else {
      resetValidation("type");
      return true;
    }
  }, [config, resetValidation, t]);

  const validateField = useCallback(
    (typeName: string, fieldName: string): boolean => {
      const configType = configTypes.find((type) => type.name === typeName);
      if (config && configType) {
        const field = configType.fields.find(
          (field) => field.name === fieldName
        );
        if (field) {
          // Run the field validation function provided by configTypes with the current
          // value of the field
          const fieldValidation = field.validate(
            getParameterValue(
              (config.parameters as { [key: string]: unknown })[fieldName]
            )
          );
          // When the field value is valid, clean any possible previous error associated to the field
          if (fieldValidation.isValid) {
            resetValidation(field.name);
          } else {
            // When the field value is not valid, add an error entry for it in the
            // validation object, using the error message coming from the field validation outcome
            setValidation((prevState) => ({
              ...prevState,
              errors: {
                ...prevState.errors,
                [fieldName]: fieldValidation.errorMessage,
              },
            }));
          }
          return fieldValidation.isValid;
        }
      }
      return false;
    },
    [config, configTypes, resetValidation]
  );

  const validate = useCallback((): boolean => {
    // Array of validation functions to run when validating the whole (action or source) config.
    // In the initial state it only contains the validation of the config type.
    const validations = [validateType];

    // If a config type is set, retrieve its details from the configTypes array
    if (config?.type) {
      const configType = configTypes.find((type) => type.name === config.type);
      if (configType) {
        // For each field of the config type selected by the user, generate a validation function
        // and push it to the validations array.
        configType.fields.map((field) => {
          validations.push((): boolean =>
            validateField(config.type, field.name)
          );
        });
      }
    }

    // Run all the validation functions in the validations array to determine if the config is valid.
    const isValid = validations.reduce(
      (prev: boolean, curr: () => boolean) => curr() && prev,
      true
    );

    // Update the validation object with the new validation result. Also return it.
    setValidation((prevState) => ({ ...prevState, isValid }));
    return isValid;
  }, [config, configTypes, validateType, validateField]);

  return { validation, validate, resetValidation, validateField };
}
