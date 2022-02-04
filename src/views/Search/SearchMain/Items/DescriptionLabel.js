import reactStringReplace from 'react-string-replace';
import Heading from 'components/Heading/Heading';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';

const DescriptionLabel = ({ ItemType, Description } = {}) => {
  const newDesc = reactStringReplace(
    decodeBase64(Description),
    /(<b>[^(<b>)]*<\/b>)/gi,
    (match, i) => (
      <span key={i} style={{ color: TCV_DEFAULT }}>
        {match.substring(3, match.length - 4)}
      </span>
    )
  );

  return (
    <>
      {Description && ItemType !== 'User' && (
        <Heading type="h6">{newDesc}</Heading>
      )}
    </>
  );
};

export default DescriptionLabel;
