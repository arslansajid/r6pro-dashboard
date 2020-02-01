import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Users...'
    }
  }
  componentWillMount() {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/users/`)
      .then(response => {
        this.setState({
          users: response.data.objects,
          pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No Users Found'
        })
      })
  }
  deleteUser(userId, index) {
    const requestParams = {
      "userId": userId,
    }
    const token = Cookie.get('r6pro_access_token');
    if(confirm("Are you sure you want to delete this user?")) {
      axios.delete(`${API_END_POINT}/api/users/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const users = this.state.users.slice();
          users.splice(index, 1);
          this.setState({ users });
          window.alert(response.data.msg)
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    axios.get(`/api/area?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          areas: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  render() {
    // console.log(this.state);
    const {loading, users, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
          <div className="col-sm-4">
              <h3>List of Users</h3>
            </div>
            <div className="col-sm-4">
              <div className='input-group'>
                <input className='form-control' type="text" name="search" placeholder="Enter search keyword"
                       value={this.state.q} onChange={(event) => this.setState({ q: event.target.value })}/>
                <span className="input-group-btn">
                  <button type="button" onClick={() => this.handleSearch()}
                          className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>
            <div className="col-sm-4 pull-right mobile-space">
                <Link to='/users/user_form'>
                  <button type="button" className="btn btn-success">Add new User</button>
                </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  {/* <th>Picture</th> */}
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users && this.state.users.length >= 1 ?
                this.state.users.map((user, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>{<img style={{height: '50px', width: '50px'}} src={user.profile_picture && user.profile_picture.url} />}</td> */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                      <td>
                        <Link to={`/users/edit_user/${user._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteUser(user._id, index)}></span>
                      </td>
                    </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
