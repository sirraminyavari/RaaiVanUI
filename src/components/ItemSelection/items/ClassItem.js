import Heading from 'components/Heading/Heading';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import { CV_FREEZED, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import React from 'react';
import styled from 'styled-components';

const { RV_RTL } = window;
const ClassItem = ({ title, icon, badge }) => {
  return (
    <Container RV_RTL={RV_RTL}>
      <Content>
        {/* <Icon /> */}

        <Heading style={{ display: 'flex', alignItems: 'center' }} type={'h6'}>
          {title}
        </Heading>
      </Content>
      <Badge>{badge}</Badge>
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
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
`;
const Badge = styled.div`
  background-color: ${TCV_DEFAULT};
  border-radius: 5rem;
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1;
  color: ${CV_WHITE};
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

export default ClassItem;
