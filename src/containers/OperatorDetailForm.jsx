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

export default class OperatorDetailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      operatorDetails: {
        name: '',
        description: '',
        logo: '',
      },
      strategy: "",
      strategies: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postOperator = this.postOperator.bind(this);
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
    if(match.params.operatorDetailsId) {
      axios.get(`${API_END_POINT}/api/v1/operator_details/get_operator_detail?operator_detail_id=${match.params.operatorDetailsId}`, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          this.setState({
            operatorDetails: response.data,
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
      operatorDetails: {
        ...prevState.operatorDetails,
        strategy_id: selectedStrategy.strategy_id,
      },
    }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { operatorDetails } = this.state;
    operatorDetails[name] = value;
    this.setState({ operatorDetails });
  }

  handleImages = (event) => {
    const { operatorDetails } = this.state;
    operatorDetails.logo = event.target.files[0];
    this.setState({ operatorDetails });
  }

  postOperator(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, operatorDetails } = this.state;

    const fd = new FormData();
    Object.keys(operatorDetails).forEach((eachState, index) => {
      fd.append(`${eachState}`, operatorDetails[eachState]);
    })

    if (!loading) {
      this.setState({ loading: true });
      if(match.params.operatorDetailsId) {
        axios.post(`${API_END_POINT}/api/v1/operator_details/update_operator_detail?operator_detail_id=${match.params.operatorDetailsId}`, fd, {headers: {"auth-token": token}})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert(response.data.msg);
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
        axios.post(`${API_END_POINT}/api/v1/operator_details`, fd, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          if (response.data && response.status === 200) {
            window.alert(response.data.msg);
            this.setState({ loading: false });
          } else {
            window.alert('ERROR', response.data.error)
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
      operatorDetails
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
                    onSubmit={this.postOperator}
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
                          value={operatorDetails.name}
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
                          value={operatorDetails.description}
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
                          name="image"
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
                        checked={operatorDetails.favourite}
                        onClick={() => {
                          operatorDetails.favourite = !operatorDetails.favourite;
                          this.setState({ operatorDetails })
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

