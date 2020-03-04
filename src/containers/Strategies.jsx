import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
// import Swal from 'sweetalert2'
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import HasRole from '../hoc/HasRole';

export default class Strategies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      strategies: [],
      activePage: 1,
      pages: 1,
      q: '',
      pageSize: 10,
      responseMessage: 'Loading Strategies...'
    }
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/strategies`, {headers: {"Authentication": token, "UUID": UUID }})
    .then(response => {
      this.setState({
        strategies: response.data,
        // pages: Math.ceil(response.data.total/10),
        responseMessage: 'No Strategies Found...'
      })
    })
  }
  
  getParams() {
    const {
      activePage,
      pageSize,
    } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
  }

  deleteStrategy(strategy_id, index) {
    if(confirm("Are you sure you want to delete this strategy?")) {
      axios.delete(`${API_END_POINT}/api/v1/strategies/destroy_strategy`, {
        headers: {"Authentication": token, "UUID": UUID },
        data: {
          "strategy_id": strategy_id
        }
      })
        .then(response => {
          if(response.status === 200) {
          window.alert(response.data.message)
          
          const strategies = this.state.strategies.slice();
          strategies.splice(index, 1);
          this.setState({ strategies });
          }
        })
        .catch((error) => {
          window.alert("ERROR")
        })
    }
  }
  handleSelect(page) {
    this.setState({ activePage: page }, () => {
      axios.get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
    // axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
    .then(response => {
      this.setState({
        strategies: response.data.items,
        activePage: page
      })
    })
    })
  }
  handleSearch() {
    axios.get(`/api/strategy?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          strategies: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Strategies</h3>
            </div>
            <div className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>

            <div className="col-sm-4 pull-right mobile-space">
                <Link to="/strategies/strategy-form">
                  <button type="button" className="btn btn-success">Add new Strategies</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Strategy Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Strategy Type</th>
                </tr>
              </thead>
              <tbody>
                {this.state.strategies && this.state.strategies.length >= 1 ?
                  this.state.strategies.map((strategy, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{strategy.strategy_id}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={strategy.image && strategy.image} />}</td>
                    <td>{strategy.name}</td>
                    {/* <td>{strategy.size}</td> */}
                    <td>{strategy.strategy_type}</td>
                    <td>
                      <Link to={`/strategies/operator/${strategy.strategy_id}`}>
                        <button type="button" className="btn btn-info btn-sm">Operator</button>
                      </Link>
                    </td>
                      <td>
                        <Link to={`/strategies/edit-strategy/${strategy.strategy_id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteStrategy(strategy.strategy_id, index)}></span>
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
      </div>
    );
  }
}
