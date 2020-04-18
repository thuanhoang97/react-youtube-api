import React, { Component } from "react";
import ProTypes from "prop-types";

import youtubeApi from "../youtubeApi";

export default class FormCreateNewPlaylist extends Component {
  state = {
    errMsg: ''
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const playlist = this.props.playlist;

    const formData = new FormData(e.target);
    const title = playlist ? playlist.title : formData.get("title");
    const keyword = formData.get("keyword");
    const position = Number(formData.get("position"));
    const params = {
      numVideo: formData.get("numVideo"),
    }
    let errMsg = '';

    if (title && keyword) {
      if (playlist) {
        if (params.position > 0) {
          params.position = position - 1;
          youtubeApi.addVideosToPlaylistByKeyword(playlist.id, keyword, params)
        } else {
          errMsg = 'Missing Position';
        }
      } else {
        youtubeApi.newPlaylist(title, keyword, params);
      }
    } else {
      errMsg = 'Missing title & keyword';
    }

    this.setState({ errMsg });
  };

  checkNumberic = (e) => {
    if (!(e.keyCode === 8 || (e.keyCode > 47 && e.keyCode < 58))) {
      e.preventDefault();
    }
  };

  render() {
    const playlist = this.props.playlist;
    const isDisableTitleInput = playlist !== undefined;
    const btnTitle = playlist ? "Insert" : "Create";
    const defaultTitle = playlist ? playlist.title : "";

    return (
      <div className="new-playlist-create">
        <h3 className="app-title">New playlist</h3>
        {this.state.errMsg ? <div className="error">{this.state.errMsg}</div> : null }
        
        <form
          action=""
          className="form-new-playlist"
          onSubmit={this.handleSubmit}
        >
          <div className="field">
            <label htmlFor="">Playlist title:</label>
            <input
              type="text"
              name="title"
              defaultValue={defaultTitle}
              className="form-text"
              placeholder="Playlist Title"
              disabled={isDisableTitleInput}
            />
          </div>

          <div className="field">
            <label htmlFor="">Keyword:</label>
            <input
              type="text"
              name="keyword"
              className="form-text"
              placeholder="Search keyword"
            />
          </div>

          <div className="field">
            <label htmlFor="">Number video:</label>
            <input
              type="text"
              name="numVideo"
              className="form-text"
              placeholder="Number video"
              defaultValue={50}
              onKeyDown={this.checkNumberic}
            />
          </div>

          { playlist ? (
            <div className="field">
            <label htmlFor="">Position:</label>
            <input
              type="text"
              name="position"
              className="form-text"
              placeholder="Number video"
              onKeyDown={this.checkNumberic}
            />
          </div>
          ) : null }

          <input type="submit" value={btnTitle} className="btn" />
        </form>
      </div>
    );
  }
}

FormCreateNewPlaylist.proTypes = {
  playlist: ProTypes.object,
};
