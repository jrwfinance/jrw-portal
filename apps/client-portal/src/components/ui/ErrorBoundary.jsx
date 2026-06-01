import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) {
    if (window.Sentry) Sentry.captureException(error, { extra: info })
  }
  render() {
    if (this.state.error) return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-[12px] text-gray-500 mb-4">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}
            className="px-4 py-2 bg-brand-dark text-brand-lime rounded-lg text-[12px] font-semibold hover:bg-brand-darker transition-colors">
            Try again
          </button>
        </div>
      </div>
    )
    return this.props.children
  }
}