import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const PostView = (props) => {
  useScript(
    'pageLoadScripts/LoadPost/LoadPost.js',
    'LoadPost.js',
    (post) => {
      !isEmpty(post) && window.loadPost(post);
    },
    props.route
  );
  return (
    <div
      id="postArea"
      className="small-12 medium-12 large-12"
      style={{ padding: '0 10% 5rem 10%', margin: '0 auto' }}
    ></div>
  );
};

export default PostView;
