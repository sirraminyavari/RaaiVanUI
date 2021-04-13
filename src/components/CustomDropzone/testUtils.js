import { fireEvent } from '@testing-library/react';

//! Provides file for tests.
export const createFile = (name, size, type) => {
  const file = new File([], name, { type });

  Object.defineProperty(file, 'size', {
    get() {
      return size;
    },
  });

  return file;
};

//! Using fireEvent.* doesn't work for our use case,
//! we cannot set the event props
export const dispatchEvt = (node, type, data) => {
  const event = new Event(type, { bubbles: true });
  if (data) {
    Object.assign(event, data);
  }
  fireEvent(node, event);
};

//! Dispatches an event on drag enter.
export const fireDragEnter = (node, data) => {
  dispatchEvt(node, 'dragenter', data);
};

//! Dispatches an event on drag over.
export const fireDragOver = (node, data) => {
  dispatchEvt(node, 'dragover', data);
};

//! Dispatches an event on drag leave.
export const fireDragLeave = (node, data) => {
  dispatchEvt(node, 'dragleave', data);
};

//! Dispatches an event on drop.
export const fireDrop = (node, data) => {
  dispatchEvt(node, 'drop', data);
};
