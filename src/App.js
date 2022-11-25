import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context/userContext";
import Landing from "./pages/landing";
import Login from "./pages/login";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate("/login");
    } else {
      if (state.user.role === "admin") {
        navigate("/");
      } else if (state.user.role === "customer") {
        navigate("/login");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.post("/auth/verify-token", {
        headers : {
          Authorization: `Bearer ${localStorage.token}` 
        }
      });

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
