/**
 * Renders a header for every section in node page side.
 */
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { TCV_DEFAULT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';

const DocItemHeader = ({ title }) => {
  const { RV_RevFloat } = useWindow();

  return (
    <Styled.DocItemHeader>
      <Styled.ItemHeaderTitle type={'h2'}>{title}</Styled.ItemHeaderTitle>
      <ChevronIcon size={25} small dir={RV_RevFloat} color={TCV_DEFAULT} />
    </Styled.DocItemHeader>
  );
};

export default DocItemHeader;
