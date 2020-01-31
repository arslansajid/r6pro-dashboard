import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { API_END_POINT } from '../config';
// import Swal from 'sweetalert2';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      room: {
        hotel_id: '',
        title: '',
        persons: '',
        beds: '',
        price_per_night: '',
        bed_type: '',
        pets_allowed: '',
        smoking_allowed: '',
        responseMessage: 'Loading Rooms...'
      },
      gallery: '',
      hotel: '',
      rooms: [],
      description: RichTextEditor.createEmptyValue(),
    };
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postRoom = this.postRoom.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;
    if(match.params.hotelId) {
      this.fetchRooms();
    }
    
  }

  fetchRooms = () => {
    const { match } = this.props;
    axios.get(`${API_END_POINT}/api/room/fetchByHotelId/${match.params.hotelId}`)
        .then((response) => {
          this.setState({
            rooms: response.data,
          });
        });
  }

  componentDidMount() {
    const { match } = this.props;
    const { room } = this.state;
    console.log('props',this.props)
    this.setState({
      room: {...room, hotel_id: match.params.hotelId}
    })
    // axios.get(`${API_END_POINT}/api/hotel/fetchById/${match.params.hotelId}`)
    //     .then((response) => {
    //       this.setState({
    //         hotel: response.data,
    //       });
    //     });
    if (match.params.roomId) {
      axios.get(`${API_END_POINT}/api/room/fetchById/${match.params.roomId}`)
        .then((response) => {
          this.setState({
            room: response.data[0],
            description: RichTextEditor.createValueFromString(response.data[0].description, 'html'),
          });
        });
    }
  }

  setDescription(description) {
    const { room } = this.state;
    room.description = description.toString('html');
    this.setState({
      room,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { room } = this.state;
    let arr = []; 
    if (name === 'room_amenities') {
      arr.push(value)
      console.log(value)
      this.setState({
        room: {...room, room_amenities: arr}
      })
    } else {
    room[name] = value;
    this.setState({ room });
    }
    
  }

  // handleFile(event) {
  //   this.setState({
  //     gallery: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  // setCity(selectedCity) {
  //   this.setState(prevState => ({
  //     room: selectedCity,
  //     room: {
  //       ...prevState.room,
  //       city_id: selectedCity.ID,
  //     },
  //   }));
  // }

  // setLocation(selectedLocation) {
  //   this.setState(prevState => ({
  //     location: selectedLocation,
  //     room: {
  //       ...prevState.room,
  //       location_id: selectedLocation.ID,
  //     },
  //   }));
  // }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  deleteRoom = (roomId, index) => {
    if(confirm("Are you sure you want to delete this room?")) {
      axios.delete(`${API_END_POINT}/api/delete/room-deleteById/${roomId}`)
        .then(response => {
          if(response.status === 200) {
            Swal.fire({
              type: 'success',
              title: 'Deleted...',
              text: 'City has been deleted successfully!',
            })
          }
          
          const rooms = this.state.rooms.slice();
          rooms.splice(index, 1);
          this.setState({ rooms });
        });
    }
  }

  deleteImage = (url, ID) => {
    const data =  {ID, url}
    let requestBody = { 'roomGallery' : JSON.stringify(data)};
    if(confirm("Are you sure you want to delete this image?")) {
      axios.delete(`${API_END_POINT}/api/deleteGallery/room-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
        .then(response => {
          if(response.status === 200) {
            window.alert('Image deleted Successfully!')
          }
          // const room = this.state.room[gallery].slice();
          // room.splice(index, 1);
          // this.setState({ room });

            const { room } = this.state;
            room.gallery.splice(index, 1);
            this.setState({ room });
        });
    }
  }

  postRoom(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, room, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });
        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery_images', img);
          return img;
        });

        fd.append('room', JSON.stringify(room));
        this.setState({ loading: true });
        // axios.post('/api/room/save', fd)
        if(match.params.roomId) {
          axios.patch(`${API_END_POINT}/api/room/update`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
             this.setState({ loading: false })
             window.alert('Error: Room not saved!')
            }
        });
        } else {
          axios.post(`${API_END_POINT}/api/room/save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
              if(match.params.hotelId) {
                this.fetchRooms();
              }
            } else {
             this.setState({ loading: false })
             window.alert('Error: Room not saved!')
            }
        });
        }
    }
  }

  render() {
    console.log(this.state)
    const {
      loading,
      room,
      hotel,
      description,
      responseMessage
    } = this.state;
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
                  <h2>Enter Room Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postRoom}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Room Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="title"
                          className="form-control"
                          value={room.title}
                          onChange={this.handleInputChange}
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
                          name="price_per_night"
                          className="form-control"
                          value={room.price_per_night}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Room Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={room.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {room.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {room.gallery.map((image,index) => {
                          return (
                          <span key={index}>
                            <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${image.url}`}
                            alt="cover"
                          />
                            <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, room.ID)}/>
                          </span>
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Persons Allowed
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="persons"
                          className="form-control"
                          value={room.persons}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >No. of Beds
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="beds"
                          className="form-control"
                          value={room.beds}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Bed Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="bed_type"
                          className="form-control"
                          value={room.bed_type}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Room Amenities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="room_amenities"
                          className="form-control"
                          value={room.room_amenities}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Pets Allowed</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="pets_allowed"
                          value={room.pets_allowed}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Smoking Allowed</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="smoking_allowed"
                          value={room.smoking_allowed}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
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
                {
                  this.props.match.params.roomId
                ?
                null
                :
                <div>
                <h1>Rooms available at {this.props.location.state.hotelName}</h1>
                <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Persons Allowed</th>
                  <th>Beds Count</th>
                  <th>Bed Type</th>
                  {/* <th>Email</th> */}
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.rooms && this.state.rooms.length >= 1 ?
                this.state.rooms.map((room, index) => (
                  <tr key={index}>
                  <td>{room.ID}</td>
                  <td>{room.title}</td>
                  {/* <td>{<img style={{height: '50px', width: '50px'}} src={room.profile_picture.url}/>}</td> */}
                  <td>{room.persons}</td>
                  <td>{room.beds}</td>
                  <td>{room.bed_type}</td>
                    {/* <td>{room.firstName}</td>
                    <td>{room.phone}</td>
                    <td>{area.room.name}</td>
                    <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_rooms/${room.ID}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteRoom(room.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
                    </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          </div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

