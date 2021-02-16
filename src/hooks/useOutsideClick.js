import { useState, useEffect } from 'react';

const { GlobalUtilities } = window;

function useOutsideClick(callback, nodes) {
  if (GlobalUtilities.get_type(nodes) != 'array') nodes = [nodes];

  const handleClick = (e) => {
    let clickItems = nodes
      .map((nd) =>
        GlobalUtilities.get_type(nd) == 'string'
          ? document.getElementById(nd)
          : (nd || {}).current
      )
      .filter((nd) => !!nd);

    let outsideClicked =
      !!e.target &&
      !!clickItems.length &&
      !clickItems.some((nd) => nd.contains(e.target));
    if (outsideClicked) callback();
  };

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);

    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, nodes);
}

export default useOutsideClick;
