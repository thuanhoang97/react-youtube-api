import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import "./App.css";
import youtubeApi from './youtubeApi';
import Loading from "./components/Loading";
import Login from "./components/Login";
import Profile from "./components/Profile";
import PrivateRoute from './components/PrivateRoute';


export default class App extends Component {
  state = {
    isLogined: localStorage.getItem('clientId') !== null,
    loading: false,
    profile: {},
  };

  componentDidMount() {
    if (this.state.isLogined) {
      youtubeApi.setCallAPICallbacks(this.showLoading, this.hideLoading);
      youtubeApi.init(null, () => {
        this.setState({
          profile: {
            name: youtubeApi.profile.getName(),
            imageUrl: youtubeApi.profile.getImageUrl(),
          }
        });
        // this.loadPlayLists();
      });
    }
  }

  // componentDidMount() {
  //   console.log("Component did mount");
  //   if (this.state.clientId) {
  //     youtubeApi.setCallAPICallbacks(this.showLoading, this.hideLoading);
  //     youtubeApi.init(this.state.clientId, () => {
  //       this.loadPlayLists();
  //     });
  //   }
  // }

  // loadPlayLists = () => {
  //   youtubeApi.getPlayList().then((data) => {
  //     this.setState({
  //       playlists: data.items,
  //       nextTokenPlaylist: data.nextToken,
  //     });
  //   });
  // };

  showLoading = () => {
    this.setState({ loading: true });
  };

  hideLoading = () => {
    this.setState({ loading: false });
  };

  // getPlaylistByTitle = (title) => {
  //   title = title.trim();
  //   const playlists = this.state.playlists;
  //   for (let i = 0; i < playlists.length; i++) {
  //     if (playlists[i].title === title) {
  //       return playlists[i];
  //     }
  //   }
  //   return null;
  // };

  // onCreateNewPlaylist = (title, keyword) => {
  //   const playlist = this.getPlaylistByTitle(title);
  //   if (playlist) {
  //     youtubeApi.addVideosToPlaylistByKeyword(playlist.id, keyword);
  //   } else {
  //     youtubeApi.newPlaylist(title, keyword);
  //   }
  // };

  // onDeletePlaylist = (playlistId) => {
  //   youtubeApi.deletePlaylist(playlistId).then(this.loadPlayLists);
  // };

  render() {
    return (
      <Router>
      {this.state.isLogined ? <Profile data={this.state.profile}/> : null}
      <div className="app">
        <Loading isLoading={this.state.loading} />

        {this.state.isLogined ? (
          <PrivateRoute />
        ) : (
          <Login onLoginSuccess={this.onLoginSuccess}/>
        )}
      </div>
      </Router>

    );
  }
}
