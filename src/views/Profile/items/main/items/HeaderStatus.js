import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import {
  getFavoriteNodesCount,
  getIntellectualPropertiesCount,
} from 'apiHelper/apiFunctions';
import useWindowContext from 'hooks/useWindowContext';
import { useSidebarSlice } from 'store/slice/sidebar';

const HeaderStatus = ({ user, relatedNodesCount = 0 }) => {
  const dispatch = useDispatch();
  const { RVGlobal, RVDic } = useWindowContext();
  const [favoriteNodes, setFavoriteNodes] = useState(0);
  const [intellectualCounts, setIntellectualCounts] = useState(0);
  const userId = user?.UserID;

  const { actions: sidebarActions } = useSidebarSlice();

  useEffect(() => {
    //! Get favorite nodes count.
    getFavoriteNodesCount(userId)
      .then((res) => {
        const favoriteNodesCount = ((res || {}).NodeTypes || []).reduce(
          (acc, cur) => acc + cur.Count,
          0
        );
        //! Update the profile count.
        setFavoriteNodes(favoriteNodesCount);
        //! If current user is the profile owner, then update the sidebar count too.
        if (RVGlobal.CurrentUser.UserID === userId) {
          dispatch(sidebarActions.setFavoriteNodesCount(favoriteNodesCount));
        }
      })
      .catch((err) => console.log(err));

    //! Get intellectual count.
    getIntellectualPropertiesCount(userId)
      .then((res) => {
        const intellectualCount = ((res || {}).NodeTypes || []).reduce(
          (acc, cur) => acc + cur.Count,
          0
        );
        setIntellectualCounts(intellectualCount);
      })
      .catch((err) => console.log(err));

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      setFavoriteNodes(0);
      setIntellectualCounts(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.HeaderStatusContainer>
      <Styled.StatusWrapper>
        <span>{RVDic.NumberOfN.replace('[n]', RVDic.Nodes)}</span>
        <Styled.StatusCount>{intellectualCounts}</Styled.StatusCount>
      </Styled.StatusWrapper>
      <Styled.StatusWrapper
        style={{
          borderLeft: `1px solid ${CV_DISTANT}`,
          borderRight: `1px solid ${CV_DISTANT}`,
        }}
      >
        <span>{RVDic.NumberOfN.replace('[n]', RVDic.RelatedNodes)}</span>
        <Styled.StatusCount>{relatedNodesCount}</Styled.StatusCount>
      </Styled.StatusWrapper>
      <Styled.StatusWrapper>
        <span>{RVDic.NumberOfN.replace('[n]', RVDic.BookmarkedSubjects)}</span>
        <Styled.StatusCount>{favoriteNodes}</Styled.StatusCount>
      </Styled.StatusWrapper>
    </Styled.HeaderStatusContainer>
  );
};

export default HeaderStatus;
