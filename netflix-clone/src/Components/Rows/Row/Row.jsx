import { useEffect, useState } from "react";
import "./row.css";
import axios from "../../../utils/axios";
import YouTube from "react-youtube";
import abebe from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

 const handleClick = (movie) => {
   if (trailerUrl) {
     setTrailerUrl(""); // close trailer if open
   } else {
     movieTrailer(movie?.title || movie?.name || movie?.original_name)
       .then((url) => {
         if (!url) return; // no trailer found
         const urlParams = new URLSearchParams(new URL(url).search);
         setTrailerUrl(urlParams.get("v"));
       })
       .catch((error) => console.log("Trailer not found:", error));
   }
 };


  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row__posters">
        {movies?.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
};

export default Row;
