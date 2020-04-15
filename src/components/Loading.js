import React from "react";

export default function Loading(props) {
  return (
    <div className={`loading ${props.isLoading ? " show" : ""}`}>
      <div className="loading-content">
        <i className="fas fa-spinner fa-4x"></i>
        <p>Please wait for a moment...</p>
      </div>
    </div>
  );
}
