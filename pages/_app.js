import { ThemeProvider } from "../contexts/ThemeContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
