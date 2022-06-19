import { call, put, select, takeLatest } from 'redux-saga/effects';
import { sidebarActions as actions } from '.';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { IReduxActionCall } from '../types';
import { provideDnDTree } from './util';
import {
  IMoveNodeTypeRequest,
  IRecoverNodeTypeRequest,
  IRemoveNodeTypeRequest,
} from './types';
import { selectThemeSlice } from '../theme/selectors';

function* getSidebarNodeTypes(values: PayloadAction<IReduxActionCall>) {
  const { done } = values.payload || {};

  const res = yield call(API.CN.getNodeTypes, {
    Icon: true,
    Count: 1000,
    Tree: true,
    CheckAccess: true,
  });

  if (!!res?.NodeTypes || !!res?.Tree) {
    done && done();
    const dndTree = provideDnDTree(res);
    yield put(actions.setSidebarNodeTypes(res.NodeTypes || []));
    yield put(actions.setSidebarTree(res.Tree));
    yield put(actions.setSidebarDnDTree(dndTree));
  }
}

function* renameSidebarNodeType(
  values: PayloadAction<{ NodeTypeID: string; Name: string }>
) {
  const { NodeTypeID, Name } = values.payload || {};
  yield call(API.CN.renameNodeType, { NodeTypeID, Name });
  yield put(actions.getSidebarNodeTypes({}));
}

function* removeSidebarNodeType(values: PayloadAction<IRemoveNodeTypeRequest>) {
  const { NodeType, RemoveHierarchy, done } = values.payload || {};

  const res = yield call(API.CN.removeNodeType, {
    NodeTypeID: NodeType?.NodeTypeID,
    RemoveHierarchy,
  });

  if (res?.Succeed) {
    done && done(NodeType);
    yield put(actions.getSidebarNodeTypes({}));
  }
}

function* recoverSidebarNodeType(
  values: PayloadAction<IRecoverNodeTypeRequest>
) {
  const { NodeTypeID, ChildrenIDs } = values.payload || {};
  const res = yield call(API.CN.recoverNodeType, { NodeTypeID });

  if (res?.Succeed) {
    if ((ChildrenIDs || []).length) {
      yield call(API.CN.moveNodeType, {
        NodeTypeIDs: ChildrenIDs,
        ParentID: NodeTypeID,
      });
    }

    yield put(actions.getSidebarNodeTypes({}));
  }
}

function* moveSidebarNodeType(values: PayloadAction<IMoveNodeTypeRequest>) {
  const { NodeTypeID, ParentID } = values.payload || {};

  const { selectedTeam } = yield select(selectThemeSlice);

  //! Check if item moved to root or not. (root of the tree is Team)
  const parentId = ParentID === selectedTeam.id ? undefined : ParentID;

  yield call(API.CN.moveNodeType, {
    NodeTypeID,
    ParentID: parentId,
  });

  yield put(actions.getSidebarNodeTypes({}));
}

function* reorderSidebarNodeTypes(
  values: PayloadAction<{ NodeTypeIDs: string[] }>
) {
  const { NodeTypeIDs } = values.payload || {};
  yield call(API.CN.setNodeTypesOrder, { NodeTypeIDs });
  yield put(actions.getSidebarNodeTypes({}));
}

function* getFavoriteNodesCount() {
  const res = yield call(API.CN.getFavoriteNodesCount);

  const totalCount = (res?.NodeTypes || []).reduce(
    (acc, cur) => acc + cur.Count,
    0
  );

  yield put(actions.setFavoriteNodesCount(totalCount));
}

function* checkAuthority(values: PayloadAction<{ Permissions: string[] }>) {
  const res = yield call(API.Privacy.checkAuthority);

  yield put(
    actions.setUnderMenuList(
      (values.payload?.Permissions || []).filter((p) => !!(res || {})[p])
    )
  );
}

function* getConfigPanels() {
  const res = yield call(API.Privacy.checkAuthority);

  yield put(
    actions.setConfigPanels(Object.keys(res || {}).filter((k) => !!res[k]))
  );
}

export function* sidebarSaga() {
  yield takeLatest(actions.getSidebarNodeTypes.type, getSidebarNodeTypes);
  yield takeLatest(actions.renameSidebarNodeType.type, renameSidebarNodeType);
  yield takeLatest(actions.removeSidebarNodeType.type, removeSidebarNodeType);
  yield takeLatest(actions.recoverSidebarNodeType.type, recoverSidebarNodeType);
  yield takeLatest(actions.moveSidebarNodeType.type, moveSidebarNodeType);
  yield takeLatest(
    actions.reorderSidebarNodeTypes.type,
    reorderSidebarNodeTypes
  );
  yield takeLatest(actions.getFavoriteNodesCount.type, getFavoriteNodesCount);
  yield takeLatest(actions.checkAuthority.type, checkAuthority);
  yield takeLatest(actions.getConfigPanels.type, getConfigPanels);
}
