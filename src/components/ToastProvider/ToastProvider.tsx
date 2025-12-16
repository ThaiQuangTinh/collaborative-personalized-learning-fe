import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
            duration: 4000,
            style: {
                fontSize: "14px",
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
            },
        }}
    />
);

export default ToastProvider;
