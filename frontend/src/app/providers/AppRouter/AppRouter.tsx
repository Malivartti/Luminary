import { AppRoutePages, useAccessPages } from '@shared/config/router';
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const AppRouter = observer(() => {
  const accessPages = useAccessPages(AppRoutePages);

  return (
    <Suspense>
      <Routes>
        {
          ...accessPages.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={element}
            />
          ))
        }
      </Routes>
    </Suspense>
  );
});

export default AppRouter;