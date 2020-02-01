import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import _ from 'lodash';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ItemsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      item: {
        name: '',
        description: '',
        image: '',
        favourite: false,
        isPopular: false,
        price: '',
        categoryId: '',
        brandName: '',
        isSpecialOffer: false,
        specialOfferPrice: '',
        status: '',
      },
      category: "",
      categories: []
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postItem = this.postItem.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/categories`)
      .then(response => {
        this.setState({
          categories: response.data.objects,
        })
      })
  }

  componentDidMount() {
    const { match } = this.props;
    if(match.params.itemId) {
      this.getItembyId();
    }
  }

  getItembyId = () => {
    const { match } = this.props;
    axios.get(`${API_END_POINT}/api/items/one`, { params: {"itemId": match.params.itemId}, headers: {"auth-token" : token} })
    .then((response) => {
      this.setState({
        item: response.data.object[0],
      }, () => {
        axios.get(`${API_END_POINT}/api/categories/one`, { params: {"categoryId": this.state.item.categoryId}, headers: {"auth-token" : token} })
        .then(response => {
          this.setState({
            category: response.data.object[0],
          })
        })
      });
    });
  }

    fetchUsers() {
        axios.get(`${API_END_POINT}/api/user/fetch`)
        .then(response => {
        this.setState({
          users: response.data,
        })
      })
    }

    fetchHotels() {
        axios.get(`${API_END_POINT}/api/hotel/fetch`)
        .then(response => {
        this.setState({
          hotels: response.data,
        })
      })
    }

    fetchPackages() {
        axios.get(`${API_END_POINT}/api/fetch/packagePage-fetch`)
        .then(response => {
        this.setState({
          packages: response.data,
        })
      })
    }

    fetchExperiences() {
      axios.get(`${API_END_POINT}/api/fetch/experience-fetch`)
      .then(response => {
      this.setState({
        experiences: response.data,
      })
    })
  }

    setHotel = (selectedHotel) => {
        this.setState(prevState => ({
            hotel: selectedHotel,
            item: {
                ...prevState.item,
                hotel_id: selectedHotel.ID,
            },
            }));
        }
    
    setPackage = (selectedPackage) => {
    this.setState(prevState => ({
        pckg: selectedPackage,
        item: {
            ...prevState.item,
            package_id: selectedPackage.ID,
        },
        }));
    }

    setUser = (selectedUser) => {
        this.setState(prevState => ({
            user: selectedUser,
            item: {
                ...prevState.item,
                user_id: selectedUser.ID,
                user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
            },
            }));
        }

    setExperience = (selectedExperience) => {
      this.setState(prevState => ({
          experience: selectedExperience,
          item: {
              ...prevState.item,
              expereience_id: selectedExperience.ID,
          },
          }));
      }

  setDescription(description) {
    const { item } = this.state;
    item.comment = description.toString('html');
    this.setState({
      item,
      description,
    });
  }

  setCategory(selectedCategory) {
    this.setState(prevState => ({
      category: selectedCategory,
      item: {
        ...prevState.item,
        categoryId: selectedCategory._id,
      },
    }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { item } = this.state;
    item[name] = value;
    this.setState({ item });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postItem(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, item } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      delete item["isSpecialOffer"];
      delete item["specialOfferPrice"]

      if(match.params.itemId) {
        item.itemId = item._id
        delete item["_id"]
        delete item["date"]
        delete item["__v"]
        this.setState({ item });
        axios.post(`${API_END_POINT}/api/items/update`, item, {headers: {"auth-token": token}})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert(response.data.msg);
            this.setState({ loading: false });
          } else {
            window.alert('ERROR')
            this.setState({ loading: false });
          }
        });
      } else {
        axios.post(`${API_END_POINT}/api/items`, item, {headers: {"auth-token": token}})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert(response.data.msg);
            this.setState({ loading: false });
          } else {
            window.alert('ERROR', response.data.error)
            this.setState({ loading: false });
          }
        });
      }
    }
    }

  render() {
    const {
      loading,
      item,
      category,
      categories,
    } = this.state;
    const { location } = this.props;
    // const selectedFormName = _.startCase(location.state.selectedRating);
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Item Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postItem}
                  >

                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Category</label>
                    <div className="col-md-6 col-sm-6">
                      <Select
                        name="categoryId"
                        value={category}
                        onChange={value => this.setCategory(value)}
                        options={categories}
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
                      >Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={item.name}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Description
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="description"
                          className="form-control"
                          value={item.description}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Image
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="image"
                          className="form-control"
                          value={item.image}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="price"
                          className="form-control"
                          value={item.price}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Status
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="status"
                          className="form-control"
                          value={item.status}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Brand Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="brandName"
                          className="form-control"
                          value={item.brandName}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Favourite</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={item.favourite}
                        onClick={() => {
                          item.favourite = !item.favourite;
                          this.setState({ item })
                        }}
                      />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Popular</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={item.isPopular}
                        onClick={() => {
                          item.isPopular = !item.isPopular;
                          this.setState({ item })
                        }}
                      />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Special Offer</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={item.isSpecialOffer}
                        onClick={() => {
                          item.isSpecialOffer = !item.isSpecialOffer;
                          this.setState({ item })
                        }}
                      />
                      </div>
                    </div>

                    {
                      item.isSpecialOffer
                      ?
                      <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Special Offer Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="specialOfferPrice"
                          className="form-control"
                          value={item.specialOfferPrice}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Item should only range between 1 to 5"
                        />
                      </div>
                    </div>
                    :
                    null
                    }

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Status</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="status"
                          value={item.status}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="PENDING">Disabled</option>
                          <option value="ACCEPTED">Active</option>
                        </select>
                      </div>
                    </div> */}

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

