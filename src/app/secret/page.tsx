"use client";

import axios from "axios";
import { useEffect, useState } from "react";

function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/iot/switchbot/devices");
        setData(response.data); // Set the fetched data into state
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array to run only once on component mount

  // Optional: render the data or a loading message
  return (
    <div>
      <h1>Switchbot Test Page</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default Page;
