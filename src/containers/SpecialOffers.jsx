import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import HasRole from '../hoc/HasRole';

export default class SpecialOffers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      specialOffers: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading SpecialOffers...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/items/specialOffer`)
      .then(response => {
        this.setState({
          specialOffers: response.data.object,
          pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No SpecialOffers Found'
        })
      })
  }

  deleteItem(specialOfferId, index) {
    const requestParams = {
      "itemId": specialOfferId,
    }
    const token = Cookie.get('r6pro_access_token');
    if(confirm("Are you sure you want to delete this specialOffer?")) {
      axios.delete(`${API_END_POINT}/api/items/delete`, {data: requestParams, headers: {"auth-token": token}})
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
              <h3>List of Special Offers</h3>
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

            <div className="col-sm-4 pull-right mobile-space">
                <Link to="/special-offers/specialOffer_form">
                  <button type="button" className="btn btn-success">Add new Special Offer</button>
                </Link>
            </div>

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
                this.state.specialOffers.map((specialOffer, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>{specialOffer._id}</td> */}
                  <td>{<img style={{height: '50px', width: '50px'}} src={specialOffer.image && specialOffer.image}/>}</td>
                  <td>{specialOffer.name}</td>
                  <td>{specialOffer.price}</td>
                  <td>{specialOffer.specialOfferPrice}</td>
                  <td>{specialOffer.description}</td>
                  <td>
                    <Link to={`/special-offers/edit_specialOffer/${specialOffer._id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteItem(specialOffer._id, index)}></span>
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
