import "./App.css";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            border: "1px solid #713200",
            padding: "10px",
            color: "#713200",
          },
          
        }}
      />
      <AppRouter />
    </>
  );
}

export default App;
