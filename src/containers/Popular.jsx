import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import HasRole from '../hoc/HasRole';

export default class Popular extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      specialOffers: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Popular...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/items/popular`)
      .then(response => {
        this.setState({
          specialOffers: response.data.popularItems,
          pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No Popular Found'
        })
      })
  }
  deleteUser(popularId, index) {
    const requestParams = {
      "popularId": popularId,
    }
    const token = Cookie.get('r6pro_access_token');
    if(confirm("Are you sure you want to delete this popular?")) {
      axios.delete(`${API_END_POINT}/api/specialOffers/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const specialOffers = this.state.specialOffers.slice();
          specialOffers.splice(index, 1);
          this.setState({ specialOffers });
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
    const {loading, specialOffers, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Popular Items</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>
            {/* <div className="col-sm-4 pull-right mobile-space">
              <HasRole requiredRole={['admin', 'data-entry']} requiredDepartment={['admin', 'sales']}>
                <Link to="/area_form">
                  <button type="button" className="btn btn-success marginTop">Add new Area</button>
                </Link>
              </HasRole>
            </div> */}

          {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to="/popular/popular_form">
                <button type="button" className="btn btn-success">Add new Popular Item</button>
              </Link>
          </div> */}

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Offer Price</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.specialOffers && this.state.specialOffers.length >= 1 ?
                this.state.specialOffers.map((popular, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>{popular._id}</td> */}
                  <td>{<img style={{height: '50px', width: '50px'}} src={popular.image && popular.image}/>}</td>
                  <td>{popular.name}</td>
                  <td>{popular.price}</td>
                  <td>{popular.specialOfferPrice ? popular.specialOfferPrice : "-"}</td>
                  <td>{popular.description}</td>
                  {/* <td>
                    <Link to={`/popular/edit_popular/${popular._id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteUser(popular._id, index)}></span>
                  </td> */}
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
