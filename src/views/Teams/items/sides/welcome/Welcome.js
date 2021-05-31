import * as Styled from '../../../Teams.styles';
import Button from 'components/Buttons/Button';
import TwitterIcon from 'components/Icons/SocialMediaIcons/Twitter';
import LinkedIcon from 'components/Icons/SocialMediaIcons/LinkedIn';

const Welcome = () => {
  return (
    <Styled.WelcomeSide>
      <div
        style={{
          width: '250px',
          marginTop: '1.5rem',
          aspectRatio: '1',
          border: '1px solid #333',
          borderRadius: '10px',
          textAlign: 'center',
          lineHeight: '15rem',
        }}>
        Image
      </div>
      <div style={{ margin: '1rem 0 3rem 0' }}>
        <span style={{ color: '#707070', fontSize: '1rem' }}>
          به کلیک مایند خوش آمدید!
        </span>
      </div>
      <div>
        <Button type="primary-o" style={{ width: '9rem' }}>
          بلاگ کلیک مایند
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2rem 0 0 0',
        }}>
        <div
          style={{
            margin: '0 1rem',
            border: '1px solid #BAC9DC',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}>
          <TwitterIcon color="#BAC9DC" size={20} />
        </div>
        <div
          style={{
            margin: '0 1rem',
            border: '1px solid #BAC9DC',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}>
          <LinkedIcon color="#BAC9DC" size={20} />
        </div>
      </div>
    </Styled.WelcomeSide>
  );
};

export default Welcome;
