import styled from 'styled-components';
import { CV_DISTANT, CV_WHITE } from 'constant/CssVariables';

const SaaSTemplateCard = () => {
  return <CardContainer></CardContainer>;
};
const CardContainer = styled.div`
  height: 12rem;
  border-radius: 0.8rem;
  border: 1px solid ${CV_DISTANT};
  background-color: ${CV_WHITE};
`;
export default SaaSTemplateCard;
