const ViewsStats = require("../models/Stats");
const Video = require("../models/Video");
const Episode = require("../models/Episodes");
const Trailer = require("../models/Trailer");

const recordView = async (userId, videoId, trailerId, episodeId) => {
  console.log("trailer  id", trailerId, "video id", videoId);
  await ViewsStats.create({
    user_id: userId,
    video_id: videoId,
    episode_id: episodeId,
    trailer_id: trailerId,
  });

  const viewCount = await ViewsStats.count({
    where: {
      video_id: videoId,
    },
  });

  const trailerViewCount = await ViewsStats.count({
    where: {
      trailer_id: trailerId,
    },
  });

  const episodeViewCount = await ViewsStats.count({
    where: {
      episode_id: episodeId,
    },
  });

  const episode = await Episode.findByPk(episodeId);
  if (episode) {
    episode.views = episodeViewCount;
    await episode.save();
  }

  const trailer = await Trailer.findByPk(trailerId);
  if (trailer) {
    trailer.views = trailerViewCount;
    await trailer.save();
  }

  const video = await Video.findByPk(videoId);
  if (video) {
    video.views = viewCount;
    await video.save();
  }
};

module.exports = recordView;
