import React, { VoidFunctionComponent } from "react";
import { PageSection, PageSectionProps } from "@patternfly/react-core";

interface ErrorHandlingPageSectionProps {
  children: React.ReactNode;
}

// To make sure the Handling tab layout works properly, all the PageSections inside it
// must have the 'isFilled' prop and their height must be explicitly set to 100%

const ErrorHandlingPageSection: VoidFunctionComponent<
  ErrorHandlingPageSectionProps & Pick<PageSectionProps, "variant" | "padding">
> = (props) => {
  const { children, ...rest } = props;
  return (
    <PageSection isFilled className={"pf-u-h-100"} {...rest}>
      {children}
    </PageSection>
  );
};

export default ErrorHandlingPageSection;
