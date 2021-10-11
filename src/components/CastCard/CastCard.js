import "../CastCard/CastCard.css";

const CastCard = (props) => {
  return (
    <article className="cast">
      <div className="cast__img-container">
        {props.item.profile_path && (
          <img
            src={props.apiImg + props.item.profile_path}
            className="cast__img"
            alt=""
            loading="lazy"
          />
        )}
      </div>
      <div className="cast__info">
        <h3 className="cast__name">{props.item.name}</h3>
        <h4 className="cast__character">{props.item.character}</h4>
      </div>
    </article>
  );
};

export default CastCard;
