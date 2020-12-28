import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
    // localStorage.clear()
    // window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>
    }
    return this.props.children 
  }
}

export default ErrorBoundary