window.loadPost = (params) => {
  var initialJson = params;
  var postArea = document.getElementById('postArea');

  var elems = GlobalUtilities.create_nested_elements(
    [
      {
        Type: 'div',
        Style: 'margin-bottom:1.5rem; display:none;',
        Name: 'ownerInfoArea',
      },
      { Type: 'div', Name: 'idDivSharingArea' },
    ],
    postArea
  );

  var container = elems['idDivSharingArea'];
  var infoArea = elems['ownerInfoArea'];

  var ownerId = initialJson.OwnerID;
  var ownerType = initialJson.OwnerType;
  var postId = initialJson.PostID;

  if (postId || ownerId) jQuery(infoArea).fadeIn(0);

  GlobalUtilities.load_files(['SharingManager/SharingManager.js'], {
    OnLoad: function () {
      if (ownerId || postId) {
        new SharingManager({
          PostsContainerDivID: container,
          OwnerInfoArea: infoArea,
          OwnerObjectID: ownerId,
          InitialFill: true,
          OwnerType: ownerType,
          PostID: postId,
          Permissions: null,
          RealTime: true,
          RealTimeFeedID: postId || ownerId,
        });
      } else {
        var sm = new SharingManager({
          PostsContainerDivID: container,
          OwnerObjectID: (window.RVGlobal || {}).CurrentUserID,
          InitialFill: true,
          OwnerType: 'User',
          Permissions: { AddPost: true },
          NewPostArea: 'Advanced',
          News: true,
          OnLoad: function () {
            GlobalUtilities.onscrollend(document, { Offset: 10 }, function () {
              sm.get_posts();
            });
          },
        });
      }
    },
  });
};
