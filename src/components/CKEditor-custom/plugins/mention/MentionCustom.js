const items = [
  {
    id: '@swarley',
    userId: '1',
    name: 'Barney Stinson',
    link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439',
  },
  {
    id: '@lilypad',
    userId: '2',
    name: 'Lily Aldrin',
    link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989',
  },
  {
    id: '@marshmallow',
    userId: '3',
    name: 'Marshall Eriksen',
    link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981',
  },
  {
    id: '@rsparkles',
    userId: '4',
    name: 'Robin Scherbatsky',
    link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627',
  },
  {
    id: '@tdog',
    userId: '5',
    name: 'Ted Mosby',
    link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140',
  },
];

export const getFeedItems = (queryText) => {
  // As an example of an asynchronous action, return a promise
  // that resolves after a 100ms timeout.
  // This can be a server request or any sort of delayed action.
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemsToDisplay = items
        // Filter out the full list of all items to only those matching the query text.
        .filter(isItemMatching)
        // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
        .slice(0, 10);

      resolve(itemsToDisplay);
    }, 100);
  });

  // Filtering function - it uses the `name` and `username` properties of an item to find a match.
  function isItemMatching(item) {
    // Make the search case-insensitive.
    const searchString = queryText.toLowerCase();

    // Include an item in the search results if the name or username includes the current user input.
    return (
      item.name.toLowerCase().includes(searchString) ||
      item.id.toLowerCase().includes(searchString)
    );
  }
};

export const customItemRenderer = (item) => {
  const itemElement = document.createElement('span');
  const userNameElement = document.createElement('span');
  const fullNameElement = document.createElement('span');

  userNameElement.textContent = item.id;
  fullNameElement.textContent = item.name;

  itemElement.appendChild(userNameElement);
  itemElement.appendChild(fullNameElement);

  return itemElement;
};
