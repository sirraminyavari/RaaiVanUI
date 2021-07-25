import {
  BackgroundImage,
  Container,
  Maintainer,
  Wrapper,
} from './AuthView.style';
import Logo from 'components/Media/Logo';
import SignIn from 'views/Auth/items/SignIn';

const LoginView = () => {
  return (
    <Maintainer className="small-12 medium-12 large-12 row">
      <BackgroundImage />
      <div className="small-1 medium-2 large-4" />
      <Container className="small-10 medium-8 large-4">
        <Logo />
        <Wrapper>
          <SignIn />
        </Wrapper>
      </Container>
      <div className="small-1 medium-2 large-4" />
    </Maintainer>
  );
};

export default LoginView;
