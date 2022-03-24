import React from "react";
import { Route, Switch } from "react-router-dom";
import InstancePage from "@app/Instance/InstancePage/InstancePage";
import InstancesListPage from "@app/Instance/InstancesListPage/InstancesListPage";
import CreateProcessor from "@app/Processor/CreateProcessor/CreateProcessor";

const Routes = () => {
  return (
    <Switch>
      <Route exact path={"/"}>
        <InstancesListPage />
      </Route>
      <Route path={`/instance/:id`}>
        <InstancePage />
      </Route>
      <Route path={`/processor/create`}>
        <CreateProcessor />
      </Route>
      <Route path="*">
        <>
          <p>no match</p>
        </>
      </Route>
    </Switch>
  );
};

export default Routes;
