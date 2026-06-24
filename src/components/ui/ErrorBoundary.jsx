import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-xl border border-red-100">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6 max-w-md">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 hover:bg-red-50 text-red-700">
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
