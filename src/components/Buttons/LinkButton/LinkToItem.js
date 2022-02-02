import { Link } from 'react-router-dom';
import { BO_RADIUS_HALF } from 'constant/constants';
import { CV_DISTANT, TCV_DEFAULT, TCV_VERY_SOFT } from 'constant/CssVariables';
import styled from 'styled-components';
import { BO_DISTANT } from 'constant/Colors';
import Avatar from 'components/Avatar/Avatar';
import { Ellipsis } from 'constant/StyledCommonCss';

/**
 * @description a button that forwards user to a NodePage
 * @param {string} id the id of the Node or Item
 * @param {string} iconUrl the iconUrl of the Node
 * @param {string} title the title of the node
 */
const LinkToItem = ({ id, iconUrl, title } = {}) => {
  const { RVAPI } = window;

  return (
    <Container as={Link} to={RVAPI.NodePageURL({ NodeID: id })}>
      {iconUrl && (
        <IconWrapper>
          <Avatar
            url={iconUrl}
            imageStyles={{ width: '1.2rem', height: '1.2rem' }}
          />
        </IconWrapper>
      )}
      <Label>{title}</Label>
    </Container>
  );
};

export default LinkToItem;

const Container = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0.2rem 0.3rem;
  font-size: 0.7rem;
  gap: 0.5rem;

  :hover {
    background-color: ${TCV_VERY_SOFT};
  }
`;

const IconWrapper = styled.div.attrs({
  className: `${BO_DISTANT}`,
})`
  flex: 0 0 auto;
  padding-inline-end: 0.3rem;
  border-top: none;
  border-bottom: none;
  border-inline-start: none;
`;

const Label = styled.div`
  flex: 1 1 auto;
  color: ${TCV_DEFAULT};
  ${Ellipsis}
`;
