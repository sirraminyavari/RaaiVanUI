import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_WHITE,
} from 'constant/CssVariables';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { encodeBase64 } from '../../../../helpers/helpers';

const SaaSTemplateCard = ({ TypeName, IconURL, NodeTypeID }) => {
  const history = useHistory();
  const { path } = useRouteMatch();

  const handleCardClick = () => {
    history.push(`${path}/${NodeTypeID}/${encodeBase64(TypeName)}`);
  };
  return (
    <CardContainer onClick={handleCardClick}>
      <Image src={IconURL} alt={TypeName} />
      <Title>{TypeName}</Title>
      <Subtitle>
        {
          'به دقیق‌ترین شکل ممکن سرمایه ارتباطی تیم‌تان را .حفظ کنید و آن را ارتقاء دهید'
        }
      </Subtitle>
    </CardContainer>
  );
};
const CardContainer = styled.div`
  height: 12rem;
  border-radius: 0.8rem;
  border: 1px solid ${CV_DISTANT};
  background-color: ${CV_WHITE};
  padding: 1rem;
  cursor: pointer;
`;
const Image = styled.img`
  width: 2.8rem;
  height: 2.8rem;
`;
const Title = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY_DARK};
  font-weight: 400;
  margin: 1rem 0;
`;
const Subtitle = styled.div`
  font-size: 0.8rem;
  color: ${CV_GRAY};
`;
export default SaaSTemplateCard;