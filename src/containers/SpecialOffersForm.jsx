import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';

import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      site: {
        map_id: '',
        name: '',
        image: '',
      },
      maps: [],
      map: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postSpecialUser = this.postSpecialUser.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/maps`, {headers: {"Authentication": token, "UUID": UUID }} )
      .then(response => {
        this.setState({
          maps: response.data,
        })
      })
      .catch(err => {
        this.setState({
          maps: []
        })
      })
  }

  componentDidMount() {
    const { match } = this.props;
      if (match.params.specialOfferId) {
      axios.get(`${API_END_POINT}/api/v1/sites/get_site?site_id=${match.params.specialOfferId}`, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          this.setState({
            site: response.data
          });
        })
        .catch((error) => {
          window.alert(error)
        })
      }
    }

  setDescription(description) {
    const { site } = this.state;
    site.description = description.toString('html');
    this.setState({
      site,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { site } = this.state;
    site[name] = value;
    this.setState({ site });
  }

  postSpecialUser(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, site } = this.state;

    const fd = new FormData();
    Object.keys(site).forEach((eachState, index) => {
      fd.append(`${eachState}`, site[eachState]);
    })

    if (!loading) {
        this.setState({ loading: true });
        if(match.params.specialOfferId) {
          axios.put(`${API_END_POINT}/api/v1/sites/update_site?site_id=${match.params.specialOfferId}`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert("UPDATED");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:')
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            window.alert('ERROR:');
          })
        }
        else {
          axios.post(`${API_END_POINT}/api/v1/sites`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert('SAVED !');
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:')
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

  handleImages = (event) => {
    const { site } = this.state;
    site.image = event.target.files[0];
    this.setState({ site });
  }

  setMap(selectedItem) {
    this.setState(prevState => ({
      map: selectedItem,
      site: {
        ...prevState.site,
        map_id: selectedItem.map_id,
      },
    }));
  }

  render() {
    console.log(this.state);
    const { match } = this.props;
    const {
      loading,
      site,
      map,
      maps,
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Site Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postSpecialUser}
                  >
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Map</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="itemId"
                          value={map}
                          onChange={value => this.setMap(value)}
                          options={maps}
                          valueKey="_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                          readOnly={match.params.specialOfferId ? true : false}
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
                        value={site.name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Image</label>
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

