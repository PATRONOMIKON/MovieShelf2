function LoadingSpinner({ message = "Loading movies..." }) {
  return (
    <div className="status-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
