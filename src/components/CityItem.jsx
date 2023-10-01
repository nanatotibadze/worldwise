import styles from "./CityItem.module.css";
import {Link} from "react-router-dom";
import {useCities} from "../context/citiesContext";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({city}) {
  const {cityName, emoji, date, id, position} = city;
  const {deleteCity} = useCities();

  return (
    <li key={city.id}>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={styles.cityItem}
      >
        {/* gadadis cities/id linkze, romelsac useParam-is meshveobit amovigebt id-is url-idan
        da im city-s amoigeb, aseve position.lat da position.lng -s gadavcemt da shemdeg
        Map komponentshi gamogvadgeba es poziziebi rom markerebi davsvaT rukaze */}
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}> {cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.preventDefault();
            deleteCity(id);
          }}
        >
          {" "}
          &times;
        </button>
      </Link>
    </li>
  );
}
export default CityItem;
