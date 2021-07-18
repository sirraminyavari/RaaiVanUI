import Heading from 'components/Heading/Heading';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import {
  CV_FREEZED,
  CV_RED_WARM,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import React from 'react';
import styled from 'styled-components';

const { RV_RTL } = window;
const ClassItem = ({ item, title, icon, badge, isSelected, onClick }) => {
  return (
    <Container
      onClick={() => onClick(item)}
      $isSelected={isSelected}
      RV_RTL={RV_RTL}>
      <Content>
        {/* <Icon /> */}

        <CustomHeading
          $isSelected={isSelected}
          style={{ display: 'flex', alignItems: 'center' }}>
          {title}
        </CustomHeading>
      </Content>
      <Badge $isSelected={isSelected}>{badge}</Badge>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 0.05rem;
  border-color: ${CV_FREEZED};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.75rem;
  margin: 0 0rem 1rem 0rem;
  width: 100%;
  justify-content: space-between;
  background-color: ${({ $isSelected }) => ($isSelected ? TCV_WARM : CV_WHITE)};
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
`;
const Badge = styled.div`
  background-color: ${({ $isSelected }) =>
    $isSelected ? CV_WHITE : TCV_DEFAULT};
  border-radius: 5rem;
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1;
  color: ${({ $isSelected }) => ($isSelected ? TCV_DEFAULT : CV_WHITE)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled(CheckIcon)`
  margin: 0rem 0.1rem 0 0.1rem;
  height: 1rem;
  width: 1rem;
  background-color: salmon;
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const CustomHeading = styled.div`
  color: ${({ $isSelected }) => ($isSelected ? CV_WHITE : TCV_DEFAULT)};
`;

export default ClassItem;
