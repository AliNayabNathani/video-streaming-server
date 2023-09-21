const filterVideosByApproval = (videos) => {
  return videos.filter((video) => video.contentApproval.status === "accept");
};

module.exports = filterVideosByApproval;
