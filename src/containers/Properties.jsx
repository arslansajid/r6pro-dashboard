import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import moment from 'moment';
import { API_END_POINT } from '../config';

export default class Properties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseMessage: 'Loading Properties...',
      loading: true,
      properties: [],
      activePage: 1,
      pages: 1,
      q: '',
      activeButton: 'pending',
    }
  }

  componentWillMount() {
    if (this.props.match.path.split('/')[2] == 'agency-listings') {
      axios.get(`/api/agency/agency-properties/${this.props.match.params.agencyId}?status=pending`)
      .then(response => {
        this.setState({
          properties: response.data.items,
          loading: false,
          responseMessage: 'No Properties Found',
          pages: Math.ceil(response.data.total / 10)
        })
      })
    } else {
      axios.get(`${API_END_POINT}/api/users/`)
      .then(response => {
        this.setState({
          loading: false,
          properties: response.data.objects,
          responseMessage: 'No Properties Found',
          pages: Math.ceil(response.data.total / 10)
        })
      })
    }
  }

  handleSelect(page) {
    axios.get(`/api/property?offset=${(page - 1) * 10}`)
    .then(response => {
      this.setState({
        properties: response.data.items,
        activePage: page
      })
    })
  }

  handleSearch() {
    this.setState({ loading: true, properties: [],  responseMessage: 'Loading Properties...' })
    axios.get(`/api/property?q=${this.state.q}`)
    .then((response) => {
      this.setState({
        properties: response.data.items,
        activePage: 1,
        loading: false,
        responseMessage: 'No Properties Found',
        pages: Math.ceil(response.data.total / 10)
      })
    })
  }

  handleFilter(status) {
    this.setState({ 
      activeButton: status,
      loading: true,
      responseMessage: 'Loading Properties...',
      properties: [],
    });
    if (this.props.match.path.split('/')[2] == 'agency-listings') {
      axios.get(`/api/agency/agency-properties/${this.props.match.params.agencyId}?status=${status}`)
      .then((response) => {
        this.setState({
          properties: response.data.items,
          responseMessage: 'No Properties Found',
          loading: false,
          activePage: 1,
          pages: Math.ceil(response.data.total / 10)
        })
      })
    } else {

      this.setState({ 
        activeButton: status,
        loading: true,
        responseMessage: 'Loading Properties...',
        properties: [], 
      });
      axios.get(`/api/property?status=${status}`)
      .then((response) => {
        this.setState({
          properties: response.data.items,
          responseMessage: 'No Properties Found',
          loading: false,
          activePage: 1,
          pages: Math.ceil(response.data.total / 10)
        })
      })
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Properties</h3>
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
          </div>
          <div className="row space-1 justify-content-between">
            <div className="col-sm-6">
            </div>
            <div className="col-sm-6 text-right">
              <button type="button" style={{ marginRight: 5, marginBottom: 5, borderRadius: 0 }}
                      className={`${this.state.activeButton == 'pending' ? 'btn-primary' : ''} btn btn-default`}
                      onClick={() => this.handleFilter('pending')}>Pending
              </button>
              <button type="button" style={{ marginRight: 5, marginBottom: 5, borderRadius: 0 }}
                      className={`${this.state.activeButton == 'published' ? 'btn-primary' : ''} btn btn-default`}
                      onClick={() => this.handleFilter('published')}>Published
              </button>
              <button type="button" style={{ marginRight: 5, marginBottom: 5, borderRadius: 0 }}
                      className={`${this.state.activeButton == 'rejected' ? 'btn-primary' : ''} btn btn-default`}
                      onClick={() => this.handleFilter('rejected')}>Rejected
              </button>
              <button type="button" style={{ marginRight: 5, marginBottom: 5, borderRadius: 0 }}
                      className={`${this.state.activeButton == 'closed' ? 'btn-primary' : ''} btn btn-default`}
                      onClick={() => this.handleFilter('closed')}>Closed
              </button>
              <button type="button" style={{ marginBottom: 5, borderRadius: 0 }}
                      className={`${this.state.activeButton == 'edited' ? 'btn-primary' : ''} btn btn-default`}
                      onClick={() => this.handleFilter('edited')}>Edited
              </button>
            </div>
          </div>
          {this.state.loading ?
            <div className="col-sm-12 text-center space-1">
              <i className="fa fa-spinner fa-pulse" style={{ fontSize: '50px' }}></i>
              </div>  
            : ''}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
              <tr>
                  <th>Sr. #</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                {this.state.activeButton === 'edited' ? <th>Edited at</th> : null}
              </tr>
              </thead>
              <tbody>
              { this.state.properties && this.state.properties.length >=1 ?
                this.state.properties.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              )) :
              <tr>
                  <td colSpan='10' className='text-center'>{this.state.responseMessage}</td>
                </tr>
              }
              </tbody>
            </table>
          </div>
          <div className={`text-center`}>
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage}
                        onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div>
        </div>
      </div>
    );
  }
}
