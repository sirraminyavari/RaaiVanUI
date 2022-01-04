import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TC_DEFAULT } from 'constant/Colors';
import { CV_GRAY_DARK, CV_RED } from 'constant/CssVariables';

const TextContainer = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: ${({ bottomMargin }) => (bottomMargin ? bottomMargin : '')};
  color: ${({ color }) => (color ? color : 'unset')};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`;
/**
 *
 * Delete Confirm Message component
 *
 * @param {object} props - DeleteConfirmMSG component props
 * @param {string} [props.title=""] - Message title
 * @param {JSX.Element} props.Icon - JSX icon component
 * @param {string} [props.question=""] - Message question
 * @param {string} [props.warning=""] - Message warning
 *
 * @return {JSX.Element} The delete confirmation texts.
 */
const DeleteConfirmMSG = ({ title, Icon, question, warning }) => {
  return (
    <>
      <TextContainer bottomMargin="1.8rem">
        <Icon
          className={TC_DEFAULT}
          style={{ marginInlineEnd: '0.3rem' }}
          size="1.2rem"
        />
        {title}
      </TextContainer>
      <TextContainer color={CV_GRAY_DARK} bold bottomMargin="1rem">
        {question}
      </TextContainer>
      <TextContainer color={CV_RED}>{warning}</TextContainer>
    </>
  );
};

DeleteConfirmMSG.propTypes = {
  title: PropTypes.string,
  Icon: PropTypes.element,
  question: PropTypes.string,
  warning: PropTypes.string,
};
DeleteConfirmMSG.defaultProps = {
  title: '',
  Icon: () => <></>,
  question: '',
  warning: '',
};

export default DeleteConfirmMSG;
