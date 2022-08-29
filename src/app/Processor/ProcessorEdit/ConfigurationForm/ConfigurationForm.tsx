/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return  */
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AutoField } from "uniforms-patternfly/dist/es6";
import { AutoForm, ValidatedQuickForm, context } from "uniforms";
import { createValidator } from "@app/Processor/ProcessorEdit/ConfigurationForm/validator";
import { CustomJsonSchemaBridge } from "@app/Processor/ProcessorEdit/ConfigurationForm/CustomJsonSchemaBridge";
import { useTranslation } from "react-i18next";
import { prepareConfigParameters } from "@utils/processorUtils";

interface ConfigurationFormProps {
  configuration?: object;
  onChange: (model: any) => void;
  registerValidation: (validationFunction: () => boolean) => void;
  schema: object;
  readOnly?: boolean;
  editMode: boolean;
}

const ConfigurationForm = (props: ConfigurationFormProps): JSX.Element => {
  const {
    configuration = {},
    onChange,
    registerValidation,
    schema,
    readOnly = false,
    editMode,
  } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const schemaValidator = useMemo(() => createValidator(schema), [schema]);

  const bridge = useMemo(
    () =>
      new CustomJsonSchemaBridge(schema, schemaValidator, t, editMode, false),
    [schema, schemaValidator, t, editMode]
  );

  const convertedConfiguration = useMemo(
    () => prepareConfigParameters(configuration, schema, "read"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const properties = useMemo(() => bridge.schema.properties, [bridge]);

  const newRef = useRef<any>();

  const validate = useCallback((): boolean => {
    newRef.current?.submit();
    const errors = schemaValidator(
      prepareConfigParameters(configuration, schema, "write")
    );
    return errors === null;
  }, [newRef, schemaValidator, configuration, schema]);

  useEffect(() => {
    registerValidation(validate);
  }, [registerValidation, validate]);

  return (
    <>
      {properties && (
        <DynamicForm
          validate={"onChangeAfterSubmit"}
          schema={bridge}
          model={convertedConfiguration}
          onChangeModel={onChange}
          ref={(ref: any): void => (newRef.current = ref)}
          disabled={readOnly}
        >
          {Object.keys(properties as { [key: string]: unknown }).map((key) => (
            <AutoField
              key={key}
              name={key}
              disabled={readOnly}
              data-ouia-component-id={key}
              data-ouia-component-type="config-parameter"
            />
          ))}
        </DynamicForm>
      )}
    </>
  );
};

export default ConfigurationForm;

function Auto(parent: any): any {
  class _ extends AutoForm.Auto(parent) {
    static Auto = Auto;
    onChange(key: string, value: unknown): any {
      if (value === "") return super.onChange(key, undefined);
      super.onChange(key, value);
    }
    render(): any {
      const ctx: any = this.getContext();

      return (
        <context.Provider value={ctx}>
          <section
            className="pf-c-form__section"
            data-ouia-component-id="configuration"
            style={{ marginTop: 0 }}
            {...this.getNativeFormProps()}
          />
        </context.Provider>
      );
    }
  }
  return _;
}
const DynamicForm = Auto(ValidatedQuickForm);
