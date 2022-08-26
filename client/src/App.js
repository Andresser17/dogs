import { Routes, Route } from "react-router-dom";
import "./App.css";
// Components
import Topbar from "./components/Topbar";
// Routes
import DogDetails from "./routes/DogDetails";
import Homepage from "./routes/Homepage";

function App() {
  return (
    <div className="App">
      <Topbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dogs" element={<Homepage />} />
        <Route path="details/:breedId" element={<DogDetails />} />
      </Routes>
    </div>
  );
}

export default App;
