import React, { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import { updateFavourites } from "../../redux/slices/authSlice";
import axios from "axios";

// Helper function to format time
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const ControlArea = ({ playerState, playerControls }) => {
  // const isPlaying = false;
  // const currentTime = 0;
  // const duration = 180;

  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { isPlaying, currentTime, duration, currentSong, isLoading } =
    playerState;

  const { handleTogglePlay, handleNext, handlePrev, handleSeek } =
    playerControls;

  const currentSongId = currentSong?.id;

  const isLiked = Boolean(
    currentSongId && user?.favourites?.some((fav) => fav.id === currentSong.id),
  );

  const handleLike = async () => {
    if (!isAuthenticated || !currentSong) {
      console.log("Not authenticated or no current song");
      return;
    }

    try {
      const songData = {
        id: currentSong.id,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      };

      console.log("Sending song data:", songData);
      console.log("Token:", token);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Favorites response:", res.data);
      dispatch(updateFavourites(res.data));
    } catch (error) {
      console.error("Like failed", error);
      console.error("Error response:", error?.response?.data);
    }
  };
  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={handlePrev}
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>
        <button type="button" aria-label="play" className="control-play-btn" onClick={handleTogglePlay}>
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="#a855f7" size={36} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>
        {isAuthenticated && (
          <button
            type="button"
            aria-label="like"
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #a855f7 ${duration ? (currentTime / duration) * 100 : 0}%, #333 ${duration ? (currentTime / duration) * 100 : 0}%)`,
            WebkitBackground: `linear-gradient(to right, #a855f7 ${duration ? (currentTime / duration) * 100 : 0}%, #333 ${duration ? (currentTime / duration) * 100 : 0}%)`,
          }}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
