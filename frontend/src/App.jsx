import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import EntryPage from "./pages/EntryPage/EntryPage.jsx";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

function App() {
  const [socketInfo, setSocketInfo] = useState({
    gameId: null,
    playerName: null,
  });
  const socketRef = useRef();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:8080/");
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsSocketConnected(true);
    });
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <EntryPage
          socket={socketRef.current}
          socketInfo={socketInfo}
          setSocketInfo={setSocketInfo}
        />
      ),
    },
    { path: "/:gameId", element: <>Game</> },
    {
      path: "*",
      loader: () => redirect("/"),
    },
  ]);

  return (
    <div className="App">
      {isSocketConnected ? (
        <RouterProvider router={router} />
      ) : (
        <div>Connecting to server...</div>
      )}
    </div>
  );
}

export default App;