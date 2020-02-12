import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import HasRole from '../hoc/HasRole';

export default class Operators extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operators: [],
      operator: '',
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading Operators...',
      status: 'All'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    // this.fetchItems(this.state.status);
    axios.get(`${API_END_POINT}/api/v1/operators`, {headers: {"Authentication": token, "UUID": UUID }})
    .then(response => {
      this.setState({
        operators: response.data,
        responseMessage: 'No Operators Found...'
      })
    })
  }

  fetchItems = (type) => {
    const { selectedRating } = this.state;
    this.setState({
      status: type,
      operators: [],
      responseMessage: 'Loading Operators...',
    })
      if(type === 'All') {
        axios.get(`${API_END_POINT}/api/operators`, {headers: {"auth-token": token} })
        .then(response => {
          this.setState({
            operators: response.data.objects,
            // pages: Math.ceil(response.data.length/10),
          })
        })
        .catch(err => {
          this.setState({
            responseMessage: 'No Operators for Hotels Found...'
          })
        })
      } else {
      axios.get(`${API_END_POINT}/api/fetchAll${type}/hotelRating-fetchAll${type}`)
        .then(response => {
          this.setState({
            operators: response.data,
            pages: Math.ceil(response.data.length/10),
            responseMessage: 'No Operators Found...'
          })
        })
        .catch((error) => {
          this.setState({
            responseMessage: 'No Operators Found...'
          })
        })
      }
    }

  changeStatus = (itemId, ratingStatus) => {
    if(this.state.selectedRating === 'hotels') {
    axios.get(`${API_END_POINT}/api/fetchById/hotelRating-fetchById/${itemId}`)
      .then(response => {
        this.setState({
          operator: response.data,
        }, () => {
          this.setState(prevState => ({
            operator: {
                ...prevState.operator,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'hotelRating' : JSON.stringify(this.state.operator)}
              axios.patch(`${API_END_POINT}/api/update/hotelRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    } else {
      axios.get(`${API_END_POINT}/api/fetchById/packageRating-fetchById/${itemId}`)
      .then(response => {
        this.setState({
          operator: response.data,
        }, () => {
          this.setState(prevState => ({
            operator: {
                ...prevState.operator,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'packageRating' : JSON.stringify(this.state.operator)}
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
    if(confirm("Are you sure you want to delete this operator?")) {
      axios.delete(`${API_END_POINT}/api/operators/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const operators = this.state.operators.slice();
          operators.splice(index, 1);
          this.setState({ operators });
          window.alert(response.data.msg);
        });
    }
  }

  deleteItem(itemId, index) {
    if(confirm("Are you sure you want to delete this operator?")) {
      axios.delete(`${API_END_POINT}/api/v1/operators/destroy_operator`, {
        headers: {"Authentication": token, "UUID": UUID },
        data: {
          "operator_id": itemId
        }
      })
        .then(response => {
          const operatorDetails = this.state.operatorDetails.slice();
          operatorDetails.splice(index, 1);
          this.setState({ operatorDetails });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.operators,
          activePage: page
        })
      })
  }
  
  handleSearch() {
    this.setState({loading: true, operators: [], responseMessage: 'Loading Operators...'})
    axios.get(`${API_END_POINT}/api/operators/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          operators: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Operators Found...'
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
              <h3>List of Operators{/* match.params.categoryId ? `for category: ${match.params.categoryId}` : null */}</h3>
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
                  <Link to={`/operators/operator-form`}>
                    <button type="button" className="btn btn-success">Add new Operator</button>
                  </Link>
                </div>
              : null}
          </div>

          <div>         
            {/* <div className="row justify-content-between">
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
          </div> */}

          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Operator Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Gadget 1</th>
                  <th>Gadget 2</th>
                  <th>Primary Weapon</th>
                  <th>Secondary Weapon</th>
                  <th>Description</th>
                  {/* <th>Popular</th>
                  <th>Favourite</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.operators && this.state.operators.length >= 1 ?
                  this.state.operators.map((operator, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{operator.operator_id}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={operator.logo && operator.logo} />}</td>
                    <td>{operator.name}</td>
                    <td>{operator.gadget1 ? operator.gadget1 : "-"}</td>
                    <td>{operator.gadget2 ? operator.gadget2 : "-"}</td>
                    <td>{operator.primary_weapon ? operator.primary_weapon : "-"}</td>
                    <td>{operator.secondary_weapon ? operator.secondary_weapon : "-"}</td>
                    <td>{operator.description}</td>
                    {/* <td>{operator.isPopular ? "Yes" : "No"}</td>
                    <td>{operator.favourite ? "Yes" : "No"}</td> */}
                    <td>
                        <Link to={`/operators/edit-operator/${operator.operator_id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteItem(operator.operator_id, index)}></span>
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
            <Pagination prev next operators={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      {/* //   : null
      // } */}
      </div>
    </div>
    );
  }
}
