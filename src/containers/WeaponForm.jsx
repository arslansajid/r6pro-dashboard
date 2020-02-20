import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import _ from 'lodash';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class WeaponForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      weapon: {
        name: "",
        gadget1: '',
        gadget2: '',
        primary_weapon: '',
        secondary_weapon: ''
      },
      strategy: "",
      strategies: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postWeapon = this.postWeapon.bind(this);
  }

  componentWillMount() {
    // axios.get(`${API_END_POINT}/api/v1/strategies`, {headers: {"Authentication": token, "UUID": UUID }})
    //   .then(response => {
    //     this.setState({
    //       strategies: response.data,
    //     })
    //   })
  }

  componentDidMount() {
    const { match } = this.props;
    if(match.params.weaponId) {
      axios.get(`${API_END_POINT}/api/v1/weapons/get_weapon?weapon_id=${match.params.weaponId}`, {headers: {"Authentication": token, "UUID": UUID }})
      .then((response) => {
        this.setState({
          weapon: response.data,
        });
      });
    }
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

  setStrategy(selectedStrategy) {
    this.setState(prevState => ({
      strategy: selectedStrategy,
      weapon: {
        ...prevState.weapon,
        strategy_id: selectedStrategy.strategy_id,
      },
    }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { weapon } = this.state;
    weapon[name] = value;
    this.setState({ weapon });
  }

  handleImages = (event) => {
    const { weapon } = this.state;
    weapon.logo = event.target.files[0];
    this.setState({ weapon });
  }

  postWeapon(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, weapon } = this.state;

    const fd = new FormData();
    Object.keys(weapon).forEach((eachState, index) => {
      fd.append(`${eachState}`, weapon[eachState]);
    })

    if (!loading) {
      this.setState({ loading: true });
      if(match.params.weaponId) {
        axios.put(`${API_END_POINT}/api/v1/weapons/update_weapon`, fd, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert("UPDATED");
            this.setState({ loading: false });
          } else {
            window.alert('ERROR')
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          })
          window.alert('ERROR')
        })
      } else {
        axios.post(`${API_END_POINT}/api/v1/weapons`, fd, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert("SAVED!");
            this.setState({ loading: false });
          } else {
            window.alert('ERROR')
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          })
          window.alert('ERROR')
        })
      }
    }
    }

  render() {
    const {
      loading,
      strategy,
      category,
      strategies,
      weapon
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
                  <h2>Enter Weapon Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postWeapon}
                  >

                  <div className="form-group row">
                    <label
                      className="control-label col-md-3 col-sm-3"
                    >First Name
                    </label>
                    <div className="col-md-6 col-sm-6">
                      <input
                        required
                        type="text"
                        name="name"
                        className="form-control"
                        value={weapon.name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>


                  <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Gadget 1
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="gadget1"
                          className="form-control"
                          value={weapon.gadget1}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Gadget 2
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="gadget2"
                          className="form-control"
                          value={weapon.gadget2}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Primary Weapon
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="primary_weapon"
                          className="form-control"
                          value={weapon.primary_weapon}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Secondary Weapon
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="secondary_weapon"
                          className="form-control"
                          value={weapon.secondary_weapon}
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

