import { Component } from 'react';

// Contains any crash inside the 3D brain (WebGL unsupported, chunk load failure,
// Three.js runtime error) so the rest of the results page keeps rendering.
// Falls back to whatever `fallback` is passed (the 2D brain map).
export default class BrainErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Surface the real reason in the console for debugging.
    console.error('[Brain3D] failed, falling back to 2D map:', error, info);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
