import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const FormView = (props) => {
  useScript(
    'pageLoadScripts/LoadForm/LoadForm.js',
    'LoadForm.js',
    (form) => {
      !isEmpty(form) && window.loadForm(form);
    },
    props.route
  );
  return (
    <div
      id="formArea"
      className="small-12 medium-12 large-12 row align-center rv-form"
    ></div>
  );
};

export default FormView;
