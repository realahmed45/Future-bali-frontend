import { useState, useEffect } from "react";

const BACKEND_URL = "https://future-bali-backend-production.up.railway.app";

export const useTextConfig = () => {
  const [textConfig, setTextConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTextConfig = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/text/config`);
        const data = await response.json();

        if (data.success) {
          setTextConfig(data.config);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("Error fetching text config:", err);
        setError("Failed to load text configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchTextConfig();
  }, []);

  return { textConfig, loading, error };
};
