import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadUserUser } from "../../actions/userAction";

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(loadUserUser());
      toast.success("Logged in successfully with Google!", {
        position: "top-right",
      });
      navigate("/");
    } else {
      toast.error("Google login failed!");
      navigate("/login");
    }
  }, [dispatch, navigate, params]);

  return (
    <div className="flex items-center justify-center h-screen text-lg text-gray-600">
      Logging you in securely...
    </div>
  );
};

export default GoogleSuccess;
