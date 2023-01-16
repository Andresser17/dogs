import { useState, useEffect } from "react";
// Components
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import Pagination from "../components/Pagination";
import Item from "../components/Item";
import LoadingSpinner from "../components/LoadingSpinner";
// Styles
import styles from "./DogList.module.css";
const API_URL = process.env.REACT_APP_API;

function Filters({ filters, onFilters }) {
  // breed come from api or added by user
  const origin = [
    { text: "Existence", value: "api" },
    { text: "Created by user", value: "db" },
  ];
  // Filter by temperament
  // Fill this temp with temperament from DB;
  const [temp, setTemp] = useState([{ text: "", value: "" }]);
  // sort by alphabetical order or weight
  const sort = [
    { text: "Alphabetical order", value: "id" },
    { text: "Weight", value: "weight" },
  ];
  const order = [
    { text: "Ascendant", value: "asc" },
    { text: "Descendant", value: "desc" },
  ];

  // fetch all temperament options
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/temperaments`);
      const data = await response.json();
      const mapped = data.map((t) => ({ text: t.name, value: t.name }));

      setTemp(() => [{ text: "Temperament", value: "default" }, ...mapped]);
    };
    getData();
  }, []);

  return (
    <div className={`${styles["filter"]} secondary`}>
      <Select
        id="origin"
        selected={filters}
        setSelected={onFilters}
        options={origin}
      />
      <Select
        id="temp"
        selected={filters}
        setSelected={onFilters}
        options={temp}
      />
      <Select
        id="sort"
        selected={filters}
        setSelected={onFilters}
        options={sort}
      />
      <Select
        id="order"
        selected={filters}
        setSelected={onFilters}
        options={order}
      />
      <SearchInput id="searchInput" setFilter={onFilters} />
    </div>
  );
}

function Items({ dogs }) {
  const mapped =
    dogs && dogs.length > 0 ? (
      dogs.map((d) => <Item key={d.id} dog={d} />)
    ) : (
      <div></div>
    );

  return <div className={styles["items"]}>{mapped}</div>;
}

function DogList() {
  const [page, setPage] = useState(1);
  const [listOfDogs, setListOfDogs] = useState({});
  const [filters, setFilters] = useState({
    origin: "",
    temp: "",
    sort: "",
    order: "",
    searchInput: "",
  });

  // get data from backend api
  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch(
        `${API_URL}/dogs?name=${filters.searchInput}&limit=8&page=${page}&origin=${filters.origin}&sort=${filters.sort}&order=${filters.order}&temp=${filters.temp}`
      );

      const data = await response.json();
      setListOfDogs(() => data);
    };
    getDogs();
  }, [page, filters]);

  return (
    <div id="search" className={`${styles["container"]} dark`}>
      <Filters filters={filters} onFilters={setFilters} />
      {listOfDogs.data?.length > 0 ? (
        <Items dogs={listOfDogs?.data} />
      ) : (
        <LoadingSpinner />
      )}
      <Pagination
        maxPage={listOfDogs.maxPage}
        next={listOfDogs.next}
        previous={listOfDogs.previous}
        selected={page}
        onSelected={setPage}
      />
    </div>
  );
}

export default DogList;
