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

export default class OperatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      operator: {
        strategy_id: '',
        weapon_id: '',
        operator_details_id: false,
        sketch_image: false,
        summary_images: [],
      },
      category: "",
      categories: []
    };

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
    axios.get(`${API_END_POINT}/api/operators/one`, { params: {"itemId": match.params.itemId}, headers: {"auth-token" : token} })
    .then((response) => {
      this.setState({
        operator: response.data.object[0],
      }, () => {
        axios.get(`${API_END_POINT}/api/categories/one`, { params: {"categoryId": this.state.operator.categoryId}, headers: {"auth-token" : token} })
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
            operator: {
                ...prevState.operator,
                hotel_id: selectedHotel.ID,
            },
            }));
        }
    
    setPackage = (selectedPackage) => {
    this.setState(prevState => ({
        pckg: selectedPackage,
        operator: {
            ...prevState.operator,
            package_id: selectedPackage.ID,
        },
        }));
    }

    setUser = (selectedUser) => {
        this.setState(prevState => ({
            user: selectedUser,
            operator: {
                ...prevState.operator,
                user_id: selectedUser.ID,
                user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
            },
            }));
        }

    setExperience = (selectedExperience) => {
      this.setState(prevState => ({
          experience: selectedExperience,
          operator: {
              ...prevState.operator,
              expereience_id: selectedExperience.ID,
          },
          }));
      }

  setDescription(description) {
    const { operator } = this.state;
    operator.comment = description.toString('html');
    this.setState({
      operator,
      description,
    });
  }

  setCategory(selectedCategory) {
    this.setState(prevState => ({
      category: selectedCategory,
      operator: {
        ...prevState.operator,
        categoryId: selectedCategory._id,
      },
    }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { operator } = this.state;
    operator[name] = value;
    this.setState({ operator });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postItem(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, operator } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      delete operator["isSpecialOffer"];
      delete operator["specialOfferPrice"]

      if(match.params.itemId) {
        operator.itemId = operator._id
        delete operator["_id"]
        delete operator["date"]
        delete operator["__v"]
        this.setState({ operator });
        axios.post(`${API_END_POINT}/api/operators/update`, operator, {headers: {"auth-token": token}})
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
        axios.post(`${API_END_POINT}/api/operators`, operator, {headers: {"auth-token": token}})
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
      operator,
      category,
      categories,
    } = this.state;
    const { location } = this.props;
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Operator Details</h2>
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
                    <label className="control-label col-md-3 col-sm-3">Strategy</label>
                    <div className="col-md-6 col-sm-6">
                      <Select
                        name="strategy_id"
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
                      >weapon_id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={operator.name}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Operator should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >operator_details_id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="description"
                          className="form-control"
                          value={operator.description}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Operator should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">sketch_image</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="gallery"
                          className="form-control"
                          onChange={this.handleImages}
                          // multiple
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">summary_images</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="gallery"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Favourite</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={operator.favourite}
                        onClick={() => {
                          operator.favourite = !operator.favourite;
                          this.setState({ operator })
                        }}
                      />
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

