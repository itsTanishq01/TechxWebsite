
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/settings/account");
  }, [navigate]);

  return null;
};

export default Settings;
