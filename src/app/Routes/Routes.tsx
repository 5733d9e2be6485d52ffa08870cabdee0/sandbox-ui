import React from "react";
import { Route, Switch } from "react-router-dom";
import InstancePage from "@app/Instance/InstancePage/InstancePage";
import InstancesListPage from "@app/Instance/InstancesListPage/InstancesListPage";
import CreateProcessorPage from "@app/Processor/CreateProcessorPage/CreateProcessorPage";
import ProcessorDetailPage from "@app/Processor/ProcessorDetailPage/ProcessorDetailPage";
import { ErrorWithDetailBoundary } from "@app/components/ErrorWithDetailBoundary/ErrorWithDetailBoundary";
import { PageNotFound } from "@app/components/PageNotFound/PageNotFound";

const Routes = (): JSX.Element => {
  return (
    <ErrorWithDetailBoundary>
      <Switch>
        <Route exact path={"/"}>
          <InstancesListPage />
        </Route>
        <Route path={`/instance/:instanceId/processor/:processorId`}>
          <ProcessorDetailPage />
        </Route>
        <Route path={`/instance/:instanceId/create-processor`}>
          <CreateProcessorPage />
        </Route>
        <Route
          path={`/instance/:instanceId/:tabName(processors|error-handling)`}
        >
          <InstancePage />
        </Route>
        <Route exact path={`/instance/:instanceId`}>
          <InstancePage />
        </Route>
        <Route path="*" component={PageNotFound} />
      </Switch>
    </ErrorWithDetailBoundary>
  );
};

export default Routes;
