import React, { useEffect, useState } from 'react'

function ErrorBoundary({children}) {

    const [hasError, setHasError] = useState(false)


    useEffect(() => {
      const handleError = (error, errorInfo) => {
        setHasError(true);
        // You can log the error to an error reporting service
        console.error("Error caught by error boundary:", error, errorInfo);
      };

      // Set up the error boundary
      window.addEventListener("error", handleError);

      return () => {
        // Clean up the error boundary
        window.removeEventListener("error", handleError);
      };
    }, []);


  if (hasError) {
    // You can render a fallback UI here
    return <div>Something went wrong!</div>;
  } else {
    // Render children if there's no error
    return children;
  }


}

export default ErrorBoundary