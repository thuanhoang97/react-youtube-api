import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div>
      <h3 className="app-title">Menu</h3>
      <ul className="menu">
        <li>
          <Link to="/new">New playlist</Link>
        </li>
        <li>
          <Link to="/playlists">List playlists</Link>
        </li>
      </ul>
    </div>
  );
}
