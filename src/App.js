import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
    loadedAPI: false,
    profile: {},
  };

  componentDidMount() {
    if (this.state.isLogined) {
      youtubeApi.setCallAPICallbacks(this.showLoading, this.hideLoading);
      youtubeApi.init(null, () => {
        this.setState({
          loadedAPI: true,
          profile: {
            name: youtubeApi.profile.getName(),
            imageUrl: youtubeApi.profile.getImageUrl(),
          }
        });
      });
    }
  }

  showLoading = () => {
    this.setState({ loading: true });
  };

  hideLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    let app;
    if (this.state.isLogined) {
      app = this.state.loadedAPI ?  
        <PrivateRoute /> :
        null
    } else {
      app = <Login onLoginSuccess={this.onLoginSuccess}/>;
    }
    

    return (
      <Router>
      {this.state.isLogined ? <Profile data={this.state.profile}/> : null}
      <div className="app">
        <Loading isLoading={this.state.loading} />
        {app}
      </div>
      <Route
          render={({ location }) =>
            location.pathname === "/" ? null : (
              <div className="link-menu">
                <Link to="/">Back to menu</Link>
              </div>
            )
          }
        />
      </Router>
    );
  }
}
