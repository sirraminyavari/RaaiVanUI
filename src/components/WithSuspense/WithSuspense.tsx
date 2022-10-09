import type { LazyExoticComponent } from 'react';
import { Suspense } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

/**
 * @component - HOC for lazy loading component
 * example:
 *
 * ```js
 * const LazyComponentWithLoading = WithSuspense(lazy(() => import('views/Teams/WorkspaceView')))
 * ```
 * @param Component - React lazy import
 * @param Loading - loading component e.g. LogoLoader, Shimmer or component Skeleton
 */
function WithSuspense<T = never>(
  Component: LazyExoticComponent<() => JSX.Element>,
  Loading = () => <></>
) {
  return (props: any) => {
    return (
      <Suspense
        fallback={Loading ? <Loading /> : <LogoLoader style={undefined} />}
      >
        <Component {...props} />
      </Suspense>
    );
  };
}

WithSuspense.displayName = 'WithSuspense';

export default WithSuspense;
