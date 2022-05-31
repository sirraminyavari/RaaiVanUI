import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { API_Provider, setRVGlobal } from 'helpers/helpers';
import { RV_API, SELECT_APPLICATION } from 'constant/apiConstants';
import { CLASSES_PATH, HOME_PATH } from 'constant/constants';
import { useOnboardingSlice } from 'store/slice/onboarding';

const { setSelectingApp } = ApplicationsSlice.actions;
const selectApplicationAPI = API_Provider(RV_API, SELECT_APPLICATION);

/**
 * @description A function (action) that creates a new application.
 * @returns -Dispatch to redux store.
 */
export const selectApplication = (appId, done, error) => async (dispatch) => {
  const {
    actions: { onboardingName, onboardingStep, toggleActivation },
  } = useOnboardingSlice();

  try {
    dispatch(
      setSelectingApp({
        isSelecting: true,
        selectingAppId: appId,
      })
    );
    selectApplicationAPI.fetch(
      { ApplicationID: appId },
      (response) => {
        // console.log(response);
        if (response.ErrorText) {
          error && error(response.ErrorText);
        } else if (response.Succeed) {
          setRVGlobal({
            ApplicationID: appId,
            IsSystemAdmin: response.IsSystemAdmin,
          });
          //dispatch(getSidebarNodeTypes());//////////////////////////removed the referenced funtion
          //dispatch(getConfigPanels()); /////////////////////////////removed the referenced funtion
          //dispatch(getUnderMenuPermissions(['Reports'])); //////////removed the referenced funtion
          // dispatch(getNotificationsCount());
          // dispatch(getNotificationsList());

          if (!!response.ProductTour) {
            dispatch(onboardingName(response.ProductTour?.Name || ''));
            dispatch(onboardingStep(response.ProductTour?.Step || 0));
            //the application has been selected, now activate the product tour ::khalafi

            if (response.ProductTour?.Name) {
              dispatch(toggleActivation());
            }
            done && done(CLASSES_PATH);
          } else {
            done && done(HOME_PATH);
          }
        }
        dispatch(
          setSelectingApp({
            isSelecting: false,
            selectingAppId: null,
          })
        );
      },
      (error) => {
        console.log({ error });
        dispatch(
          setSelectingApp({
            isSelecting: false,
            selectingAppId: null,
          })
        );
      }
    );
  } catch (err) {
    console.log({ err });
    dispatch(
      setSelectingApp({
        isSelecting: false,
        selectingAppId: null,
      })
    );
  }
};
