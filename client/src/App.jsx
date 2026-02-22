import { Routes , Route} from "react-router-dom";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";

function App() {

  return(
    <>
      <Toaster />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<TeacherDashboard />} />
      </Routes>
    </>
  );
}

export default App;
