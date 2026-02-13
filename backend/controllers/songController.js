import axios from "axios";

const getSongs = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.jamendo.com/v3.0/tracks/?client_id=ea61a820&format=jsonpretty&limit=15`,
    );
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag || "").toString().trim();
    if (!tag)
      return res.status(400).json({ message: "Missing tag parameters" });

    const limit = parseInt(req.query.limit ?? "10", 10) || 10;
    const client_id = "ea61a820";
    const params = {
      client_id: client_id,
      format: "jsonpretty",
      tags: tag,
      limit,
    };

    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
      params,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("getPlayListByTag error:", error.message ?? error);
    return res.status(500).json({ message: "Failed to fetch" });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    console.log("Toggle favourite request received");
    console.log("User:", req.user);
    console.log("Song data:", req.body.song);
    
    const user = req.user;
    const song = req.body.song;

    if (!user || !song) {
      console.log("Missing user or song data");
      return res.status(400).json({ message: "Missing user or song data" });
    }

    const exists = user.favourites.find((fav) => fav.id === song.id);
    console.log("Song exists in favourites:", exists);

    if (exists) {
      user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
      console.log("Removed from favourites");
    } else {
      user.favourites.push(song);
      console.log("Added to favourites");
    }

    await user.save();
    console.log("User saved successfully");
    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error("Toggle favourite error:", error);
    return res
      .status(400)
      .json({ message: "Favourites not added, Something went wrong" });
  }
};

export { getSongs, getPlaylistByTag, toggleFavourite };
