import { useContext } from 'react';
import * as Styled from './TemplatesGallery.styles';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateListItem from './TemplateListItem';
import { TemplatesGalleryContext, MAIN_CONTENT } from './TemplatesGallery';
import { isEmpty } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import useWindowContext from 'hooks/useWindowContext';

const TemplateSuggestionList = () => {
  const { setContent, setCurrentCategory, setCurrentTemplate, tree, setTree } =
    useContext(TemplatesGalleryContext);

  const { RV_Float } = useWindowContext();

  //! Change content on click.
  const handleClickTitle = () => {
    setContent({ name: MAIN_CONTENT, data: {} });
    setCurrentCategory(null);
    setCurrentTemplate(null);
  };

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    setTree(tree);
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <TemplateListItem itemProps={itemProps} />;
  };

  return (
    <>
      <Styled.SuggestionListTitle onClick={handleClickTitle}>
        <span>پیشنهاد کلیک‌مایند</span>
        <ChevronIcon small dir="left" />
      </Styled.SuggestionListTitle>
      <div
        style={{ marginInlineStart: '-1rem', height: 'calc(100vh - 15rem)' }}
      >
        <ScrollBarProvider direction={RV_Float}>
          {isEmpty(tree) ? (
            <LogoLoader />
          ) : (
            <div style={{ paddingInlineStart: '1rem' }}>
              <DragAndDropTree
                indentPerLevel={0}
                tree={tree}
                onMutateTree={handleMutateTree}
                renderItem={handleRenderItem}
              />
            </div>
          )}
        </ScrollBarProvider>
      </div>
    </>
  );
};

export default TemplateSuggestionList;
