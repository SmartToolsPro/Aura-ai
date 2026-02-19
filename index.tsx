import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to prevent the "Black Screen of Death" if the app crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Aura AI Application Crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-white p-6 text-center">
          <div className="bg-red-950/30 border border-red-900/50 p-8 rounded-3xl max-w-lg">
            <h2 className="text-xl text-red-400 mb-4 font-semibold">Application Error</h2>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              The application encountered a critical error and could not load. This usually happens on Netlify if the app is not properly built or if environment variables are missing.
            </p>
            <div className="bg-black/50 p-4 rounded-xl text-left overflow-auto">
              <code className="text-xs text-red-300 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:scale-105 transition-transform"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);