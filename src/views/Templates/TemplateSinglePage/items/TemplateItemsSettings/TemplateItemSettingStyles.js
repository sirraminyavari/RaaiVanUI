import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import SearchInput from 'components/Inputs/SearchInput';
import { CV_GRAY, CV_RED } from 'constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCS,
  ViewContentCard,
} from 'constant/StyledCommonCss';
import SearchBox from 'layouts/Sidebar/items/openSubContents/searchBox/SearchBox';
import styled from 'styled-components';

export const TemplateItemContainer = styled.div`
  ${ViewContentCard};
  min-height: calc(100vh - 6.5rem);

  .transition-enter {
    opacity: 0;
    transform: translate(0, 0.3rem);
  }

  .transition-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: all 200ms ease-in;
  }

  .transition-exit {
    opacity: 1;
    transform: translate(0, 0);
  }

  .transition-exit-active {
    opacity: 0;
    transform: translate(0, 0.3rem);
    transition: all 200ms ease-in;
  }
`;
TemplateItemContainer.displayName = 'TemplateItemContainer';

export const TemplateItemRowSection = styled.div`
  ${FLEX_RCB};
  gap: 0.75rem;
  padding: 0 0.5rem;
  height: 3rem;
  margin-bottom: 2rem;
`;
TemplateItemRowSection.displayName = 'TemplateItemTitleSection';

export const AddNewItemWapper = styled.div`
  width: 100%;
  border: solid 0.0625rem var(--rv-color-distant);
  height: 5rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-sizing: content-box;
  border: 0.0625rem solid #e6f4f1;
`;
AddNewItemWapper.displayName = 'AddNewItemWrapper';

export const TitleIcon = styled.img`
  width: 2rem;
  aspect-ratio: 1;
`;
TitleIcon.displayName = 'Icon';

export const Title = styled(Heading).attrs({
  type: 'H1',
})``;

export const NodeCounts = styled.div`
  font-size: 0.8rem;
  color: ${CV_GRAY};
  font-weight: 300;
`;

export const CreateNodeButton = styled(Button).attrs({
  type: 'primary',
})`
  height: 3rem;
  min-width: 13.5rem;
  font-size: 1.125rem;
  gap: 1rem;
`;

export const ArchiveButton = styled.button`
  ${FLEX_RCC};
  background-color: white;
  border-radius: 0.78rem;
  height: 3rem;
  border: solid 0.016rem transparent;
  color: ${CV_RED};
  font-size: 1rem;
  max-width: 9.5rem;
  width: 100%;
  font-weight: 500;
  gap: 0.5rem;
  transition: border 0.15s ease-out;

  &:hover {
    border: solid 0.016rem ${CV_RED};
  }
`;

export const ReturnButton = styled(ArchiveButton)`
  height: 2rem;
  min-width: 13.5rem;
  font-weight: 400;
  gap: 1rem;
`;
export const Spacer = styled.div`
  flex: 1;
`;
Spacer.displayName = 'Spacer';

export const SeachBox = styled(SearchInput)`
  max-width: 32rem;
`;
SearchBox.displayName = 'SearchBox';

export const ListWrapper = styled.div`
  height: calc(100vh - 21.5rem);
  padding: 0 0.5rem;
  overflow-y: auto;
`;

export const TreeWrapper = styled.div`
  height: calc(100vh - 23.5rem);
  padding: 0 0.5rem;
  overflow-y: auto;
`;

export const AddNewNodeActionRow = styled.div`
  ${FLEX_RCS}
  gap: 0.5rem;
  padding: 0 1.8rem;
`;

export const CancelNodeCreateButton = styled(Button).attrs({
  type: 'negative-o',
})`
  ${FLEX_CCC};
  width: 2.38rem;
  padding: 0;
  aspect-ratio: 1;
  border-radius: 100%;
  border: 0.0625rem solid ${CV_RED};
  color: ${CV_RED};
`;

export const SaveNewNodeButton = styled(Button).attrs({
  type: 'primary',
})`
  height: 2.38rem !important  ;
  padding: 0;
  width: 5.5rem;
  border-radius: 1.5rem;
`;

export const SaveAndAddNewNodeButton = styled(Button).attrs({
  type: 'primary-o',
})`
  height: 2.38rem !important  ;
  padding: 0;
  min-width: 8.5rem;
  border-radius: 1.5rem;
`;

export const TreeHeading = styled.div`
  ${FLEX_RCB};
  height: 2rem;
  border-bottom: 0.0625rem solid var(--rv-color-distant);
  gap: 0.5rem;
  padding: 0 0.5rem;
`;

export const TilteHeading = styled.div`
  flex: 6;
  font-size: 0.8rem;
  color: var(--rv-color-distant);
`;

export const CodeTitleHaeading = styled.div`
  flex: 1;
  font-size: 0.8rem;
  color: var(--rv-color-distant);
`;

export const CreationDateHeading = styled.div`
  flex: 1;
  font-size: 0.8rem;
  color: var(--rv-color-distant);
`;

export const ThumbnailHeading = styled.div`
  flex: 2;
  font-size: 0.8rem;
  color: var(--rv-color-distant);
`;

export const TreeButton = styled.button`
  ${FLEX_CCC};
  width: 3rem;
  aspect-ratio: 1;
  border-radius: 100%;
  border: none;
  cursor: pointer;
  background-color: var(--rv-white-color);
  color: var(--rv-color-distant);

  &:hover {
    color: var(--rv-color);
  }
`;
