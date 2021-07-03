import { act, fireEvent, waitFor } from '@testing-library/react';

//! Provides mock file for tests.
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

export const flushPromises = async (rerender, ui) => {
  await act(() => waitFor(() => rerender(ui)));
};

//! The DataTransfer object is used to hold the data that is being dragged during a drag and drop operation.
//! It may hold one or more data items, each of one or more data types.
//! See: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
export const createDataTransferWithFiles = (files = []) => {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
};
