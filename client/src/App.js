import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Styles
import "./App.css";
// Components
import Topbar from "./components/Topbar";
// Routes
import DogDetails from "./routes/DogDetails";
import Homepage from "./routes/Homepage";

function App() {
  const contextClass = {
    success: "secondary",
    error: "secondary",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <div className="App">
      <Topbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dogs" element={<Homepage />} />
        <Route path="details/:breedId" element={<DogDetails />} />
      </Routes>
      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " toast-container"
        }
        bodyClassName={() => "toast-body"}
      />
    </div>
  );
}

export default App;
