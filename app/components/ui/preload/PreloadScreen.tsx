import { Spin } from "antd";
import React from "react";
import styles from "./PreloadScreen.module.scss";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ErrorFallback"

/**
 * Displayed before content loads on the site.
 */
export const PreloadScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={styles.loaderContainer}>
        <div className={styles.loaderContentColumn}>
          <Spin spinning size="large" className={styles.loaderSpin} />
        </div>
      </div>
    </ErrorBoundary>
  );
};
