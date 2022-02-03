import Avatar from 'components/Avatar/Avatar';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import styled from 'styled-components';

const ItemAvatar = ({ ItemType, IconURL, Title, Type, isLink }) => {
  const getIconElement = () => {
    switch (ItemType) {
      case 'Node':
        return (
          <StyledAvatar
            url={IconURL}
            imageStyles={{ width: '3.5rem', height: '3.5rem' }}
          />
        );
      case 'User':
        return (
          <StyledAvatar
            url={IconURL}
            isLink={isLink}
            imageStyles={{ width: '3rem', height: '3rem' }}
          />
        );
      case 'File':
        return IconURL ? (
          <img src={IconURL} alt={decodeBase64(Title)} width={35} />
        ) : (
          <FileFormatIcon
            format={decodeBase64(Type)}
            size={33}
            color={CV_DISTANT}
          />
        );
      case 'Question':
        return <QuestionIcon format="word" size="3rem" color={CV_DISTANT} />;
      default:
        return <></>;
    }
  };

  return getIconElement();
};

export default ItemAvatar;

const StyledAvatar = styled(Avatar)`
  ${({ isLink }) => (isLink ? 'cursor: pointer;' : '')}
  width: 3.5rem;
  height: 3.5rem;
  justify-content: center;
`;
