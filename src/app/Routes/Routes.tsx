import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import InstancePage from '@app/Instance/InstancePage/InstancePage';
import InstancesListPage from '@app/Instance/InstancesListPage/InstancesListPage';

interface RoutesProps {
  /** Used as BrowserRouter basename*/
  baseName?: string;
}

const Routes = (props: RoutesProps) => {
  const { baseName = '' } = props;

  return (
    <BrowserRouter basename={baseName}>
      <Switch>
        <Route exact path={'/'}>
          <InstancesListPage />
        </Route>
        <Route path={`/instance/:id`}>
          <InstancePage />
        </Route>
        <Route path="*">
          <>
            <p>no match</p>
          </>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
