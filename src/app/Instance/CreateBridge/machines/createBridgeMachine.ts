import { createMachine } from "xstate";

const createBridgeMachine = createMachine({
  id: "createBridge",
  initial: "idle",
  states: {
    idle: {},
    open: {},
    selected: {},
  },
});

export default createBridgeMachine;
