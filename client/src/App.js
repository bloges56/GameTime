import { BrowserRouter as Router } from "react-router-dom";
import ApplicationViews from "./components/ApplicationViews";
import { UserProfileProvider } from "./providers/UserProfileProvider";
import { SessionProvider } from "./providers/SessionProvider";
import { ToastContainer } from "react-toastify";
import Navbar from "../src/components/Navbar";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer position="bottom-right" hideProgressBar />
      <UserProfileProvider>
        <SessionProvider>
          <Router>
            <Navbar />
            <ApplicationViews />
          </Router>
        </SessionProvider>
      </UserProfileProvider>
    </div>
  );
}

export default App;
