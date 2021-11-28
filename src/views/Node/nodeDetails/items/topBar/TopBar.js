/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import DocIcon from 'components/Icons/DocIcon';
import Eye from 'components/Icons/Edit';
import {
  CLASSES_PATH,
  USER_MORE_RELATED_TOPICS_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LastTopicsTabs from 'views/Profile/items/main/items/LastTopicsTabs';
import Creators from './Creators';
import {
  BottomRow,
  Container,
  CounterBookmarkContainer,
  RelatedTopicsContainer,
  RelatedTopicsTitle,
  ShadowButton,
  Space,
  TopRow,
  ViewCount,
} from './TopBar.style';

const { RVDic, RVAPI, RV_RTL, RVGlobal } = window || {};

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');
const likeNode = new APIHandler('CNAPI', 'Like');
const unlikeNode = new APIHandler('CNAPI', 'Unlike');

const TopBar = ({
  nodeDetails,
  nodeType,
  onApplyNodeType = () => {},
  onSideColumnClicked,
  sideColumn,
  hierarchy,
}) => {
  const { VisitsCount, Contributors } = nodeDetails || {};

  const [relatedNodes, setRelatedNodes] = useState([]);
  const [sideDetailsHover, setSideDetailsHover] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState(
    nodeDetails?.LikeStatue ? 'liked' : 'disLiked'
  );
  useEffect(() => {
    getRelatedNodes();
  }, []);
  const getRelatedNodes = () => {
    getNodeInfoAPI.fetch(
      {
        NodeID: RVGlobal?.CurrentUser?.UserID,
        In: true,
        Out: true,
        InTags: true,
        OutTags: true,
        ParseResults: true,
      },
      (response) => {
        if (response && response.NodeTypes) {
          setRelatedNodes(response);
        }
      }
    );
  };

  const { teamName, onboardingName, selectedApp, newDocMenu } = useSelector(
    (state) => ({
      teamName: state?.theme?.selectedTeam?.name,
      onboardingName: state?.onboarding?.name,
      newDocMenu: state?.onboarding?.newDocMenu,
      selectedApp: state?.selectedTeam,
    })
  );
  const extendedHierarchy = hierarchy?.map((level) => ({
    id: level?.NodeTypeID,
    title: decodeBase64(level?.TypeName),
    linkTo: `/classes/${level?.NodeTypeID}`,
  }));
  const { NodeType, Name } = nodeDetails || {};

  const breadcrumbItems = [
    { id: selectedApp?.id, title: teamName, linkTo: '/classes' },
    {
      title: decodeBase64(NodeType?.Value[0]?.Name),
      linkTo: `/classes/${NodeType?.Value[0]?.ID}`,
    },
    {
      title: decodeBase64(Name?.Value),
      linkTo: `/node/${nodeDetails?.NodeID}`,
    },
    ...extendedHierarchy,
  ];
  console.log(nodeDetails, 'nodeDetails nodeDetails');

  const getTypeName = () => {
    return nodeType?.TypeName
      ? decode(nodeType?.TypeName)
      : teamName
      ? teamName
      : '';
  };
  const onSideDetailsClick = () => {
    setSideDetailsHover(!sideDetailsHover);
    onSideColumnClicked(!sideColumn);
  };
  const onBookmarkPressed = (e) => {
    if (bookmarkStatus === 'liked') {
      unlikeNode.fetch({ NodeID: nodeDetails?.NodeID }, (response) => {
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          setBookmarkStatus('disLiked');
        }
      });
    } else if (bookmarkStatus === 'disLiked') {
      likeNode.fetch({ NodeID: nodeDetails?.NodeID }, (response) => {
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          setBookmarkStatus('liked');
        }
      });
    }
  };
  const { RVGlobal } = window;
  const avatar = RVGlobal?.CurrentUser?.ProfileImageURL;

  return (
    <Container>
      <TopRow>
        <div>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <CounterBookmarkContainer>
          <ViewCount>
            <Eye
              className="rv-default"
              color={CV_DISTANT}
              style={{ margin: '0 0.5rem 0 0.5rem' }}
            />
            {VisitsCount}
          </ViewCount>
          <Button
            onClick={onBookmarkPressed}
            style={{ borderRadius: '10rem', height: '2rem' }}
            type={'primary-o'}>
            {bookmarkStatus === 'liked' ? (
              <FilledBookmarkIcon className={'rv-default'} />
            ) : (
              <OutLineBookmarkIcon className={'rv-default'} />
            )}

            {'نشان*#*'}
          </Button>
        </CounterBookmarkContainer>
      </TopRow>

      <BottomRow>
        {relatedNodes?.TotalRelationsCount > 0 && (
          <RelatedTopicsContainer>
            <RelatedTopicsTitle>{RVDic.RelatedNode}</RelatedTopicsTitle>
            <LastTopicsTabs
              floatBox
              provideNodes={onApplyNodeType && onApplyNodeType}
              relatedNodes={relatedNodes}
            />
          </RelatedTopicsContainer>
        )}
        <Space />
        <ShadowButton
          onMouseEnter={() => setSideDetailsHover(true)}
          onMouseLeave={() => setSideDetailsHover(false)}
          onClick={onSideDetailsClick}
          $isEnabled={sideColumn || sideDetailsHover}
          className={
            sideColumn
              ? 'rv-border-distant rv-default'
              : sideDetailsHover
              ? 'rv-border-distant rv-default'
              : 'rv-border-white rv-distant'
          }>
          <DocIcon
            size={'1.5rem'}
            className={
              sideColumn
                ? 'rv-default'
                : sideDetailsHover
                ? 'rv-default'
                : 'rv-distant'
            }
          />
        </ShadowButton>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            ...(RV_RTL && { marginRight: '2rem' }),
            ...(!RV_RTL && { marginLeft: '2rem' }),
          }}>
          <Creators
            creatorsList={nodeDetails?.Contributors?.Value}
            nodeDetails={nodeDetails}
          />
        </div>
      </BottomRow>
    </Container>
  );
};
export default TopBar;
const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
