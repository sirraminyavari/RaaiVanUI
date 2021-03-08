window.loadUserSearch = () => {
  GlobalUtilities.load_files(['USR/AdvancedUserSearch.js'], {
    OnLoad: function () {
      new AdvancedUserSearch('searchArea');
    },
  });
};
