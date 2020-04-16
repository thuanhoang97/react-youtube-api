import React from "react";
import { Route, Link, Switch } from "react-router-dom";

import youtubeApi from "../youtubeApi";
import ListplaylistItem from "./ListplayListItem";
import FormCreateNewPlaylist from "./FormCreateNewPlaylist.js";
import Menu from "./Menu";


class PrivateRoute extends React.Component {
	state = {
		playlists: [],
		nextTokenPlaylist: '',
	}

	componentDidMount() {
		// youtubeApi.setCallAPICallbacks(this.showLoading, this.hideLoading);
		// youtubeApi.init(this.props.clientId, () => {
		// 	this.loadPlayLists();
		// });
	}

	loadPlayLists = () => {
    youtubeApi.getPlayList().then((data) => {
      this.setState({
        playlists: data.items,
        nextTokenPlaylist: data.nextToken,
      });
    });
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
              loadPlaylists={this.loadPlayLists}
              items={this.state.playlists}
              onDeleteItem={this.onDeletePlaylist}
              onCreateNewPlaylist={this.onCreateNewPlaylist}
            />
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
	
				<Route
					render={({ location }) =>
						location.pathname === "/" ? null : (
							<div className="link-menu">
								<Link to="/">Back to menu</Link>
							</div>
						)
					}
				/> */}
      </React.Fragment>
    );
  }
}

export default PrivateRoute;
