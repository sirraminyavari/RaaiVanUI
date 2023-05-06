import { RVVariantProp, Typography } from '@cliqmind/rv-components';
import Button from 'components/Buttons/Button';
import { decodeBase64 } from 'helpers/helpers';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useTemplateContext } from './TemplateProvider';

const TemplateSinglePageTopMenu = ({ templatePath }) => {
  const history = useHistory();
  const { Title, NodeTypeID } = useTemplateContext();
  const gotoPath = (path) => () => history.push(path);
  return (
    <Container>
      <Typography type="H3">{decodeBase64(Title)}</Typography>
      <NavContainer>
        <NavButton
          active={history.location.pathname.endsWith('/basic')}
          onClick={gotoPath(`${templatePath.replace(':id', NodeTypeID)}/basic`)}
        >
          General
        </NavButton>
        <NavButton
          active={history.location.pathname.endsWith('/forms')}
          onClick={gotoPath(`${templatePath.replace(':id', NodeTypeID)}/forms`)}
        >
          Form builder
        </NavButton>
        <NavButton
          active={history.location.pathname.endsWith('/advanced')}
          onClick={gotoPath(
            `${templatePath.replace(':id', NodeTypeID)}/advanced`
          )}
        >
          Advanced
        </NavButton>
        <NavButton
          active={history.location.pathname.endsWith('/items')}
          onClick={gotoPath(`${templatePath.replace(':id', NodeTypeID)}/items`)}
        >
          Items
        </NavButton>
      </NavContainer>
      <Button
        variant={RVVariantProp.white}
        onClick={gotoPath(`${templatePath.replace(':id', '')}`)}
      >
        Back to templates
      </Button>
    </Container>
  );
};
TemplateSinglePageTopMenu.displayName = 'TemplateSinglePageTopMenu';
export default TemplateSinglePageTopMenu;

const Container = styled.div`
  padding-inline: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
const NavContainer = styled.div`
  padding-inline: 2rem;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
const NavButton = styled(Button).attrs({ variant: RVVariantProp.white })`
  box-shadow: none !important;
  background-color: transparent !important;
  position: relative;
  color: ${({ active }) => (active ? 'hsl(var(--base))' : '')};
  ::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 0.25rem;
    background: ${({ active }) =>
      active ? 'hsl(var(--base))' : 'transparent'};
    border-start-start-radius: 1rem;
    border-start-end-radius: 1rem;
  }
`;
