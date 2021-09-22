import APIHandler from 'apiHelper/APIHandler';

const { RVDic } = window;

const saveFormApi = new APIHandler('FGAPI', 'SaveFormInstanceElements');

const saveForm = (elements) => {
  let elementsTemp = elements;

  return new Promise((resolve, reject) => {
    saveFormApi.fetch(
      {
        Elements: elements,
        ElementsToClear: '',
      },
      (result) => {
        if (result.ErrorText) {
          reject(RVDic.MSG[result.ErrorText] || result.ErrorText);
          return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
        }

        var filledElements = (result || {}).FilledElements || [];

        elementsTemp.forEach((itm) => {
          filledElements
            .filter((f) => f.ElementID == itm.ElementID)
            .forEach((f) => {
              itm.ElementID = f.NewElementID;
              itm.RefElementID = f.ElementID;
              itm.Filled = true;
            });
        });
        resolve(elementsTemp);
      }
    );
  });

  //   return elementsTemp;
};

export default saveForm;
