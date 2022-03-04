import React from 'react';
import OBRoutes from '@app/OBRoutes/OBRoutes';
import { useBasename } from '@rhoas/app-services-ui-shared';

const AppFederated = () => {
  const basename = useBasename();
  return <OBRoutes baseName={basename?.getBasename()} />;
};

export default AppFederated;
