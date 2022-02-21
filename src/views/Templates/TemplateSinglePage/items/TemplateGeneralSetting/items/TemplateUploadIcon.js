import styled from 'styled-components';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import { CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import PencilIcon from 'components/Icons/EditIcons/Pencil';

const TemplateUploadIcon = () => {
  const { RV_RTL } = useWindow();
  return (
    <Container>
      <Icon>
        <ImageIcon size={54} />

        <AddButton rtl={RV_RTL}>
          <PencilIcon color={CV_WHITE} size={18} />
        </AddButton>
      </Icon>
    </Container>
  );
};
const Container = styled.div`
  height: 8rem;
  width: 8rem;
`;

const Icon = styled.div`
  position: relative;
  ${FLEX_CCC};
  height: 8rem;
  width: 8rem;
  border-radius: 100%;
  background-color: #eef1f5;
  color: ${TCV_DEFAULT};
`;

const AddButton = styled.div`
  ${FLEX_CCC};
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  color: ${CV_WHITE};
  background-color: ${TCV_DEFAULT};
  position: absolute;
  ${({ rtl }) => (rtl ? 'left: 0' : 'right: 0;')};
  bottom: 0;
  transition: all 120ms linear;
  visibility: hidden;
  opacity: 0;
  cursor: pointer;

  ${Icon}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

export default TemplateUploadIcon;
