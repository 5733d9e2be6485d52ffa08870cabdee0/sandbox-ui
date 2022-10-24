import { useCallback, useRef, useState } from "react";
import {
  ProcessorFormData,
  ProcessorValidation,
} from "../../../types/Processor";
import omit from "lodash.omit";
import { useTranslation } from "@rhoas/app-services-ui-components";

export function useValidateProcessor(
  processor: ProcessorFormData,
  existingProcessorName?: string
): {
  validate: () => boolean;
  validation: ProcessorValidation;
  validateName: () => boolean;
  validateProcessorType: () => boolean;
  registerValidateConfig: (action: () => boolean) => void;
  resetValidation: (propertyName: string) => void;
  existingProcessorName?: string;
} {
  const [validation, setValidation] = useState<ProcessorValidation>({
    isValid: undefined,
    errors: {},
  });
  const { name, type } = processor;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const validateConfig = useRef<(() => boolean) | undefined>();

  const registerValidateConfig = (callback: () => boolean): void => {
    validateConfig.current = callback;
  };

  const isEmpty = (value: string): boolean => {
    return value.trim().length === 0;
  };

  const resetValidation = useCallback((propertyName: string): void => {
    setValidation((prevState) => ({
      ...prevState,
      errors: omit(prevState.errors, propertyName),
    }));
  }, []);

  const validateName = useCallback((): boolean => {
    if (isEmpty(name)) {
      setValidation((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, name: t("common.required") },
      }));
      return false;
    }
    if (existingProcessorName && name.trim() === existingProcessorName) {
      setValidation((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          name: t("processor.errors.invalidName"),
        },
      }));
      return false;
    }
    resetValidation("name");
    return true;
  }, [name, resetValidation, existingProcessorName, t]);

  const validateProcessorType = useCallback((): boolean => {
    if (!type) {
      setValidation((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          processorType: t("processor.errors.missingProcessorType"),
        },
      }));
      return false;
    } else {
      resetValidation("processorType");
      return true;
    }
  }, [type, resetValidation, t]);

  const validate = useCallback((): boolean => {
    const validations = [
      validateName,
      validateProcessorType,
      validateConfig.current,
    ];

    const isValid = validations.reduce(
      (prev: boolean, curr: (() => boolean) | undefined) =>
        (curr?.() ?? prev) && prev,
      true
    );
    setValidation((prevState) => ({ ...prevState, isValid }));
    return isValid;
  }, [validateName, validateProcessorType, validateConfig]);

  return {
    validate,
    validation,
    validateName,
    validateProcessorType,
    registerValidateConfig,
    resetValidation,
  };
}
