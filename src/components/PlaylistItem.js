import React from "react";


export default function PlaylistItem(props) {
  const data = props.data;
  return (
    <div className="playlist-item">
      <div className="info">
        <h3>
          {data.title}{" "}
          <span className="num-video">({data.itemCount} videos)</span>
        </h3>
        <div className="playlist-item-id">{data.id}</div>
      </div>
      <button
        className="btn btn-insert"
        onClick={() => props.onInsert(data.title)}
      >
        Insert
      </button>
      <button
        className="btn btn-delete"
        onClick={() => props.onDelete(data.id)}
      >
        Delete
      </button>
    </div>
  );
}
