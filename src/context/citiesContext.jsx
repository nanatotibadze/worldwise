import {useEffect, createContext, useContext, useState} from "react";
import data from "../data/cities.json";
import {useReducer, useCallback} from "react";

const CitiesContext = createContext();

const citiesList = JSON.parse(localStorage.getItem("cities"));

const initialState = {
  cities: citiesList ? citiesList : data.cities,
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {...state, isLoading: true};
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "current/city":
      return {...state, currentCity: action.payload};
    case "city/created":
      return {...state, cities: [...state.cities, action.payload]};
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {...state, isLoading: false, error: action.payload};
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({children}) {
  const [{cities, isLoading, currentCity}, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      localStorage.setItem("cities", JSON.stringify(cities));
    },
    [cities]
  );

  useEffect(function () {
    dispatch({type: "loading"});
    const res = localStorage.getItem("cities");
    const data = JSON.parse(res);
    dispatch({type: "cities/loaded", payload: data});
  }, []);

  const getCity = useCallback(
    function getCity(id) {
      const arr = cities.find((city) => city.id === id);
      dispatch({type: "current/city", payload: arr});
    },
    [cities]
  );

  function createCity(newCity) {
    dispatch({type: "city/created", payload: newCity});
  }

  function deleteCity(id) {
    dispatch({type: "city/deleted", payload: id});
  }
  return (
    <CitiesContext.Provider
      value={{cities, isLoading, getCity, currentCity, createCity, deleteCity}}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside the provider");
  return context;
}
export {CitiesProvider, useCities};
