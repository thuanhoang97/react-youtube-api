import React from "react";
import youtubeApi from "../youtubeApi";

import PlaylistItem from "./PlaylistItem";
import FormCreateNewPlaylist from "../components/FormCreateNewPlaylist";

export default class ListPlayListItem extends React.Component {
  state = {
    _showForm: false,
    itemInsert: '',
    playlist: {
      items: [],
      nextToken: ""
    },
  };

  componentDidMount() {
    this.loadPlayLists();
  }

  loadPlayLists = () => {
    youtubeApi.getPlayList().then((data) => {
      this.setState({
        playlist: {
          items: data.items,
          nextToken: data.nextToken
        }
      });
    });
	};

  onInsertItem = (item) => {
    this.setState({
      _showForm: true,
      itemInsert: item,
    });
  }

  render() {
    return (
      <div>
        {this.state._showForm ? (
          <FormCreateNewPlaylist 
            playlist={this.state.itemInsert}
          />
        ) : (
          <div className="playlist">
            <h3 className="app-title">Current Playlist</h3>
            <div className="playlist-items">
              {this.state.playlist.items.map((item, idx) => (
                <PlaylistItem
                  data={item}
                  key={item.id}
                  onDelete={this.props.onDeleteItem}
                  onInsert={this.onInsertItem}
                />
              ))}
            </div>
            <div className="btn btn-reload">
              <i className="fas fa-sync-alt"></i> Refresh
            </div>
          </div>
        )}
      </div>
    );
  }
}
