const getParameterValue = (parameter: unknown): string => {
  if (typeof parameter == "string") {
    return parameter;
  } else if (typeof parameter == "number") {
    return parameter.toString();
  } else {
    return "Such complex parameter value is not supported yet";
  }
};

export { getParameterValue };
