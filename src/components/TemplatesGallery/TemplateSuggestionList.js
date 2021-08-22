import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const TemplateSuggestionList = () => {
  return (
    <div>
      <Styled.SuggestionListTitle>
        پیشنهاد کلیک‌مایند
      </Styled.SuggestionListTitle>
      <PerfectScrollbar style={{ height: 'calc(100vh - 15rem)' }}>
        {[...Array(15).keys()].map((_, index) => (
          <h3 key={index}>item</h3>
        ))}
      </PerfectScrollbar>
    </div>
  );
};

export default TemplateSuggestionList;
