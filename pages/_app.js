/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        body {
          background-color: #ffffff;
        }
      `}</style>
      <ToastContainer/>
      <div className="flex flex-col min-h-screen">
        <Component {...pageProps} />
      </div>
    </>
  );
}
