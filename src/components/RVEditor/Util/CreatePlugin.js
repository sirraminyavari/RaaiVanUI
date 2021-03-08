const { GlobalUtilities } = window;

if (!window.__FIXEDCKEDITOR) {
  window.__FIXEDCKEDITOR = true;
  const stl = document.createElement('style');
  stl.setAttribute('type', 'text/css');
  stl.innerHTML = '.ck-content { width: 100%; }';
  document.head.appendChild(stl);
}

const CreatePlugin = ({
  button: {
    name: buttonName,
    title: buttonTitle,
    svg: buttonSvg,
    onClick: onButtonClick,
  },
  onInit,
}) => {
  const { BalloonBlockEditor } = window;

  let pluginBase = BalloonBlockEditor.builtinPlugins.filter(
    (f) => f.pluginName == 'RVPluginBase'
  );

  if (!pluginBase.length) return;
  else pluginBase = pluginBase[0];

  return class extends pluginBase.PluginClass {
    init() {
      const editor = this.editor;

      if (buttonName) {
        editor.ui.componentFactory.add(buttonName, (locale) => {
          const view = new pluginBase.ButtonViewClass(locale);

          view.set({ label: buttonTitle, icon: buttonSvg, tooltip: true });

          if (GlobalUtilities.get_type(onButtonClick) == 'function') {
            view.on('execute', () => {
              onButtonClick(view, view.element);
            });
          }

          return view;
        });
      }

      if (GlobalUtilities.get_type(onInit) == 'function')
        onInit({ editor: editor });
    }
  };
};

export default CreatePlugin;
