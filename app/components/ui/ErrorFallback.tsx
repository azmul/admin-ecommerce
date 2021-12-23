import React from "react";
import { Alert } from "antd";

export default function ErrorFallback({
  error,
  componentStack,
  resetErrorBoundary,
}: any) {
  return (
    <Alert
      message={'Something Went Wrong'}
      description={
        <>
          <pre>{error?.message}</pre>
          <pre>{componentStack}</pre>
          <button onClick={resetErrorBoundary}>Try Again</button>
        </>
      }
      type="error"
      closable
    />
  );
}
