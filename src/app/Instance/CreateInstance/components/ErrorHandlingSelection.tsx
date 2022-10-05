import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { ErrorHandlingMethods } from "../../../../types/ErrorHandlingMethods";

interface ErrorHandlingSelectionProps {
  selectedMethod: string | null;
  errorHandlingMethods: ErrorHandlingMethods;
  isDisabled: boolean;
  onMethodSelection: (errorMethod: string) => void;
}

export const ErrorHandlingSelection = ({
  selectedMethod,
  errorHandlingMethods,
  isDisabled,
  onMethodSelection,
}: ErrorHandlingSelectionProps): JSX.Element => {
  const { t } = useTranslation("openbridgeTempDictionary");

  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [handlingMethod, setHandlingMethod] = useState<string>(
    selectedMethod ?? errorHandlingMethods.default.value
  );

  const defaultMethodOption = useMemo(() => {
    return (
      <SelectOption
        key={errorHandlingMethods.default.value}
        value={errorHandlingMethods.default.value}
      >
        {errorHandlingMethods.default.label}
      </SelectOption>
    );
  }, [errorHandlingMethods.default]);

  const deadLetterQueueOptions = useMemo(() => {
    return errorHandlingMethods.deadLetterQueue.map((errorHandling) => (
      <SelectOption key={errorHandling.value} value={errorHandling.value}>
        {errorHandling.label}
      </SelectOption>
    ));
  }, [errorHandlingMethods.deadLetterQueue]);

  useEffect(() => {
    setHandlingMethod(selectedMethod ?? errorHandlingMethods.default.value);
  }, [selectedMethod, errorHandlingMethods]);

  return (
    <Select
      id="error-handling-method-selector"
      isDisabled={isDisabled}
      ouiaId="error-handling-method-selector"
      aria-describedby={t("common.errorHandlingMethod")}
      variant={SelectVariant.single}
      onToggle={(): void => setIsSelectorOpen((isOpen) => !isOpen)}
      onSelect={(_e, selection): void => {
        const handlingMethod = selection as string;
        setHandlingMethod(handlingMethod);
        onMethodSelection(handlingMethod);
        setIsSelectorOpen(false);
      }}
      isOpen={isSelectorOpen}
      selections={handlingMethod}
      menuAppendTo={"parent"}
    >
      {[
        defaultMethodOption,
        <SelectGroup
          key="dead-letter-queue-group"
          label={t("common.deadLetterQueue")}
        />,
        ...deadLetterQueueOptions,
      ]}
    </Select>
  );
};
