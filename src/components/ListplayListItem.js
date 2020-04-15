import React from "react";
import PlaylistItem from "./PlaylistItem";
import FormCreateNewPlaylist from "../components/FormCreateNewPlaylist";

export default class ListPlayListItem extends React.Component {
  state = {
    _showForm: false,
    titleItemInsert: ''
  };

  componentDidMount() {
    console.log('Hello world');
    console.log(this.state._showForm);
  }

  onInsertItem = (title) => {
    this.setState({
      _showForm: true,
      titleItemInsert: title,
    });
  }

  render() {
    return (
      <div>
        {this.state._showForm ? (
          <FormCreateNewPlaylist 
            onCreateNewPlaylist={this.props.onCreateNewPlaylist} 
            title={this.state.titleItemInsert}
          />
        ) : (
          <div className="playlist">
            <h3 className="app-title">Current Playlist</h3>
            <div className="playlist-items">
              {this.props.items.map((item, idx) => (
                <PlaylistItem
                  data={item}
                  key={item.id}
                  onDelete={this.props.onDeleteItem}
                  onInsert={this.onInsertItem}
                />
              ))}
            </div>
            <div className="btn btn-reload" onClick={this.props.loadPlaylists}>
              <i className="fas fa-sync-alt"></i> Refresh
            </div>
          </div>
        )}
      </div>
    );
  }
}
