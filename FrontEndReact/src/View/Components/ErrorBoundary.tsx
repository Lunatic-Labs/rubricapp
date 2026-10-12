import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import ErrorMessage from '../Error/ErrorMessage';
import { logger } from '../../logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Top-level crash barrier: without this, an uncaught render error
// unmounts the whole React tree and the user just sees a blank page,
// with nothing about what happened visible to anyone but them. Wraps the
// app shell in App.tsx.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(
      `Unhandled UI error: ${error.message}`,
      `${error.stack || ''}\n${errorInfo.componentStack || ''}`
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          gap: 2
        }}>
          <ErrorMessage errorMessage="Something went wrong. Please reload the page." />
          <Button
            aria-label="reloadPageButton"
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
