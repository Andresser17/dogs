import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
// Components
import App from "./App";
import Homepage from "./routes/Homepage";
import DogList from "./routes/DogList";
import DogDetails from "./routes/DogDetails";
import CreateDog from "./routes/CreateDog";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<App tab="home" />);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route
          index
          element={
            <>
              <Homepage />
              <DogList />
              <CreateDog />
            </>
          }
        />
        <Route path="details/:breedId" element={<DogDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
