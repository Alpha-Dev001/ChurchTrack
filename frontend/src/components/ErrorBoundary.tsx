import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = Math.random().toString(36).substring(2, 9);
    return { hasError: true, error, errorId };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
    console.error('Error ID:', this.state.errorId);
    
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const errorMessage = this.state.error?.message || 'An unexpected error occurred. Please try again.';
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-navy-50">
          <div className="text-center max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-navy-100">
            <div className="p-4 bg-navy-100 rounded-2xl inline-block">
              <AlertTriangle className="w-12 h-12 text-navy-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-navy-900 font-serif">Something went wrong</h2>
              <p className="text-sm text-navy-600 leading-relaxed">
                {errorMessage}
              </p>
              {isDevelopment && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-xs font-semibold text-navy-500 cursor-pointer hover:text-navy-700 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-navy-50 rounded-lg text-xs font-mono text-navy-700 overflow-auto max-h-40">
                    <div className="font-bold mb-1">Error ID: {this.state.errorId}</div>
                    <div className="mb-1">{this.state.error.toString()}</div>
                    <div className="text-navy-500">{this.state.error.stack}</div>
                  </div>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                aria-label="Try again"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-navy-50 text-navy-900 border border-navy-200 text-sm font-bold px-5 py-2.5 rounded-xl transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            <p className="text-xs text-navy-400 mt-4">
              Error ID: <span className="font-mono">{this.state.errorId}</span>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
