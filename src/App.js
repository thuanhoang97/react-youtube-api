import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./App.css";
import youtubeApi from "./youtubeApi";
import ListplaylistItem from "./components/ListplayListItem";
import FormCreateNewPlaylist from "./components/FormCreateNewPlaylist.js";
import Loading from "./components/Loading";
import Menu from "./components/Menu";

export default class App extends Component {
  state = {
    clientId:
      "192168005015-au0318faonc0u6vptqph8ue480llra4s.apps.googleusercontent.com",
    loading: false,
    playlists: [],
    nextTokenPlaylist: "",
  };

  componentDidMount() {
    youtubeApi.setCallAPICallbacks(this.showLoading, this.hideLoading);
    youtubeApi.init(this.state.clientId, () => {
      this.loadPlayLists();
    });
  }

  loadPlayLists = () => {
    youtubeApi.getPlayList().then((data) => {
      this.setState({
        playlists: data.items,
        nextTokenPlaylist: data.nextToken,
      });
    });
  };

  callAPI = (func, args) => {
    console.log("Call API");
    return func.apply(youtubeApi, args).then(() => console.log("Done"));
  };

  showLoading = () => {
    this.setState({ loading: true });
  };

  hideLoading = () => {
    this.setState({ loading: false });
  };

  getPlaylistByTitle = (title) => {
    title = title.trim();
    const playlists = this.state.playlists;
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].title === title) {
        return playlists[i];
      }
    }
    return null;
  };

  onCreateNewPlaylist = (title, keyword) => {
    const playlist = this.getPlaylistByTitle(title);
    if (playlist) {
      youtubeApi.addVideosToPlaylistByKeyword(playlist.id, keyword);
    } else {
      youtubeApi.newPlaylist(title, keyword);
    }
    // youtubeApi.newPlaylist(title, keyword);
    // console.log(title, keyword);
    // this.setState({'loading': true});
    // setTimeout(() => {this.setState({'loading': false})}, 2000);
  };

  onDeletePlaylist = (playlistId) => {
    youtubeApi.deletePlaylist(playlistId).then(this.loadPlayLists);
  };

  render() {
    return (
      <Router>
        <div className="app">
          <Loading isLoading={this.state.loading} />

          <Route path="/playlists">
            <ListplaylistItem
              loadPlaylists={this.loadPlayLists}
              items={this.state.playlists}
              onDeleteItem={this.onDeletePlaylist}
              onCreateNewPlaylist={this.onCreateNewPlaylist}
            />
          </Route>
          <Route path="/new" exact>
            <FormCreateNewPlaylist
              onCreateNewPlaylist={this.onCreateNewPlaylist}
            />
          </Route>
          <Route path="/" exact>
            <Menu />
          </Route>
        </div>

        <Route render={({location}) => 
          location.pathname === "/" ? null : (
            <div className="link-menu" >
              <Link to="/">Back to menu</Link>
            </div>  
          )
        }/>          
      </Router>
    );
  }
}
