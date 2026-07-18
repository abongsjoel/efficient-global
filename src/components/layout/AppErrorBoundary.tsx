import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

type ErrorBoundaryProps = {
  children: ReactNode;
  resetKey: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled app error", error, errorInfo);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (
      this.state.error &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ error: null });
    }
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-900">
        <section
          role="alert"
          aria-labelledby="app-error-title"
          className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-2xl shadow-slate-950/20 sm:px-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            Something went wrong
          </p>
          <h1
            id="app-error-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-slate-950"
          >
            We could not load this part of the page.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Please try again. If the issue continues, refresh the page and
            submit the form one more time.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-primary-200 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200/20 transition hover:bg-primary-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30"
              onClick={this.handleReset}
            >
              Try again
            </button>
            <a
              href="/logistics/"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20"
            >
              Back home
            </a>
          </div>
        </section>
      </main>
    );
  }
}

const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>
  );
};

export default AppErrorBoundary;
