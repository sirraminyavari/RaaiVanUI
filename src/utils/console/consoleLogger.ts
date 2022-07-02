class consoleLogger {
  static originalConsole: Console = window.console;
  constructor() {
    window.console = new Proxy(window.console, {
      get(_target, property) {
        if (window.RVGlobal.IsDev || property === 'error')
          return consoleLogger.originalConsole[property];
        return () => null;
      },
    });
  }
}

export default consoleLogger;
