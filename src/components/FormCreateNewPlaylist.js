import React, { Component } from "react";

export default class FormCreateNewPlaylist extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title') || this.props.title;
    const keyword = formData.get('keyword');

    if (title && keyword) {
      this.props.onCreateNewPlaylist(title, keyword);
    }
  }

  render() {
    return <div className="new-playlist-create">
      <h3 className="app-title">New playlist</h3>
      <form action="" className="form-new-playlist" onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          name="title" 
          defaultValue={this.props.title} 
          className="form-text" 
          placeholder="Playlist Title" 
          disabled={this.props.title}
        />
        <input type="text" name="keyword" className="form-text" placeholder="Search keyword"/>
        <input type="submit" value={this.props.title ? 'Insert' : 'Create'} className="btn"/>
      </form>
    </div>;
  }
}
