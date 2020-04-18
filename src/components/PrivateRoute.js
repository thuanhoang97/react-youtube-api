import React from "react";
import { Route, Switch } from "react-router-dom";

import youtubeApi from "../youtubeApi";
import ListplaylistItem from "./ListplayListItem";
import FormCreateNewPlaylist from "./FormCreateNewPlaylist.js";
import Menu from "./Menu";

class PrivateRoute extends React.Component {

  state = {
    playlists: [],
    nextTokenPlaylist: "",
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
  };

  onDeletePlaylist = (playlistId) => {
    // youtubeApi.deletePlaylist(playlistId).then(this.loadPlayLists);
  };

  render() {

    return (
      <React.Fragment>
        <Switch>
          <Route path="/" exact>
            <Menu />
          </Route>

          <Route path="/playlists">
            <ListplaylistItem
              items={this.state.playlists}
              onDeleteItem={this.onDeletePlaylist}
              onCreateNewPlaylist={this.onCreateNewPlaylist}
            />
          </Route>

          <Route path="/new" exact>
            <FormCreateNewPlaylist />
          </Route>
        </Switch>

        {/* <Route path="/playlists">
					<ListplaylistItem
						loadPlaylists={this.loadPlayLists}
						items={this.state.playlists}
						onDeleteItem={this.onDeletePlaylist}
						onCreateNewPlaylist={this.onCreateNewPlaylist}
					/>
				</Route>
	
				<Route path="/new" exact>
					<FormCreateNewPlaylist onCreateNewPlaylist={this.onCreateNewPlaylist} />
				</Route>
				 */}
      </React.Fragment>
    );
  }
}

export default PrivateRoute;
