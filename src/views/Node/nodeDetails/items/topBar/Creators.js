import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import UserIcon from 'components/Icons/UserIcon/User';
import EditContributersModal from './EditContributersModal';
import UserIconIo from 'components/Icons/UserIconIo';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import PencilIcon from 'components/Icons/EditIcons/Pencil';

const { GlobalUtilities, RV_Float, RV_RTL } = window;
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
      {console.log(RV_RTL, 'RV_RTL')}
      {contributors?.length > 0 ? (
        <Maintainer
          ref={dialogRef}
          // onMouseLeave={() => sethoverCreators(false)}
          onClick={() => sethoverCreators(true)}>
          {contributors?.length > 2 ? (
            <MultiCreator>
              <Profile src={contributors[0].avatarUrl} isSaas={false} />
              <Others>{`+${contributors?.length - 1}`}</Others>
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
            className={'rv-bg-color-white rv-border-radius-half'}>
            <Button onClick={editContributors} type={'secondary-o'}>
              <CustomEditIcon size={'1rem'} />
              {'ویرایش مشارکت کنندگان'}
            </Button>
            <PerfectScrollbar style={{ maxHeight: '14rem' }}>
              {contributors?.map((x) => {
                const { name, avatarUrl, percent, id } = x || {};
                return (
                  <ListItem key={id}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Profile src={avatarUrl} />
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
            </PerfectScrollbar>
          </VerticalList>
        </Maintainer>
      ) : (
        <UserIconIo onClick={editContributors} color={CV_GRAY} />
      )}
      <EditContributersModal
        isVisible={editContModalVisible}
        nodeDetails={nodeDetails}
        onClose={() => setEditContModalVisible(false)}
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
  max-width: 2.5rem;
  max-height: 2.5rem;
  border-radius: 1.5rem;
  width: auto;
  height: auto;
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
  right: -0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${TCV_DEFAULT};
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
  margin: 0.5rem;
  background-color: #e6f4f1;
  padding: 0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1rem;
`;
