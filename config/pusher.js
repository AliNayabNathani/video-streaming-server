const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1672746",
  key: "8e514407a98e6bd7313d",
  secret: "7ea83f7f67306a8d0439",
  cluster: "ap1",
  useTLS: true,
});

module.exports = pusher;
