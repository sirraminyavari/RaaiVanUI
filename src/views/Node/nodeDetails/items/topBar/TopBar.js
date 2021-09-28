/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import DocIcon from 'components/Icons/DocIcon';
import Eye from 'components/Icons/Edit';
import {
  USER_MORE_RELATED_TOPICS_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';
import { CV_DISTANT } from 'constant/CssVariables';
import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LastTopicsTabs from 'views/Profile/items/main/items/LastTopicsTabs';
import Creators from './Creators';
import {
  BottomRow,
  Container,
  Profile,
  ShadowButton,
  TopRow,
  ViewCount,
  CounterBookmarkContainer,
  Space,
  RelatedTopicsContainer,
  RelatedTopicsTitle,
} from './TopBar.style';

const { RVDic, RVAPI, RV_RTL, RVGlobal } = window || {};

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');

const TopBar = ({
  nodeDetails,
  nodeType,
  onApplyNodeType = () => {},
  onSideColumnClicked,
  sideColumn,
}) => {
  const { VisitsCount } = nodeDetails || {};

  const [relatedNodes, setRelatedNodes] = useState([]);
  const [sideDetailsHover, setSideDetailsHover] = useState(false);

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
        console.log(response, 'related nodes');
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
  const breadcrumbItems = [
    { id: 1, title: RVDic.Profile, linkTo: USER_WITHID_PATH },
    {
      id: 2,
      title: RVDic.RelatedNodes,
      linkTo: USER_MORE_RELATED_TOPICS_PATH,
    },
  ];
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
          <Button style={{ borderRadius: '10rem' }} type={'primary-o'}>
            <FilledBookmarkIcon className={'rv-default'} />
            {RVDic.Bookmark}
          </Button>
        </CounterBookmarkContainer>
      </TopRow>

      <BottomRow>
        <RelatedTopicsContainer>
          <RelatedTopicsTitle>موضوعات مرتبط</RelatedTopicsTitle>
          <LastTopicsTabs
            provideNodes={onApplyNodeType && onApplyNodeType}
            relatedNodes={relatedNodes}
          />
        </RelatedTopicsContainer>
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

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* <ShadowButton
            style={commonStyle}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={() => {}}
            $isEnabled={false}
            className={'rv-border-distant rv-default'}>
            <FilledBookmarkIcon size={'1.5rem'} className={'rv-default'} />
          </ShadowButton> */}
          <Creators
            creatorsList={[
              { name: 'ali', avatar: avatar },
              { name: 'vali', avatar: avatar },
            ]}
          />
        </div>
      </BottomRow>
    </Container>
  );
};
export default TopBar;
const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
