import React from "react";
import { CamelDSLCodeEditorProps } from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";

const MockedEditor = ({
  code,
  onChange,
}: CamelDSLCodeEditorProps): JSX.Element => {
  return (
    <textarea
      value={code}
      onChange={(event): void => onChange(event.target.value)}
    />
  );
};
MockedEditor.displayName = "CamelDSLCodeEditor";
export default MockedEditor;
