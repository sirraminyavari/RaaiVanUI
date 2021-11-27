import TrashIcon from 'components/Icons/TrashIcon';
import Input from 'components/Inputs/Input';
import { RED_HOVER } from 'const/Colors';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import React, { useState } from 'react';
import styled from 'styled-components';

const { RVDic, RV_RTL } = window;

const ContributorItem = ({ item, onRemove, setPercent }) => {
  const [showPercent, setShowPercent] = useState(false);
  console.log(item, '&&&&&&');
  return (
    <Container>
      <Profile src={item.avatarUrl} />
      <Title>{item?.name}</Title>

      <MainSide>
        <ContributeContainer>
          {/* <Percent>{`%${item?.percent}`}</Percent> */}

          <ContributePercent
            onMouseOver={() => {
              setShowPercent(true);
              console.log('mouse entrer');
            }}
            onMouseLeave={() => setShowPercent(false)}
            percent={item.percent / 100}></ContributePercent>
        </ContributeContainer>

        <CustomInput
          style={{
            width: '4.2rem',
            textAlign: 'center',
          }}
          type="number"
          placeholder={item?.percent ? '%' + item?.percent : RVDic.Percent}
          onChange={(event) =>
            setPercent({ percent: +event.target.value, item: item })
          }
          value={item?.percent}
        />
        <CustomTrash size={'3rem'} onClick={() => onRemove(item)} />
      </MainSide>
    </Container>
  );
};

export default ContributorItem;

const Title = styled.div`
  display: flex;
  flex-grow: 1;
  color: ${CV_GRAY};
`;
const Profile = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  margin: ${() => (!RV_RTL ? `0 0.5rem 0 0` : `0 0 0 0.5rem`)};
`;
const CustomInput = styled(Input)`
  ::placeholder {
    text-align: center;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0 0.5rem 0;
  height: 3rem;
`;
const ContributeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  min-width: 8rem;
`;
const ContributePercent = styled.div`
  height: 0.5rem;
  border-radius: 1rem;
  width: ${({ percent }) => `${percent * 6}rem`};
  background-color: ${({ percent }) =>
    `${percent > 0.5 ? TCV_DEFAULT : CV_GRAY}`};
  margin: 0 1rem 0 1rem;
`;
const CustomTrash = styled(TrashIcon)`
  color: ${CV_DISTANT};
  :hover {
    color: ${CV_RED};
  }
`;
const MainSide = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
