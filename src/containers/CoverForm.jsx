import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class GalleryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      gallery: {
        name: '',
        image: '',
        description: '',
        userId: '5dc6d284b5e92a40bdc606e7',
      },
      hotels: [],
      hotel: '',
      startDate: null,
      endDate: null,
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCoverBanner = this.postCoverBanner.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props)
    const { match } = this.props;
    if (match.params.coverBannerId) {
      axios.get(`${API_END_POINT}/api/gallery/one`, { params: {"galleryId": match.params.coverBannerId}, headers: {"auth-token" : token}} )
        .then((response) => {
          this.setState({
            gallery: response.data.object[0]
          },() => {
            // axios.get(`${API_END_POINT}/api/hotel/fetchById/${this.state.gallery.hotel_id}`)
            // .then((response) => {
            //   this.setState({
            //     hotel: response.data,
            //     startDate: moment(this.state.gallery.start_date),
            //     endDate: moment(this.state.gallery.end_date),
            //   })
            // })
          });
        });
    }
  }

  setHotel(selectedHotel) {
    this.setState(prevState => ({
      hotel: selectedHotel,
      gallery: {
        ...prevState.gallery,
        hotel_id: selectedHotel.ID,
      },
    }));
  }

  setDescription(description) {
    const { gallery } = this.state;
    gallery.description = description.toString('html');
    this.setState({
      gallery,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { gallery } = this.state;
    gallery[name] = value;
    this.setState({ gallery });
  }

  // handleImages = (event) => {
  //   this.setState({ gallery: event.target.files[0] });
  // }

  postCoverBanner(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, gallery } = this.state;
        this.setState({ loading: true });

        // let imgArray = [];
        const fd = new FormData();
        fd.append('image', gallery);

        fd.append('coverBanner', JSON.stringify(gallery));

        if(match.params.coverBannerId) {
        gallery.galleryId = gallery._id
        delete gallery["_id"]
        delete gallery["userId"]
        delete gallery["date"]
        delete gallery["__v"]
        // this.setState({ gallery });
        axios.post(`${API_END_POINT}/api/gallery/update`, gallery, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          axios.post(`${API_END_POINT}/api/gallery`, gallery, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        }

  render() {
    const {
      loading,
      gallery,
      hotel,
      hotels,
      startDate,
      endDate,
      description,
      focusedInput,
    } = this.state;
    console.log(this.state);
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
      INLINE_STYLE_BUTTONS: [
        {
          label: 'Bold',
          style: 'BOLD',
          className: 'custom-css-class',
        },
        {
          label: 'Italic',
          style: 'ITALIC',
        },
        {
          label: 'Underline',
          style: 'UNDERLINE',
        },
      ],
      BLOCK_TYPE_DROPDOWN: [
        {
          label: 'Normal',
          style: 'unstyled',
        },
        {
          label: 'Large Heading',
          style: 'header-three',
        },
        {
          label: 'Medium Heading',
          style: 'header-four',
        },
        {
          label: 'Small Heading',
          style: 'header-five',
        },
      ],
      BLOCK_TYPE_BUTTONS: [
        {
          label: 'UL',
          style: 'unordered-list-item',
        },
        {
          label: 'OL',
          style: 'ordered-list-item',
        },
      ],
    };
    // console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter gallery Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCoverBanner}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >User Id 
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          readOnly
                          required
                          type="text"
                          name="userId"
                          className="form-control"
                          value={gallery.userId}
                          onChange={this.handleInputChange}
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
                          value={gallery.name}
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
                          value={gallery.description}
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
                          value={gallery.image}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >gallery Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={gallery.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
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
                          value={gallery.province}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Views
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="views"
                          className="form-control"
                          value={gallery.views}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Hotel</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="hotel_id"
                              value={hotel}
                              onChange={value => this.setHotel(value)}
                              options={hotels}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                            //   required
                            />
                          </div>
                        </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Agency Id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="agency_id"
                          className="form-control"
                          value={gallery.agency_id}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={gallery.image_type}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="lounge">Lounge Image</option>
                          <option value="main_hall">Main Hall Image</option>
                        </select>
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Hotel</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="hotel_id"
                              value={hotel}
                              onChange={value => this.setHotel(value)}
                              options={hotels}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Upload</label>
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

                    {gallery.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${gallery.image.url}`}
                          alt="gallery"
                        />
                          
                        </div>
                      </div>
                      ) : null
                              } */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Date Range</label>
                      <div className="col-md-6 col-sm-6">
                        <DateRangePicker
                            startDate={gallery.start_date ? moment(gallery.start_date) : startDate}
                            endDate={gallery.end_date ? moment(gallery.end_date) : endDate}
                            startDateId="date_input_start"
                            endDateId="date_input_end"
                            onDatesChange={({ startDate: dateStart, endDate: dateEnd }) => (
                            this.setState({
                                startDate: dateStart,
                                endDate: dateEnd,
                            }, () => {
                                this.setState(prevState => ({
                                    gallery: {...prevState.gallery, start_date: this.state.startDate, end_date: this.state.endDate},
                                }))
                            }))}
                            focusedInput={focusedInput}
                            onFocusChange={input => this.setState({ focusedInput: input })}
                            required
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

