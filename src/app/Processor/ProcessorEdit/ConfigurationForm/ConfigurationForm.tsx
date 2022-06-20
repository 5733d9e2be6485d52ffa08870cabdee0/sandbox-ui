/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return  */
import React, { useRef } from "react";
import Omit from "lodash.omit";
import { AutoField } from "uniforms-patternfly/dist/es6";
import { AutoForm, ValidatedQuickForm, context } from "uniforms";
import { createValidator } from "@app/Processor/ProcessorEdit/ConfigurationForm/validator";
import { CustomJsonSchemaBridge } from "@app/Processor/ProcessorEdit/ConfigurationForm/CustomJsonSchemaBridge";
import { useTranslation } from "react-i18next";

interface ConfigurationFormProps {
  configuration?: object;
  onChange: (model: any) => void;
  registerValidation: (validationFunction: () => boolean) => void;
  schema: object;
  readOnly?: boolean;
}

const ConfigurationForm = (props: ConfigurationFormProps): JSX.Element => {
  const {
    configuration = {},
    onChange,
    registerValidation,
    schema,
    readOnly = false,
  } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const schemaValidator = createValidator(schema);
  const bridge = new CustomJsonSchemaBridge(
    schema,
    schemaValidator,
    t,
    false,
    false
  );

  // excluding error_handler, processors or steps
  // @TODO remove it after https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/pull/834 is merged
  const properties = Omit(bridge.schema.properties, [
    "error_handler",
    "processors",
    "steps",
  ]);

  const newRef = useRef<any>();

  const validate = (): boolean => {
    newRef.current?.submit();
    const errors = schemaValidator(configuration);
    return errors === null;
  };

  registerValidation(validate);

  return (
    <DynamicForm
      validate={"onChangeAfterSubmit"}
      schema={bridge}
      model={configuration}
      onChangeModel={onChange}
      ref={(ref: any): void => (newRef.current = ref)}
      disabled={readOnly}
    >
      {Object.keys(properties as { [key: string]: unknown }).map((key) => (
        <AutoField key={key} name={key} disabled={readOnly} />
      ))}
    </DynamicForm>
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
