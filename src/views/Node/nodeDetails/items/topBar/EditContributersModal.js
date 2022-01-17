import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Modal from 'components/Modal/Modal';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ContributorItem from './ContributorItem';

const SetContributors = new APIHandler('CNAPI', 'SetContributors');
const { RVDic } = window;
const EditContributersModal = ({
  isVisible,
  onClose,
  nodeDetails,
  recentContributors,
  onUpdateContributors,
}) => {
  const [contList, setContList] = useState(recentContributors);
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isVisible]);
  useEffect(() => {
    console.log(nodeDetails, 'nodeDetails');
    // setTitle(decodeBase64(nodeDetails?.Name?.Value));
    const contributers = nodeDetails?.Contributors?.Value?.map((x) => {
      return {
        avatarUrl: x?.ProfileImageURL,
        id: x?.UserID,
        name: decodeBase64(x?.FirstName) + ' ' + decodeBase64(x?.LastName),
        percent: +x?.Share,
      };
    });

    setContList(contributers);
  }, [nodeDetails?.Contributors?.Value]);
  const onByPeople = (event) => {
    console.log(!!contList.find((x) => x.id === event.id), 'people');

    const newList = !!contList.find((x) => x.id === event.id)
      ? contList
      : [...contList, { ...event, percent: 0 }];
    setContList(newList);
  };
  const updatePercent = ({ item, percent }) => {
    const readyToUpdate = contList?.map((x) =>
      x.id === item.id ? { ...x, percent: percent } : x
    );
    const filledContPercent = readyToUpdate?.reduce((x, y) => ({
      percent: +x?.percent + y?.percent,
    }))?.percent;

    if (filledContPercent <= 100) {
      setContList(readyToUpdate);
    }
  };
  const onRemove = (event) => {
    const newList = contList.filter((x) => x.id !== event.id);

    setContList(newList);
  };
  const onSave = () => {
    const { NodeID } = nodeDetails;

    const totalPercent = contList?.reduce((y, x) => ({
      percent: y?.percent + x?.percent,
    }));

    if (totalPercent?.percent === 100) {
      SetContributors.fetch(
        {
          NodeID: NodeID,

          Contributors: contList?.map((x) => `${x.id}:${x.percent}`).join('|'),
        },
        (res) => {
          console.log(res, 'res');
          if (res.Succeed === 'OperationCompletedSuccessfully') {
            alert(RVDic.ChangesOfNSaved.replace('[n]', RVDic.MainAuthors), {
              Timeout: 1000,
            });
          }
          onUpdateContributors(contList);
          onClose();
        }
      );
    } else {
      alert(RVDic.Confirms.CollaborationSumLimit, {
        Timeout: 1000,
      });
    }
  };

  const changeOccured = () => {
    const contributers = nodeDetails?.Contributors?.Value?.map((x) => {
      return {
        avatarUrl: x?.ProfileImageURL,
        id: x?.UserID,
        name: decodeBase64(x?.FirstName) + ' ' + decodeBase64(x?.LastName),
        percent: +x?.Share,
      };
    });

    return _.isEqual(contList, recentContributors);
  };

  return (
    <Modal
      onClose={onClose}
      contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '35.7rem'}
      stick
      style={{ padding: 0 }}
      show={isVisible}>
      <Top className="rv-border-radius-half">
        <Header type="h2">
          {RVDic.EditN.replace('[n]', RVDic.MainAuthors)}
        </Header>
        <Close onClick={onClose} />
      </Top>
      <Maintainer className="rv-border-radius-half">
        <Main>
          <Title>
            {RVDic.Checks.EnterTheShareOfParticipationForEachAuthor}
          </Title>
          {contList?.map((x) => (
            <ContributorItem
              item={x}
              setPercent={updatePercent}
              onRemove={onRemove}
            />
          ))}
        </Main>
        <Bottom>
          {console.log(contList, 'contList')}
          <BottomMain>
            <PeoplePicker
              onByMe={() => {}}
              onBlur={() => {}}
              onByPeople={onByPeople}
              isByMe={false}
              pickedPeople={contList}
              onVisible={() => {}}
              multi={true}
              direction={'bottom'}
              buttonComponent={
                <Button style={{ height: '3rem' }} type={'secondary-o'}>
                  {RVDic.AddN.replace('[n]', RVDic.Author)}
                </Button>
              }
            />

            <Button
              onClick={onSave}
              style={{ width: '6.5rem', height: '3rem' }}
              type={'primary'}
              disable={changeOccured()}>
              {RVDic.Save}
            </Button>
          </BottomMain>
          <Button
            onClick={onClose}
            style={{ width: '6.5rem', height: '3rem' }}
            type={'negative-o'}>
            {RVDic.Return}
          </Button>
        </Bottom>
      </Maintainer>
    </Modal>
  );
};

export default EditContributersModal;

const Maintainer = styled.div`
  width: 35.5rem;
  height: 37.5rem;
  display: flex;
  background-color: ${CV_WHITE};
  padding: 1rem 2rem 1rem 2rem;
  flex-direction: column;
`;
const Title = styled.div`
  display: flex;
  color: ${CV_DISTANT};
  /* padding: 0 2rem 0 2rem; */
`;
const Header = styled.div`
  display: flex;
  color: ${TCV_DEFAULT};
  padding: 0 2rem 0 2rem;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Top = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  background-color: ${CV_GRAY_LIGHT};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem 0 1rem;
  border-top-left-radius: 1rem;
`;
const Bottom = styled.div`
  height: 4rem;
  width: 100%;

  display: flex;
  background-color: ${CV_WHITE};
  justify-content: space-between;
`;
const BottomMain = styled.div`
  display: flex;
  width: 50%;
  background-color: ${CV_WHITE};
  justify-content: space-between;

  flex-direction: row;
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  background-color: ${CV_WHITE};
  flex-grow: 1;
  flex-direction: column;
`;
const Close = styled(CloseIcon)`
  color: ${CV_DISTANT};
  :hover {
    color: ${CV_RED};
  }
`;
