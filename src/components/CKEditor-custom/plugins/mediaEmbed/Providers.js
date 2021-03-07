export const aparatProvider = {
  name: 'aparatProvider',
  url: /^aparat\.com\/v\/(\w+)/,
  html: (match) => `
    <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>
    `,
};
