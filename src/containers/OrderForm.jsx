import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Cookie from 'js-cookie';

const token = Cookie.get('r6pro_access_token');

export default class CityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      order: {
        numberOfOrders: 0,
      },
      users: [],
      user: "",
      items: [],
      item: "",
      gallery: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postOrder = this.postOrder.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/users`)
      .then(response => {
        this.setState({
          users: response.data.objects,
        })
      })
      axios.get(`${API_END_POINT}/api/items`, {headers: {"auth-token": token} })
      .then(response => {
        this.setState({
          items: response.data.objects,
          loading: false
        })
      })
    }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.orderId) {
      axios.get(`${API_END_POINT}/api/orders/one`, { params: {"orderId": match.params.orderId}, headers: {"auth-token" : token} })
        .then((response) => {
          this.setState({
            order: response.data.object[0],
          }, () => {
            this.getUserFromId();
            this.getItembyId();
          });
        });
    }
  }

  getUserFromId = () => {
    axios.get(`${API_END_POINT}/api/users/one`, {params: {"userId": this.state.order.userId}})
    .then((response) => {
      this.setState({
        user: response.data.object[0],
      });
    });
  }

  getItembyId = () => {
    axios.get(`${API_END_POINT}/api/items/one`, { params: {"itemId": this.state.order.itemId}, headers: {"auth-token" : token} })
    .then((response) => {
      this.setState({
        item: response.data.object[0],
      });
    });
  }

  // componentDidMount() {
  //   console.log('props',this.props);
  //     if (window.location.href.split('/')[3] === 'edit_city')
  //     axios.get(`${API_END_POINT}/api/fetchById/order-fetchById/${match.params.cityId}`)
  //       .then((response) => {
  //         this.setState({
  //           order: response.data[0],
  //           description: RichTextEditor.createValueFromString(response.data.description, 'html'),
  //         });
  //       });
  //   }

  setDescription(description) {
    const { order } = this.state;
    order.description = description.toString('html');
    this.setState({
      order,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { order } = this.state;
    order[name] = value;
    this.setState({ order });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postOrder(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, order, gallery } = this.state;
        this.setState({ loading: true });

        if(match.params.orderId) {
          order.orderId = order._id;
          delete order["_id"];
          delete order["userId"];
          delete order["itemId"];
          delete order["date"];
          delete order["__v"];
        axios.post(`${API_END_POINT}/api/orders/update`, order, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert(response.data.error)
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({
              loading: false
            })
          })
        }
        else {
          axios.post(`${API_END_POINT}/api/orders/`, order, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert(response.data.error)
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({
              loading: false
            })
          })
        }
    }

    setUser = (selectedUser) => {
      this.setState(prevState => ({
        user: selectedUser,
        order: {
          ...prevState.order,
          userId: selectedUser._id,
        },
      }));
    }

    setItem(selectedItem) {
      this.setState(prevState => ({
        item: selectedItem,
        order: {
          ...prevState.order,
          itemId: selectedItem._id,
        },
      }));
    }

  render() {
    const {
      loading,
      order,
      description,
      user,
      users,
      item,
      items,
    } = this.state;
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Order Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postOrder}
                  >
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">User</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="itemId"
                          value={user}
                          onChange={value => this.setUser(value)}
                          options={users}
                          valueKey="_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Items</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="itemId"
                          value={item}
                          onChange={value => this.setItem(value)}
                          options={items}
                          valueKey="_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >No. of orders
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="numberOfOrders"
                          className="form-control"
                          value={order.numberOfOrders}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`}/> Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

