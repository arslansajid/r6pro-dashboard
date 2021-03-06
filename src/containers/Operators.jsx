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
    const { match } = this.props;
    if(match.params.strategyId) {
      axios.get(`${API_END_POINT}/api/v1/strategies/${match.params.strategyId}/get_operators`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          operators: response.data,
          responseMessage: 'No Operators For Strategy Found...'
        })
      })
    } else {
      axios.get(`${API_END_POINT}/api/v1/operators`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          operators: response.data,
          responseMessage: 'No Operators Found...'
        })
      })
    }
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
    if(confirm("Are you sure you want to delete this operator?")) {
      axios.delete(`${API_END_POINT}/api/v1/operators/destroy_operator`, {
        headers: {"Authentication": token, "UUID": UUID },
        data: {
          "operator_id": itemId
        }
      })
        .then(response => {
          const operators = this.state.operators.slice();
          operators.splice(index, 1);
          this.setState({ operators });
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
              <h3>List of Operators {match.params.strategyId ? `for Strategy` : null}</h3>
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
              {!match.params.strategyId ? 
                <div className="col-sm-4 pull-right mobile-space">
                  <Link to={`/operators/operator-form`}>
                    <button type="button" className="btn btn-success">Add new Operator</button>
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
                    {
                    !match.params.strategyId
                    ?
                    <td>
                        <Link to={`/operators/edit-operator/${operator.operator_id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    :
                    null
                    }
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
