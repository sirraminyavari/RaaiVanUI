import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const { GlobalUtilities, RV_Float, RV_RTL } = window;
const Creators = ({ creatorsList }) => {
  const [hoverCreators, sethoverCreators] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      sethoverCreators(false);
    }

    // Bind the event listener
    document?.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document?.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      {creatorsList?.length > 0 && (
        <Maintainer
          onMouseLeave={() => sethoverCreators(false)}
          onMouseEnter={() => sethoverCreators(true)}>
          {creatorsList?.length > 2 ? (
            <MultiCreator>
              <Profile src={creatorsList[0].avatar} isSaas={false} />
              <Others>{`+${creatorsList?.length - 1}`}</Others>
            </MultiCreator>
          ) : (
            <>
              {creatorsList?.length === 2 ? (
                <MultiCreator>
                  <Profile
                    style={{ zIndex: `${GlobalUtilities.zindex.alert()}` }}
                    src={creatorsList[0].avatar}
                    isSaas={false}
                  />
                  <Profile
                    style={{
                      position: 'relative',
                      right: '-0.5rem',
                    }}
                    src={creatorsList[0].avatar}
                    isSaas={false}
                  />
                </MultiCreator>
              ) : (
                <Profile
                  style={{
                    position: 'relative',
                    right: '-0.5rem',
                  }}
                  src={creatorsList[0].avatar}
                  isSaas={false}
                />
              )}
            </>
          )}
          <VerticalList
            $hoverCreators={hoverCreators}
            className={'rv-bg-color-white rv-border-radius-half'}>
            <PerfectScrollbar style={{ maxHeight: '14rem' }}>
              {creatorsList?.map((x) => {
                const { name, avatar } = x || {};
                return (
                  <ListItem>
                    <Profile src={avatar} />
                    <ProducerName className="rv-gray">{name}</ProducerName>
                  </ListItem>
                );
              })}
            </PerfectScrollbar>
          </VerticalList>
        </Maintainer>
      )}
    </>
  );
};
export default Creators;

const Maintainer = styled.div``;
const Profile = styled.img`
  max-width: 2.5rem;
  max-height: 2.5rem;
  border-radius: 1.5rem;
  width: auto;
  height: auto;
  z-index: ${GlobalUtilities.zindex.alert()};
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
  padding: 1rem;
  min-width: 10rem;
  ${() => (RV_RTL ? 'left:2rem' : 'right:2rem')};
`;
const ProducerName = styled.div`
  /* color: #707070; */
  margin-right: 0.5rem;
`;
const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.2rem 0 0.2rem 0;
`;
