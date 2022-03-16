import React from 'react';
import Routes from '@app/Routes/Routes';
import { useBasename } from '@rhoas/app-services-ui-shared';

const AppFederated = () => {
  const basename = useBasename();
  return <Routes baseName={basename?.getBasename()} />;
};

export default AppFederated;
