import React, { lazy, FunctionComponent } from 'react';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import { NODE_CREATE_PATH, NODE_PREVIEW_PATH } from './items/others/constants';

const NodeDetailsView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "node-details-view"*/ 'views/Node/nodeDetails/NodeDetails'
      )
  )
) as FunctionComponent<any>;

const NodeCreateView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "node-details-view"*/ 'views/Node/NodeCreate/NodeCreate'
      )
  )
) as FunctionComponent<any>;

const NodeView = (props) => {
  return (
    <>
      <TransitionSwitchWrapper>
        <Route
          exact
          path={NODE_CREATE_PATH}
          render={() => <NodeCreateView {...props} />}
        />
        <Route
          exact
          path={NODE_PREVIEW_PATH}
          render={() => <NodeDetailsView {...props} />}
        />
        <Redirect to={'/'} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default NodeView;
