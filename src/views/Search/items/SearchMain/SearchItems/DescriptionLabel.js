import reactStringReplace from 'react-string-replace';
import Heading from 'components/Heading/Heading';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import styled from 'styled-components';

const DescriptionLabel = ({ Description } = {}) => {
  const newDesc = reactStringReplace(
    decodeBase64(Description),
    /(<b>[^(<b>)]*<\/b>)/gi,
    (match, i) => (
      <span style={{ color: TCV_DEFAULT }}>
        {match.substring(3, match.length - 4)}
      </span>
    )
  );

  return (
    <>
      {Description && (
        <SearchItemSubTitle type="h6">{newDesc}</SearchItemSubTitle>
      )}
    </>
  );
};

export default DescriptionLabel;

export const SearchItemSubTitle = styled(Heading)`
  font-weight: 300 !important;
  width: 100%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
