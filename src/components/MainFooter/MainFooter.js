import "../MainFooter/MainFooter.css";

const MainFooter = () => {
  return (
    <footer className="main-footer">
      <div className="main-footer__container">
        <div className="main-footer__img-tmdb"></div>
        <div className="main-footer__logos">
          <i className="logo-react fab fa-react"></i>
          <div className="main-footer__img-firebase"></div>
        </div>
        <p className="main-footer__text">Developed by Maxim Zavatyi</p>
        <p className="main-footer__text">For personal use only</p>
        <p className="main-footer__text">2021</p>
      </div>
    </footer>
  );
};

export default MainFooter;
