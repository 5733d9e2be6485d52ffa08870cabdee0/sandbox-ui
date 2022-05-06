import { useCallback, useState } from "react";
import { omit } from "lodash";
import { Action, Source } from "@openapi/generated";
import { useTranslation } from "react-i18next";
import { ConfigType, ProcessorValidation } from "../../../types/Processor";

export function useValidateConfigParams(
  config: Action | Source | undefined,
  configTypes: ConfigType[]
): {
  validation: ProcessorValidation;
  validate: () => boolean;
  resetValidation: (propertyName: string) => void;
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
      const configType = configTypes.find((type) => type.value === typeName);
      if (config && configType) {
        const field = configType.fields.find(
          (field) => field.name === fieldName
        );
        if (field) {
          const fieldValidation = field.validate(config.parameters[fieldName]);
          if (fieldValidation.isValid) {
            resetValidation(field.name);
          } else {
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
    const validations = [validateType];

    if (config?.type) {
      const configType = configTypes.find((type) => type.value === config.type);
      if (configType) {
        configType.fields.map((field) => {
          validations.push((): boolean =>
            validateField(config.type, field.name)
          );
        });
      }
    }

    const isValid = validations.reduce(
      (prev: boolean, curr: () => boolean) => curr() && prev,
      true
    );

    setValidation((prevState) => ({ ...prevState, isValid }));
    return isValid;
  }, [config, configTypes, validateType, validateField]);

  return { validation, validate, resetValidation, validateField };
}
