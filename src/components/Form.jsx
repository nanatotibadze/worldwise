// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUrlPosition} from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {v4 as uuidv4} from "uuid";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import {useCities} from "../context/citiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const {createCity} = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );
          setCityName(data.city || data.localcity || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      position: {lat, lng},
      id: uuidv4(),
    };

    createCity(newCity);
    navigate("/app/cities");
  }

  if (geocodingError) return <Message message={geocodingError}></Message>;
  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng) return <Message message='Start by clicking on the map' />;
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
          id='date'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton></BackButton>
      </div>
    </form>
  );
}

export default Form;
