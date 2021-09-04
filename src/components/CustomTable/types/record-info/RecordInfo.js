import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';

const RecordInfo = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
      }}>
      <div>
        {'23:59'} - {'1399/12/28'}
      </div>
      <Avatar color={CV_BLACK} />
    </div>
  );
};

export default RecordInfo;
