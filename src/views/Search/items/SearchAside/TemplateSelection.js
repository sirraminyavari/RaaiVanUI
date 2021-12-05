import { lazy, Suspense, useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import AtSignIconIcon from 'components/Icons/AtSignIcon/AtSign';
import DotsIcon from 'components/Icons/Dots/Dots';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { searchContext } from 'views/Search/SearchView';
import ModalFallbackLoader from 'components/Loaders/ModalFallbackLoader/ModalFallbackLoader';
import { decodeBase64 } from 'helpers/helpers';

const TemplateSelectModal = lazy(() =>
  import(
    /* webpackChunkName: "template-select"*/ 'components/TemplateSelect/TemplateSelect'
  )
);

const TemplateSelection = () => {
  const {
    selectedTemps,
    isModalOpen,
    setIsModalOpen,
    setSelectedTemps,
  } = useContext(searchContext);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openTemplateSelect = () => {
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (template) => {
    const alreadyExists = selectedTemps.some(
      (temp) => temp.NodeTypeID === template.NodeTypeID
    );
    if (!alreadyExists) {
      setSelectedTemps((oldTemps) => [...oldTemps, template]);
    }
  };

  const handleRemoveTemplate = (tempId) => {
    setSelectedTemps((oldTemps) =>
      oldTemps?.filter((temp) => temp.NodeTypeID !== tempId)
    );
  };

  return (
    <Styled.TemplateSelection>
      <Suspense fallback={<ModalFallbackLoader />}>
        {isModalOpen && (
          <TemplateSelectModal
            onModalClose={handleCloseModal}
            isOpen={isModalOpen}
            onSelect={handleSelectTemplate}
          />
        )}
      </Suspense>
      <Styled.SelectionTitle>
        <AtSignIconIcon color={CV_DISTANT} />
        <div>انتخاب تمپلیت برای جستجو</div>
      </Styled.SelectionTitle>
      <Styled.SelectionContainer>
        <Styled.SelectedTemplatesWrapper>
          {selectedTemps.length ? (
            selectedTemps?.map((template, index) => (
              <Styled.SelectedTemplate key={template?.NodeTypeID}>
                {decodeBase64(template?.TypeName)}
                <CloseIcon
                  onClick={() => handleRemoveTemplate(template?.NodeTypeID)}
                  className="search-selected-temp-close-icon"
                />
              </Styled.SelectedTemplate>
            ))
          ) : (
            <span style={{ color: CV_DISTANT }}>انتخاب کنید</span>
          )}
        </Styled.SelectedTemplatesWrapper>
        <Styled.DotsWrapper onClick={openTemplateSelect}>
          <DotsIcon color={TCV_DEFAULT} />
        </Styled.DotsWrapper>
      </Styled.SelectionContainer>
    </Styled.TemplateSelection>
  );
};

export default TemplateSelection;
