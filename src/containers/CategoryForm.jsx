import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const token = Cookie.get('r6pro_access_token');

export default class AreaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      category: {
        name: '',
        // city_id: '',
        // province: '',
        // views: '',
        // image_type: '',
        description: '',
        image: '',
      },
      gallery: '',
      city: '',
      cities: [],
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCategory = this.postCategory.bind(this);
  }

  componentWillMount() {
    // axios.get(`${API_END_POINT}/api/fetch/city-fetch?all=true`)
    //     .then((response) => {
    //       this.setState({
    //         cities: response.data.items,
    //       });
    //     });
  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
      if (match.params.categoryId)
      axios.get(`${API_END_POINT}/api/categories/one`, { params: {"categoryId": match.params.categoryId} })
        .then((response) => {
          this.setState({
            category: response.data.object[0],
            // description: RichTextEditor.createValueFromString(response.data[0].description, 'html'),
          }, () => {
            // axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.category.city_id}`)
            // .then((response) => {
            //   this.setState({
            //     city: response.data[0],
            //   });
            // });
          });
        });
      }

  setDescription(description) {
    const { category } = this.state;
    category.description = description.toString('html');
    this.setState({
      category,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { category } = this.state;
    category[name] = value;
    this.setState({ category });
  }

  // handleFile = (event) => {
  //   this.setState({
  //     files: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      category: {
        ...prevState.category,
        city_id: selectedCity.ID,
        province: selectedCity.province
      },
    }))
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postCategory(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, category, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });

        if(match.params.categoryId) {
          category.categoryId = category._id
          delete category["_id"]
          delete category["userId"]
          delete category["date"]
          delete category["__v"]
          this.setState({ category });
          axios.post(`${API_END_POINT}/api/categories/update`, category, {headers: {"auth-token": token}})
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
          axios.post(`${API_END_POINT}/api/categories`, category, {headers: {"auth-token": token}})
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

    deleteImage = (url, ID) => {
      const data =  {ID, url}
      let requestBody = { 'locationGallery' : JSON.stringify(data)};
      if(confirm("Are you sure you want to delete this image?")) {
        // axios.delete(`${API_END_POINT}/api/delete/Image-deleteByPublicId`, {reqBody})
        axios.delete(`${API_END_POINT}/api/deleteGallery/category-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
          .then(response => {
            if(response.status === 200) {
              window.alert('Image deleted Successfully!')
            }
            // const category = this.state.category[gallery].slice();
            // category.splice(index, 1);
            // this.setState({ category });

            const { category } = this.state;
            category.gallery.splice(index, 1);
            this.setState({ category });
          });
      }
    }

  render() {
    console.log('this.state', this.state);
    const {
      loading,
      category,
      cities,
      city,
      description,
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter category Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCategory}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Category Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={category.name}
                          onChange={this.handleInputChange}
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
                          value={category.description}
                          onChange={this.handleInputChange}
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
                          value={category.image}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >City
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="city"
                          className="form-control"
                          value={category.city}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">City</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="city_id"
                              value={city}
                              onChange={value => this.setCity(value)}
                              options={cities}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Province</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="province"
                          value={category.province}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="punjab">Punjab</option>
                          <option value="sindh">Sindh</option>
                          <option value="balochistan">Balochistan</option>
                          <option value="khyberPakhtunKhawa">Khyber PakhtunKhawa</option>
                          <option value="gilgitBaltistan">Gilgit Baltistan</option>
                          <option value="azadKashmir">Azad Kashmir</option>
                        </select>
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Province
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="province"
                          className="form-control"
                          value={category.province}
                          onChange={this.handleInputChange}
                          disabled={category.city_id ? 1 : 0}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Video Link
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="text"
                          name="video_link"
                          className="form-control"
                          value={category.video_link}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Category Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={category.gallery ? 0 : 1}
                        />
                      </div>
                    </div> */}

                    {category.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {category.gallery.map((image,index) => {
                          return (
                          <span key={index}>
                            <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${image.url}`}
                            alt="cover"
                          />
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, category.ID)}/>
                        </span>
                          )
                        })}
                        </div>
                      </div>
                      ) : null
                              }

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Recommended</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={category.recommended}
                        onClick={() => {
                          category.recommended = !category.recommended;
                          this.setState({ category })
                        }}
                      />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Description</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
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
