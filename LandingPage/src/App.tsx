import "./App.css";
import AppProvider from "./utils/AppProvider";

function App() {
  return (
    <>
      <AppProvider>
        <h1 className="text-3xl font-bold">Hello You</h1>
        <p>This is the description text</p>
      </AppProvider>
    </>
  );
}

export default App;
