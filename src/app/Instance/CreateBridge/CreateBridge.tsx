import React, { VoidFunctionComponent } from "react";
import CreateBridgeMachine from "@app/Instance/CreateBridge/machines/createBridgeMachine";
import { useMachine } from "@xstate/react";

interface CreateBridgeProps {
  isOpen: boolean;
}

const CreateBridge: VoidFunctionComponent<CreateBridgeProps> = (props) => {
  const { isOpen } = props;

  return <>{isOpen && <CreatBridgeDialog />}</>;
};

export default CreateBridge;

const CreatBridgeDialog: VoidFunctionComponent = () => {
  const [current, send] = useMachine(CreateBridgeMachine);
  console.log(current, send);
  return <span>d</span>;
};
