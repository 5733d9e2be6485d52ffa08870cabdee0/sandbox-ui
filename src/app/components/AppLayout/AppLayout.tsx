import React, { FunctionComponent, ReactNode, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import {
  Button,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageSidebar,
} from "@patternfly/react-core";

import logo from "./Patternfly-Logo.svg";
import { logout } from "../../../Keycloak";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(true);
  const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);

  const onNavToggleMobile = () => {
    setIsNavOpenMobile(!isNavOpenMobile);
  };
  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };
  const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
    setIsMobileView(props.mobileView);
  };

  const HeaderTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <Button variant="tertiary" onClick={() => logout()}>
          Logout
        </Button>
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );

  const Header = (
    <PageHeader
      logo={<LogoImg />}
      showNavToggle
      isNavOpen={isNavOpen}
      headerTools={HeaderTools}
      onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
      aria-label={"global_navigation"}
    />
  );

  const Navigation = (
    <Nav
      id="nav-primary-simple"
      role="navigation"
      theme="dark"
      aria-label={"global"}
    >
      <NavList id="nav-list-simple">
        <NavItem id={"connectors"}>
          <NavLink to={"/"} activeClassName="pf-m-current">
            SmartEvents
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
  const Sidebar = (
    <PageSidebar
      theme="dark"
      nav={Navigation}
      isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen}
    />
  );
  return (
    <Page
      mainContainerId="primary-app-container"
      role="main"
      header={Header}
      sidebar={Sidebar}
      onPageResize={onPageResize}
    >
      {children}
    </Page>
  );
};

function LogoImg() {
  const history = useHistory();
  function handleClick() {
    history.push("/");
  }
  return <img src={logo} onClick={handleClick} alt="PatternFly Logo" />;
}
