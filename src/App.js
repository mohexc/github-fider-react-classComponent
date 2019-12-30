import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';

import axios from 'axios';
import { ID, SECRET } from './config';
import './App.css'
import NotFound from './components/pages/NotFound';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const { data } = await axios.get(`https://api.github.com/users?client_id=${ID}&client_secret=${SECRET}`)
    this.setState({ users: data, loading: false })
  }

  searchUsers = async (text) => {
    this.setState({ loading: true })
    const { data } = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${ID}&client_secret=${SECRET}`)
    this.setState({ users: data.items, loading: false })
  }

  getUser = async (username) => {
    this.setState({ loading: true })
    const { data } = await axios.get(`https://api.github.com/users/${username}?client_id=${ID}&client_secret=${SECRET}`)
    this.setState({ user: data, loading: false })
  }

  getUserRepos = async username => {
    this.setState({ loading: true })
    const { data } = await axios.get(`https://api.github.com/users/${username}/repos?per_page=10&sort=created:asc&?client_id=${ID}&client_secret=${SECRET}`);
    this.setState({ repos: data, loading: false })

  }

  clearUser = () => this.setState({ users: [], loading: false })

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } })
    setTimeout(() => this.setState({ alert: null }), 1000)
  }

  render() {
    const { user, users, loading, alert, repos } = this.state

    return (
      <Router>
        <Navbar />
        <div className="container">
          <Alert alert={ alert } />
          <Switch>
            <Route exact path="/about"><About /></Route>
            <Route exact path='/user/:login'>{ (props => (
              <User { ...props } getUser={ this.getUser } user={ user } loading={ loading } getUserRepos={ this.getUserRepos } repos={repos}/>)) }</Route>
            <Route exact path="/">{ (props) => (
              <Fragment>
                <Search
                  searchUsers={ this.searchUsers }
                  clearUser={ this.clearUser }
                  showClear={ users.length > 0 ? true : false }
                  setAlert={ this.setAlert }
                />
                <Users loading={ loading } users={ users } />
              </Fragment>
            ) }</Route>
            <Route><NotFound /></Route>
          </Switch>
        </div>

      </Router>
    );
  }
}

export default App;
