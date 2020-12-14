import React from 'react';
import './Track.css';

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.RemoveTrack = this.RemoveTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  RemoveTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction(isRemoval) {
    if (isRemoval) {
      return <button className="Track-action" onClick={this.RemoveTrack}>-</button>
    } else {
      return <button className="Track-action" onClick={this.addTrack}>+</button>
    }
  }

  render() {
    return(
      <div className="Track">
          <div className="Track-information">
              <h3>{this.props.track.name}</h3>
              <p>{this.props.track.artist} | {this.props.track.album}</p>
          </div>
          {this.renderAction(this.props.isRemoval)}
      </div>
    )
  };
}
