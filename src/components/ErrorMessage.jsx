function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <h3>Couldn't load movies</h3>
      <p>{message || "Something went wrong. Please try again."}</p>
      {onRetry && <button className="retry-button" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export default ErrorMessage;
