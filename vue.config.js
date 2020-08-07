
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://esl-chat-app.herokuapp.com/",
        ws: false,
        changeOrigin: true
      }
    }
  }
};