import React, { useState } from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import AtIcon from 'components/Icons/AtIcon';
import { CV_GRAY } from 'constant/CssVariables';

const { RVDic } = window;

const SubjectField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onClose = () => {
    setIsVisible(false);
  };
  return (
    <>
      <Modal
        onClose={onClose}
        contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '90%'}
        style={{ padding: '0', height: '50%' }}
        stick
        show={isVisible}>
        <ItemSelection onClose={() => setIsVisible(false)} />
      </Modal>
      <FormCell iconComponent={<AtIcon color={CV_GRAY} />} title={decodeTitle}>
        <Select onClick={() => setIsVisible(true)}>{RVDic.NodeSelect}</Select>
      </FormCell>
    </>
  );
};

export default SubjectField;

const Select = styled.div`
  cursor: pointer;
`;
