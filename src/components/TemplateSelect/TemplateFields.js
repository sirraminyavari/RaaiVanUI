import { useContext, useEffect, useState } from 'react';
import { TemplateSelectContext } from './TemplateSelect';
import * as Styled from './TemplateSelect.styles';
import FieldCell from './FieldCell';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import { getFormElements } from 'apiHelper/apiFunctions';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const TemplateFields = () => {
  const [nodeElements, setNodeElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentNode, onModalClose, onSelect } = useContext(
    TemplateSelectContext
  );
  const { TypeName, NodeTypeID } = currentNode || {};

  useEffect(() => {
    if (NodeTypeID) {
      setIsLoading(true);
      getFormElements('', NodeTypeID, true)
        .then((response) => {
          setIsLoading(false);

          if (response?.Elements) {
            setNodeElements(response.Elements);
            console.log(response.Elements);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }
  }, [NodeTypeID]);

  return (
    <Styled.TemplateFieldsContainer>
      {currentNode ? (
        <>
          <Styled.CurrentTemplateName type="h2">
            {decodeBase64(TypeName)}
          </Styled.CurrentTemplateName>
          <PerfectScrollbar className="template-fields-scrollbar">
            {!isLoading ? (
              nodeElements?.map((element, key) => (
                <FieldCell key={element?.ElementID || key} element={element} />
              ))
            ) : (
              <LogoLoader />
            )}
          </PerfectScrollbar>
          <Button
            onClick={() => onSelect(currentNode)}
            classes="template-select-button">
            انتخاب تمپلیت
          </Button>
          <Button
            onClick={onModalClose}
            type="negative-o"
            classes="template-back-button">
            بازگشت
          </Button>
        </>
      ) : (
        <></>
      )}
    </Styled.TemplateFieldsContainer>
  );
};

export default TemplateFields;
