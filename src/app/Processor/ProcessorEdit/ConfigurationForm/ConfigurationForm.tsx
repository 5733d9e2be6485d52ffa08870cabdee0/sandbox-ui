/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return  */
import React from "react";
// import { AutoForm, } from "uniforms";
// import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import { createValidator } from "@utils/validator";
import { AutoField } from "uniforms-patternfly/dist/es6";
import { AutoForm, ValidatedQuickForm, context } from "uniforms";
import Omit from "lodash.omit";
import { CustomJsonSchemaBridge } from "@app/Processor/ProcessorEdit/ConfigurationForm/CustomJsonSchemaBridge";
import { useTranslation } from "react-i18next";

interface ConfigurationFormProps {
  configuration?: { [key: string]: unknown };
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
  // const bridge = new JSONSchemaBridge(schema, schemaValidator);

  // const { error_handler, processors, steps, ...properties } =
  //   bridge.schema.properties;

  // no need to create form elements for error_handler, processors or steps
  // @TODO remove it after https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/pull/834 is merged
  const properties = Omit(bridge.schema.properties, [
    "error_handler",
    "processors",
    "steps",
  ]);

  let formRef: any;

  const validate = (): boolean => {
    formRef.submit();
    const errors = schemaValidator(configuration);
    return errors === null;
  };

  registerValidation(validate);

  return (
    <>
      <KameletForm
        validate={"onChangeAfterSubmit"}
        schema={bridge}
        model={configuration}
        onChangeModel={onChange}
        ref={(ref: any): void => (formRef = ref)}
        disabled={readOnly}
      >
        {Object.keys(properties as { [key: string]: unknown }).map((key) => (
          <AutoField key={key} name={key} disabled={readOnly} />
        ))}
      </KameletForm>
      {/*<AutoForm schema={bridge} onSubmit={console.log} onChange={console.log}>*/}
      {/*  <AutoFields />*/}
      {/*</AutoForm>*/}
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
          <section {...this.getNativeFormProps()} />
        </context.Provider>
      );
    }
  }
  return _;
}
const KameletForm = Auto(ValidatedQuickForm);
