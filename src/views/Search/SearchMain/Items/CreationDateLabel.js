import { CV_GRAY } from 'constant/CssVariables';

const CreationDateLabel = ({ CreationDate_Local, CreationDate } = {}) => {
  return (
    <>
      {CreationDate_Local && (
        <div
          style={{
            color: CV_GRAY,
            fontSize: '0.6rem',
          }}
        >
          {CreationDate_Local}
        </div>
      )}
    </>
  );
};

export default CreationDateLabel;
