import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import EditContributersModal from './EditContributersModal';
import UserIconIo from 'components/Icons/UserIconIo';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import * as Styles from './TopBar.style';

const { GlobalUtilities, RV_RTL, RVDic } = window;
const Creators = ({ creatorsList, nodeDetails }) => {
  const dialogRef = useRef();
  const [hoverCreators, sethoverCreators] = useState(false);
  const [editContModalVisible, setEditContModalVisible] = useState(false);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        sethoverCreators(false);
      }
    }

    // Bind the event listener
    document?.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document?.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const contributers = nodeDetails?.Contributors?.Value?.map((x) => {
      return {
        avatarUrl: x?.ProfileImageURL,
        id: x?.UserID,
        name: decodeBase64(x?.FirstName) + ' ' + decodeBase64(x?.LastName),
        percent: +x?.Share,
      };
    });

    setContributors(contributers);
  }, [creatorsList]);

  const editContributors = () => {
    console.log('edit cont');
    setEditContModalVisible(true);
  };
  return (
    <>
      {contributors?.length > 0 ? (
        <Maintainer
          ref={dialogRef}
          // onMouseLeave={() => sethoverCreators(false)}
          onClick={() => sethoverCreators(true)}
        >
          {contributors?.length > 2 ? (
            <MultiCreator>
              <Profile src={contributors[0].avatarUrl} isSaas={false} />
              <Others
                style={{
                  ...(RV_RTL && { right: '-0.5rem' }),
                  ...(!RV_RTL && { left: '-0.5rem' }),
                }}
              >{`+${contributors?.length - 1}`}</Others>
            </MultiCreator>
          ) : (
            <>
              {contributors?.length === 2 ? (
                <MultiCreator>
                  <Profile
                    // style={{ zIndex: `${GlobalUtilities.zindex.alert()}` }}
                    src={contributors[0].avatarUrl}
                    isSaas={false}
                  />
                  <Profile
                    style={{
                      position: 'relative',
                      ...(RV_RTL && { right: '-0.5rem' }),
                      ...(!RV_RTL && { left: '-0.5rem' }),
                    }}
                    src={contributors[1].avatarUrl}
                    isSaas={false}
                  />
                </MultiCreator>
              ) : (
                <Profile
                  style={{
                    position: 'relative',
                    right: '-0.5rem',
                  }}
                  src={contributors[0].avatarUrl}
                  isSaas={false}
                />
              )}
            </>
          )}
          <VerticalList
            $hoverCreators={hoverCreators}
            className={'rv-bg-color-white rv-border-radius-half'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CustomEditIcon color={TCV_DEFAULT} size={'1rem'} />

              <Button onClick={editContributors} type={'secondary-o'}>
                {RVDic.EditN.replace('[n]', RVDic.MainAuthors)}
              </Button>
            </div>
            <ScrollBarProvider style={{ maxHeight: '14rem' }}>
              {contributors?.map((x) => {
                const { name, avatarUrl, percent, id } = x || {};
                return (
                  <ListItem key={id}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Profile small src={avatarUrl} />
                      <ProducerName className="rv-gray">
                        {name.length > 20
                          ? `${name.substring(0, 20)}...`
                          : name}
                      </ProducerName>
                    </div>
                    <ContributePercent>{`%${percent}`}</ContributePercent>
                  </ListItem>
                );
              })}
            </ScrollBarProvider>
          </VerticalList>
        </Maintainer>
      ) : (
        <Styles.NodeTopBarShadowButton
          onClick={editContributors}
          active={editContModalVisible}
        >
          <UserIconIo size={'1.5rem'} />
        </Styles.NodeTopBarShadowButton>
      )}
      <EditContributersModal
        isVisible={editContModalVisible}
        nodeDetails={nodeDetails}
        onClose={() => {
          document.body.style.overflow = 'unset';
          setEditContModalVisible(false);
        }}
        onUpdateContributors={setContributors}
        recentContributors={contributors}
      />
    </>
  );
};
export default Creators;

const Maintainer = styled.div`
  cursor: pointer;
`;
const Profile = styled.img`
  ${({ small }) => `width: ${small ? '2.1rem' : '2.6rem'};`}

  aspect-ratio: 1;
  border-radius: 1.5rem;

  border-width: 0.09rem;
  border-style: solid;
  border-color: ${CV_WHITE};
  // z-index: ${GlobalUtilities.zindex.alert()};
`;
const Others = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1.5rem;
  background-color: #e6f4f1;
  position: relative;
  inset-inline-start: -0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${TCV_DEFAULT};
  direction: ltr;
`;
const MultiCreator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const VerticalList = styled.div`
  display: ${({ $hoverCreators }) => ($hoverCreators ? 'flex' : 'none')};
  flex-direction: column;
  background-color: ${CV_WHITE};
  position: absolute;
  margin-top: 1rem;
  box-shadow: 1px 3px 20px ${CV_DISTANT};
  padding: 0 1rem 1rem 1rem;
  min-width: 10rem;
  ${() => (RV_RTL ? 'left:2rem' : 'right:2rem')};
  z-index: 1;
`;
const ProducerName = styled.div`
  /* color: #707070; */
  margin-right: 0.5rem;
`;
const ContributePercent = styled.div`
  color: ${TCV_DEFAULT};
`;
const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.2rem 0 0.2rem 0;
  justify-content: space-between;
`;
const CustomEditIcon = styled(PencilIcon)`
  background-color: #e6f4f1;
  padding: 0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1rem;
`;
