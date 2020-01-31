import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT, PLACEHOLDER_URL } from '../config';
import moment from "moment";
import Cookie from 'js-cookie';

const token = Cookie.get('waffle_world_access_token');

import HasRole from '../hoc/HasRole';

export default class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      activePage: 1,
      pages: 1,
      q: '',
      status: 'all-orders',
      loading: false,
      responseMessage: 'Loading Orders...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    this.fetchOrders(this.state.status)
  }

  fetchOrders(orderName) {
    this.setState({ status: orderName, loading: true, responseMessage: 'Loading Orders...' });
    if(orderName === 'all-orders') {
    axios.get(`${API_END_POINT}/api/orders/`, {headers: {"auth-token" : token}})
      .then(response => {
        this.setState({
          orders: response.data.objects,
          pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No Orders Found...'
        })
      })
      .catch(err => {
        this.setState({
          loading: false,
          responseMessage: 'No Orders Found...'
        })
      })
    }
    // else if(orderName === 'packages') {
    //   axios.get(`${API_END_POINT}/api/fetch/packageContact-fetch`)
    //   .then(response => {
    //     this.setState({
    //       orders: response.data,
    //       pages: Math.ceil(response.data.length/10),
    //       responseMessage: 'No Orders Found...'
    //     })
    //   })
    //   .catch(err => {
    //     this.setState({
    //       responseMessage: 'No Orders for Packages Found...'
    //     })
    //   })
    // }

    //as now endpoints for previous and current
    //for the time being
    else {
      this.setState({
        orders: [],
        loading: false,
        responseMessage: 'No Orders Found...'
      })
    }
  }
  deleteOrder(orderId, index) {
    const requestParams = {
      "orderId": orderId,
    }
    if(confirm("Are you sure you want to delete this order?")) {
      axios.delete(`${API_END_POINT}/api/orders/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const orders = this.state.orders.slice();
          orders.splice(index, 1);
          this.setState({ orders });
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

  // handleOrderSelection(event) {
  //   this.setState({
  //     status: event.target.value,
  //   }, () => {
  //     this.fetchOrders(this.state.status)
  //   })
  // }

  render() {
    console.log("#### Orders:", this.state);
    const { status } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
        <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Orders</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>

            <div className="col-sm-4 pull-right mobile-space">
                <Link to="/orders/order_form">
                  <button type="button" className="btn btn-success">Add new Order</button>
                </Link>
            </div>
          </div>

          {/* <div className="form-group row space-1 d-flex align-items-center">
            <div className="col-sm-4 col-md-4">
              <h4 style={{float: "right", whiteSpace: 'nowrap', textAlign: "center"}}>Select Order :</h4>
            </div>
              <div className="col-md-4 col-sm-4">
                <select
                  name="status"
                  value={this.state.status}
                  className="form-control"
                  onChange={(event) => this.handleOrderSelection(event)}
                  required
                >
                  <option value="">Select Order Type</option>
                  <option value="all-orders">All orders</option>
                  <option value="previous-orders">Previous Orders</option>
                  <option value="current-orders">Current Orders</option>
                </select>
              </div>
            </div> */}

          <div> 
          <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
            <button
                type="button"
                style={{
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'all-orders' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchOrders('all-orders')}
              >All Orders
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'current-orders' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchOrders('current-orders')}
              >Current Orders
              </button>
              
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'previous-orders' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchOrders('previous-orders')}
              >Previous Orders
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Product Image</th>
                  <th>No. of Orders</th>
                  <th>Customer</th>
                  <th>Description</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.orders && this.state.orders.length >= 1 ?
                  this.state.orders.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={order.productImage ? order.productImage : PLACEHOLDER_URL }/>}</td>
                    <td>{order.numberOfOrders}</td>
                    <td>{order.userName}</td>
                    <td>{order.description}</td>
                    <td>{moment(order.date).format("DD-MMMM-YYYY")}</td>
                    {/* <td>
                      <Link to={`${API_END_POINT}/area_resource/${order.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    <td>
                        <Link to={`/orders/edit_order/${order._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                     <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteOrder(order._id, index)}></span>
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
    </div>
    );
  }
}
