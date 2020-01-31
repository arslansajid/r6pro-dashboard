import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('waffle_world_access_token');

import HasRole from '../hoc/HasRole';

export default class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      item: '',
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading Items...',
      status: 'All'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    const { match } = this.props;
    if (match.params.categoryId) {
      axios.get(`${API_END_POINT}/api/items/one/category`, { params: {"categoryId": match.params.categoryId}, headers: {"auth-token" : token}} )
        .then((response) => {
          this.setState({
            items: response.data.object,
            responseMessage: 'No Items Found...'

          });
        });
    } else {
      this.fetchItems(this.state.status);
    }
  }

  fetchItems = (type) => {
    const { selectedRating } = this.state;
    this.setState({
      status: type,
      items: [],
      responseMessage: 'Loading Items...',
    })
      if(type === 'All') {
        axios.get(`${API_END_POINT}/api/items`, {headers: {"auth-token": token} })
        .then(response => {
          this.setState({
            items: response.data.objects,
            // pages: Math.ceil(response.data.length/10),
          })
        })
        .catch(err => {
          this.setState({
            responseMessage: 'No Items for Hotels Found...'
          })
        })
      } else {
      axios.get(`${API_END_POINT}/api/fetchAll${type}/hotelRating-fetchAll${type}`)
        .then(response => {
          this.setState({
            items: response.data,
            pages: Math.ceil(response.data.length/10),
            responseMessage: 'No Items Found...'
          })
        })
        .catch((error) => {
          this.setState({
            responseMessage: 'No Items Found...'
          })
        })
      }
    }

  changeStatus = (itemId, ratingStatus) => {
    if(this.state.selectedRating === 'hotels') {
    axios.get(`${API_END_POINT}/api/fetchById/hotelRating-fetchById/${itemId}`)
      .then(response => {
        this.setState({
          item: response.data,
        }, () => {
          this.setState(prevState => ({
            item: {
                ...prevState.item,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'hotelRating' : JSON.stringify(this.state.item)}
              axios.patch(`${API_END_POINT}/api/update/hotelRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    } else {
      axios.get(`${API_END_POINT}/api/fetchById/packageRating-fetchById/${itemId}`)
      .then(response => {
        this.setState({
          item: response.data,
        }, () => {
          this.setState(prevState => ({
            item: {
                ...prevState.item,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'packageRating' : JSON.stringify(this.state.item)}
              axios.patch(`${API_END_POINT}/api/update/packageRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    }
  }

  deleteItem(itemId, index) {
    const requestParams = {
      "itemId": itemId,
    }
    if(confirm("Are you sure you want to delete this item?")) {
      axios.delete(`${API_END_POINT}/api/items/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const items = this.state.items.slice();
          items.splice(index, 1);
          this.setState({ items });
          window.alert(response.data.msg);
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
    this.setState({loading: true, items: [], responseMessage: 'Loading Items...'})
    axios.get(`${API_END_POINT}/api/items/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          items: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Items Found...'
        })
      })
  }

  render() {
    const { status, selectedRating } = this.state;
    const { match } = this.props;
    console.log(this.state);
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Items{/* match.params.categoryId ? `for category: ${match.params.categoryId}` : null */}</h3>
              </div>
              <div  className="col-sm-4">
                <div className='input-group'>
                  <input  className='form-control'
                    type="text"
                    name="search"
                    placeholder="Enter keyword"
                    value={this.state.q}
                    onChange={(event) => this.setState({q: event.target.value})}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        // console.log('do validate');
                        this.handleSearch();
                      }
                    }}
                  />
                  <span className="input-group-btn" >
                    <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                  </span>
                </div>
              </div>
              {!match.params.categoryId ? 
                <div className="col-sm-4 pull-right mobile-space">
                  <Link to={`/items/items_form`}>
                    <button type="button" className="btn btn-success">Add new Item</button>
                  </Link>
                </div>
              : null}
          </div>

          {/* <div className="form-group row">
            <div className="col-sm-2">
            </div>
              <div className="col-md-6 col-sm-6">
                <select
                  name="selectedRating"
                  value={this.state.selectedRating}
                  className="form-control custom-select"
                  onChange={(event) => this.handleRatingSelection(event)}
                  required
                >
                  <option value="">Select Rating Type</option>
                  <option value="packages">Packages</option>
                  <option value="hotels">Hotels</option>
                  <option value="experiences">Experiences</option>
                </select>
              </div>
            </div> */}

            {/* {selectedRating ? */}
          <div>         
            <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
            <button
                type="button"
                style={{
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'All' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchItems('All')}
              >All
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'Accepted' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchItems('Accepted')}
              >Active
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'Rejected' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchItems('Rejected')}
              >Disabled
              </button>
            </div>
          </div>

          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Popular</th>
                  <th>Favourite</th>
                </tr>
              </thead>
              <tbody>
                {this.state.items && this.state.items.length >= 1 ?
                  this.state.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={item.image && item.image} />}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    <td>{item.status ? item.status : "-"}</td>
                    <td>{item.isPopular ? "Yes" : "No"}</td>
                    <td>{item.favourite ? "Yes" : "No"}</td>
                    {status !== 'All' ?
                      <td>
                      {status === 'Accepted' || status === 'Rejected' ? 
                        <button type="button" className="btn btn-info btn-sm ml-2" onClick={() => this.changeStatus(item.ID, 'PENDING')} style={{marginRight: '5px'}}>Pending</button>
                          : null}
                          {status === 'Pending' || status === 'Rejected' ? 
                          <button type="button" className="btn btn-success btn-sm" onClick={() => this.changeStatus(item.ID, 'ACCEPTED')}style={{marginRight: '5px'}}>Accept</button>
                          : null}
                          {status === 'Pending' || status === 'Accepted' ? 
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => this.changeStatus(item.ID, 'REJECTED')}>Reject</button>
                          : null}
                      </td>
                    : null}
                    <td>
                        <Link to={`/items/edit_item/${item._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteItem(item._id, index)}></span>
                      </td>
                  </tr>
                )):
                <tr>
                    <td colSpan="15" className="text-center">{this.state.responseMessage}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      {/* //   : null
      // } */}
      </div>
    </div>
    );
  }
}
