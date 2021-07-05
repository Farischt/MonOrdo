// module.exports = {
//   reactStrictMode: true,
//   images: {
//     loader: "imgix",
//     path: "",
//   },
// }

const withImages = require("next-images")

module.exports = withImages({
  module: {
    rules: [
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
})
