import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface text-center">
          <div className="w-12 h-12 rounded-xl bg-error-dim flex items-center justify-center mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h1 className="font-display font-bold text-xl text-on mb-2">Something went wrong</h1>
          <p className="text-sm text-on-variant mb-4 max-w-xs">
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Reload App
          </button>
          <details className="mt-4 text-left max-w-sm">
            <summary className="text-xs text-on-dim cursor-pointer">Technical details</summary>
            <pre className="text-2xs text-on-dim mt-2 overflow-auto max-h-40 bg-surface-low p-2 rounded">
              {this.state.error.stack}
            </pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
