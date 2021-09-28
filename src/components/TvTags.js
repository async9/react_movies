import { useEffect } from "react";
import useData from "../composables/useData";
import "../styles/TagGenres.css";

const TvTags = (props) => {
  const apiTvGenre = `https://api.themoviedb.org/3/genre/tv/list?api_key=9794e8bb02ba77223f102a1ab8f4e97d&language=en-US`;

  const { data, getData } = useData();

  useEffect(() => {
    getData(apiTvGenre);
  }, []);

  return (
    <div className="filter__tags">
      <h2 className="filter__title">Genres</h2>
      {data && (
        <ul>
          {data.genres.map((item) => (
            <li
              onClick={() => {
                props.onTagClick(item.id);
              }}
              key={item.id}
              className={`tag ${item.id === props.tagId ? "tag__active" : ""}`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TvTags;
