import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OBInstancePage from '@app/OBInstance/OBInstancePage/OBInstancePage';
import OBInstancesListPage from '@app/OBInstance/OBInstancesListPage/OBInstancesListPage';

interface OBRoutesProps {
  /** Used as BrowserRouter basename*/
  baseName?: string;
}

const OBRoutes = (props: OBRoutesProps) => {
  const { baseName = '' } = props;

  return (
    <BrowserRouter basename={baseName}>
      <Switch>
        <Route exact path={'/'}>
          <OBInstancesListPage />
        </Route>
        <Route path={`/instance/:id`}>
          <OBInstancePage />
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

export default OBRoutes;
