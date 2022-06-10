/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return  */
import React from "react";
// import { AutoForm, } from "uniforms";
// import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import { schemaReloaded as schema } from "./schema";
import { createValidator } from "@utils/validator";
import { AutoField } from "uniforms-patternfly/dist/es6";
import { AutoForm, ValidatedQuickForm } from "uniforms";
import { CustomJsonSchemaBridge } from "@app/Processor/ProcessorEdit/ConfigurationForm/CustomJsonSchemaBridge";
import { useTranslation } from "react-i18next";
import { Button } from "@patternfly/react-core";

const ConfigurationForm = (): JSX.Element => {
  // const configuration = {};
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const configuration = {};

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

  // // no need to create form elements for error_handler, processors or steps
  // const properties = Omit(bridge.schema.properties, [
  //   "error_handler",
  //   "processors",
  //   "steps",
  // ]);

  let formRef: any;
  const validate = (): void => {
    formRef.submit();
  };

  return (
    <>
      <p>auto forms begins</p>
      <KameletForm
        validate={"onChangeAfterSubmit"}
        schema={bridge}
        model={configuration}
        onChangeModel={(model: any): void => console.log(model)}
        className="connector-specific pf-c-form pf-m-9-col-on-lg"
        ref={(ref: any): void => (formRef = ref)}
      >
        {Object.keys(
          bridge.schema.properties as { [key: string]: unknown }
        ).map((key) => (
          <AutoField key={key} name={key} />
        ))}
      </KameletForm>
      {/*<AutoForm schema={bridge} onSubmit={console.log} onChange={console.log}>*/}
      {/*  <AutoFields />*/}
      {/*</AutoForm>*/}
      <br />
      <Button onClick={validate}>validate</Button>
      <p>auto forms ends</p>
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
  }
  return _;
}
const KameletForm = Auto(ValidatedQuickForm);
