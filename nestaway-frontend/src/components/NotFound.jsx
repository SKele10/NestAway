import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-[91.5vh] bg-secondary flex items-center justify-center">
      <div className="bg-accent1 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-primary mb-4">
          404 - Not Found
        </h2>
        <p className="text-accent2 mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          className={`text-accent1 rounded-lg ml-auto px-2 py-2 bg-primary hover:bg-action`}
          onClick={() => history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
