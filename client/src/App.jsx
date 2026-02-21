import { Routes , Route} from "react-router-dom";
import TeacherDashboard from "./pages/Teacher/TDashborad";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return(
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
  );
}

export default App;
