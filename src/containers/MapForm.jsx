import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

export default class MapForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      map: {
        name: '',
        image: "",
      },
      gallery: [],
      description: RichTextEditor.createEmptyValue(),
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { match } = this.props;
    const requestParams = {
      "popularId": match.params.popularId,
    }
      if (match.params.popularId)
      axios.get(`${API_END_POINT}/api/users/one`, {params: requestParams})
        .then((response) => {
          this.setState({
            map: response.data.object[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            // axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.map.city_id}`)
            // .then((response) => {
            //   this.setState({
            //     city: response.data[0],
            //   });
            // });
          });
        });
    }

    handleImages = (event) => {
      const { map } = this.state;
      map.image = event.target.files[0];
      this.setState({ gallery: event.target.files[0], map });
    }

    setCity(selectedCity) {
      this.setState(prevState => ({
        city: selectedCity,
        map: {
          ...prevState.map,
          city_id: selectedCity.ID,
        },
      }));
    }

  setDescription(description) {
    const { map } = this.state;
    map.description = description.toString('html');
    this.setState({
      map,
      description,
    });
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;

    const { map } = this.state;
    map[name] = value;
    this.setState({ map });
  }

  postMap = (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, map } = this.state;

    const fd = new FormData();
    Object.keys(map).forEach((eachState, index) => {
      fd.append(`${eachState}`, map[eachState]);
    })

    if (!loading) {

        this.setState({ loading: true });
        if(match.params.popularId) {
          map.popularId = map._id
          this.setState({ map });
          // axios.patch('/api/map/update', fd)
          axios.post(`${API_END_POINT}/api/users/update`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:', response.data.error)
              this.setState({ loading: false });
            }
          });
        }
        else {
          axios.post(`${API_END_POINT}/api/v1/maps`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert("MAP SAVED!");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR!')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR:')
            this.setState({ loading: false });
          })
        }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    console.log("MAP MAP", this.state);
    const {
      map
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Map Item Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postMap}
                  >

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
                        value={map.name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>

                  {/* <div className="form-group row">
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
                        value={map.image}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div> */}

                  <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Map Image</label>
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

