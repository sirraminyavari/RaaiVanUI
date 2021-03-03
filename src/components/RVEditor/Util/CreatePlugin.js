import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

const { GlobalUtilities } = window;

const CreatePlugin = ({
  button: {
    name: buttonName,
    title: buttonTitle,
    svg: buttonSvg,
    onClick: onButtonClick,
  },
  onInit,
}) => {
  return class extends Plugin {
    init() {
      const editor = this.editor;

      if (buttonName) {
        editor.ui.componentFactory.add(buttonName, (locale) => {
          const view = new ButtonView(locale);

          view.set({ label: buttonTitle, icon: buttonSvg, tooltip: true });

          if (GlobalUtilities.get_type(onButtonClick) == 'function') {
            view.on('execute', () => {
              onButtonClick(view, view.element);
            });
          }

          return view;
        });
      }

      if (GlobalUtilities.get_type(onInit) == 'function') onInit();
    }
  };
};

export default CreatePlugin;
