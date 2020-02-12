import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import HasRole from '../hoc/HasRole';

export default class OperatorDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operatorDetails: [],
      operator: '',
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading OperatorDetails...',
      status: 'All'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    // this.fetchItems(this.state.status);
    axios.get(`${API_END_POINT}/api/v1/operator_details`, {headers: {"Authentication": token, "UUID": UUID }})
    .then(response => {
      this.setState({
        operatorDetails: response.data,
        responseMessage: 'No OperatorDetails Found...'
      })
    })
  }

  fetchItems = (type) => {
    const { selectedRating } = this.state;
    this.setState({
      status: type,
      operatorDetails: [],
      responseMessage: 'Loading OperatorDetails...',
    })
      if(type === 'All') {
        axios.get(`${API_END_POINT}/api/operatorDetails`, {headers: {"auth-token": token} })
        .then(response => {
          this.setState({
            operatorDetails: response.data.objects,
            // pages: Math.ceil(response.data.length/10),
          })
        })
        .catch(err => {
          this.setState({
            responseMessage: 'No OperatorDetails for Hotels Found...'
          })
        })
      } else {
      axios.get(`${API_END_POINT}/api/fetchAll${type}/hotelRating-fetchAll${type}`)
        .then(response => {
          this.setState({
            operatorDetails: response.data,
            pages: Math.ceil(response.data.length/10),
            responseMessage: 'No OperatorDetails Found...'
          })
        })
        .catch((error) => {
          this.setState({
            responseMessage: 'No OperatorDetails Found...'
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
    if(confirm("Are you sure you want to delete this operator?")) {
      axios.delete(`${API_END_POINT}/api/v1/operator_details/destroy_operator_detail`, {
        headers: {"Authentication": token, "UUID": UUID },
        data: {
          "operator_detail_id": itemId
        }
      })
        .then(response => {
          const operatorDetails = this.state.operatorDetails.slice();
          operatorDetails.splice(index, 1);
          this.setState({ operatorDetails });
          window.alert(response.data.msg);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.operatorDetails,
          activePage: page
        })
      })
  }
  
  handleSearch() {
    this.setState({loading: true, operatorDetails: [], responseMessage: 'Loading OperatorDetails...'})
    axios.get(`${API_END_POINT}/api/operatorDetails/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          operatorDetails: response.data.searchedItems,
          loading: false,
          responseMessage: 'No OperatorDetails Found...'
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
              <h3>List of Operator Details</h3>
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
                  <Link to={`/operator-details/operator-details-form`}>
                    <button type="button" className="btn btn-success">Add new Operator Details</button>
                  </Link>
                </div>
              : null}
          </div>

          <div>                   
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Operator Detail Id</th>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.operatorDetails && this.state.operatorDetails.length >= 1 ?
                  this.state.operatorDetails.map((operator, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{operator.operator_detail_id}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={operator.logo && operator.logo} />}</td>
                    <td>{operator.name}</td>
                    <td>{operator.description}</td>
                    <td>
                        <Link to={`/operator-details/edit-operator-details/${operator.operator_detail_id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteItem(operator.operator_detail_id, index)}></span>
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
            <Pagination prev next operatorDetails={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      {/* //   : null
      // } */}
      </div>
    </div>
    );
  }
}
