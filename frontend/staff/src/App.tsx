import { useSelector } from "react-redux";
import "./App.css";
import AppRouter from "./router/AppRouter";
import { Loader } from "lucide-react";
import type { RootState } from "./store/store";
import { Toaster } from "react-hot-toast";

function App() {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

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
      {isLoading && <Loader />}
      <AppRouter />
    </>
  );
}

export default App;
