import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import {useCities} from "../context/citiesContext";

function CountryList() {
  const {cities} = useCities();
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on the map'></Message>
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, {country: city.country, emoji: city.emoji}];
    else return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
