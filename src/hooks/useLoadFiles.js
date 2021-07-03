/**
 * loads a number of js and css files
 */

import { useState, useEffect } from 'react';

const { GlobalUtilities } = window;

const useLoadFiles = (files) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    GlobalUtilities.load_files(files, { OnLoad: () => setLoaded(true) });
  }, files);

  return loaded;
};

export default useLoadFiles;
