import { Toaster } from "react-hot-toast";
import AppRoute from "./routes/AppRoute";
import ToastProvider from "./components/ToastProvider/ToastProvider";

function App() {
  return (
    <>
      <AppRoute />
      <ToastProvider />
    </>
  );
}

export default App;