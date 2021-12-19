import { Link } from 'react-router-dom';
import LottieMaker from 'components/LottieMaker/LottieMaker';
import SearchJson from 'assets/lotties/search.json';
import * as Styled from 'views/Search/SearchView.styles';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import useWindow from 'hooks/useWindowContext';

const SearchNotFound = () => {
  const {
    RV_RevFloat,
    RVDic: { NoResultFound },
  } = useWindow();

  const questions = [
    { title: 'چرا آیتم موردنظر من در جستجو نیست؟' },
    { title: 'جستجو در کلیک‌مایند چگونه کار می‌کند؟' },
    { title: 'چه چیزهایی را می‌توانم در کلیک‌مایند پیدا کنم؟' },
  ];

  const Question = ({ question }) => {
    return (
      <Styled.NotFoundQuestionWrapper as={Link} to="#">
        <Styled.NotFoundQuestion>
          <QuestionIcon outline size={20} />
          <Styled.NotFoundText type="h4">{question.title}</Styled.NotFoundText>
        </Styled.NotFoundQuestion>
        <ChevronIcon small dir={RV_RevFloat} />
      </Styled.NotFoundQuestionWrapper>
    );
  };

  // TODO : uncomment FAQ whenever is ready.

  return (
    <Styled.NotFoundContainer>
      <LottieMaker animationJSON={SearchJson} width="10rem" />
      <Styled.NotFoundText type="h2" style={{ marginBottom: '1rem' }}>
        {NoResultFound}
      </Styled.NotFoundText>
      {/* {questions.map((question, index) => (
        <Question key={index} question={question} />
      ))} */}
    </Styled.NotFoundContainer>
  );
};

export default SearchNotFound;
