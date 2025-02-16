import { FallbackProps } from "react-error-boundary";

const ErrorFallBack = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert" style={{ padding: "20px", textAlign: "center" }}>
      <h2>Oops! Something went wrong.</h2>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};

export default ErrorFallBack;
