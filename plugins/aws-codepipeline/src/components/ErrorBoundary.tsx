import React, { Component } from 'react';
import Alert from '@material-ui/lab/Alert';

interface Props {}
interface MyProps {}

interface MyState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<MyProps, MyState> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Alert severity="error">Something went wrong.</Alert>;
    }

    return this.props.children;
  }
}
