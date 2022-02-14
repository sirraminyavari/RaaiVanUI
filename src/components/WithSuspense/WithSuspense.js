import React, { Suspense } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import PropTypes from 'prop-types';

/**
 * @component - HOC for lazy loading component
 * example:
 *
 * ```js
 * const LazyComponentWithLoading = WithSuspense(lazy(() => import('views/Teams/WorkspaceView')))
 * ```
 * @param {Component} Component - React lazy import
 * @param {function} Loading - loading component e.g. LogoLoader, Shimmer or component Skeleton
 * @return {JSX.Element}
 */
const WithSuspense = (Component, Loading = undefined) => (props) => {
  return (
    <Suspense fallback={Loading ? <Loading /> : <LogoLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

export default WithSuspense;

WithSuspense.propTypes = {
  Component: PropTypes.element.isRequired,
  Loading: PropTypes.element,
};
