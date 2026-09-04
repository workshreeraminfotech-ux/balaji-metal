import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary — catches any uncaught render-time errors so the app
 * never shows a completely blank page. The user sees a friendly card
 * with a "Go Home" link instead of a white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for developer visibility
    console.error('[ErrorBoundary] Caught error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-5">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-heading font-black text-slate-900 mb-1">Kuch galat ho gaya</h2>
              <p className="text-slate-500 text-sm font-medium">
                Is page mein ek error aayi hai. Home page par jaayein ya dobara try karein.
              </p>
              {this.state.error && (
                <details className="mt-3 text-left">
                  <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Technical details</summary>
                  <pre className="mt-1 text-[10px] text-red-600 bg-red-50 rounded-lg p-2 overflow-auto max-h-32 border border-red-100">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer transition-colors"
              >
                Dobara Try Karein
              </button>
              <Link
                to="/"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm cursor-pointer transition-colors"
              >
                Home Page
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
