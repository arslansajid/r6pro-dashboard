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

export default class OperatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      operator: {
        weapon_id: '',
        operator_detail_id: this.props.selectedOperator ? this.props.selectedOperator.operator_id : "",
        sketch_image: [],
        video: "",
        upload_text: ""
      },
      strategy: "",
      strategies: [],
      operatorDetail: this.props.selectedOperator ? this.props.selectedOperator : "",
      operatorDetails: [],
      weapon: "",
      weapons: [],
      strategyMapImages: [],
      summaryImages: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postOperator = this.postOperator.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/strategies`, { headers: { "Authentication": token, "UUID": UUID } })
      .then(response => {
        this.setState({
          strategies: response.data,
        })
      })
    axios.get(`${API_END_POINT}/api/v1/operator_details`, { headers: { "Authentication": token, "UUID": UUID } })
      .then(response => {
        this.setState({
          operatorDetails: response.data,
        })
      })
    axios.get(`${API_END_POINT}/api/v1/weapons`, { headers: { "Authentication": token, "UUID": UUID } })
      .then(response => {
        this.setState({
          weapons: response.data,
        })
      })
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.operatorId) {
      axios.get(`${API_END_POINT}/api/v1/operators/get_operator?operator_id=${match.params.operatorId}`, { headers: { "Authentication": token, "UUID": UUID } })
        .then((response) => {
          this.setState({
            operator: response.data,
          }, () => {
            // axios.get(`${API_END_POINT}/api/v1/strategies/get_strategy?strategy_id=${this.state.operator.strategy_id}`, {headers: {"Authentication": token, "UUID": UUID }})
            // .then((response) => {
            //   this.setState({
            //     strategy: response.data,
            //   })
            // })
            axios.get(`${API_END_POINT}/api/v1/operator_details/get_operator_detail?operator_detail_id=${this.state.operator.operator_id}`, { headers: { "Authentication": token, "UUID": UUID } })
              .then((response) => {
                this.setState({
                  operatorDetail: response.data,
                });
              })
            axios.get(`${API_END_POINT}/api/v1/weapons/get_weapon?weapon_id=${this.state.operator.weapon_id}`, { headers: { "Authentication": token, "UUID": UUID } })
              .then((response) => {
                this.setState({
                  weapon: response.data,
                });
              });
          });
        });
    }
  }

  setWeapon = (selectedWeapon) => {
    this.setState(prevState => ({
      weapon: selectedWeapon,
      operator: {
        ...prevState.operator,
        weapon_id: selectedWeapon.weapon_id,
      },
    }));
  }

  setOperator = (selectedOperator) => {
    this.setState(prevState => ({
      operatorDetail: selectedOperator,
      operator: {
        ...prevState.operator,
        operator_detail_id: selectedOperator.operator_detail_id,
      }
    }));
  }

  // setStrategy(selectedStrategy) {
  //   this.setState(prevState => ({
  //     strategy: selectedStrategy,
  //     operator: {
  //       ...prevState.operator,
  //       strategy_id: selectedStrategy.strategy_id,
  //     },
  //   }));
  // }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { operator } = this.state;
    operator[name] = value;
    this.setState({ operator });
  }

  handleImages = (event) => {
    const { operator } = this.state;
    operator.sketch_image = event.target.files[0];
    this.setState({ operator });
  }

  handleVideo = (event) => {
    const { operator } = this.state;
    operator.video = event.target.files[0];
    this.setState({ operator });
  }

  handleStrategyMapsImages = (event) => {
    const { operator } = this.state;
    // operator["strategy_map_images"] = event.target.files;
    this.setState({ strategyMapImages: event.target.files, operator });
  }

  handleSummaryImages = (event) => {
    const { operator } = this.state;
    // operator["summary_images"] = event.target.files;
    this.setState({ summaryImages: event.target.files, operator });
  }

  postOperator(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, operator, strategyMapImages, summaryImages } = this.state;

    const fd = new FormData();
    let strategyMapImagesArray = [];
    let summaryImagesArray = [];

    for (let index = 0; index < strategyMapImages.length; index += 1) {
      strategyMapImagesArray.push(strategyMapImages[index]);
    }

    for (let index = 0; index < summaryImages.length; index += 1) {
      summaryImagesArray.push(summaryImages[index]);
    }

    Object.keys(operator).forEach((eachState, index) => {
      fd.append(`${eachState}`, operator[eachState]);
    })

    strategyMapImagesArray.forEach((img, index) => {
      fd.append(`strategy_map_images[${index}]`, img);
      return img;
    });

    summaryImagesArray.forEach((img, index) => {
      fd.append(`summary_images[${index}]`, img);
      return img;
    });

    if (!loading) {
      this.setState({ loading: true });
      if (match.params.operatorId) {
        axios.post(`${API_END_POINT}/api/v1/operators/update_operator?operator_id=${match.params.operatorId}`, fd, { headers: { "auth-token": token } })
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert("UPDATED!");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
      } else {
        axios.post(`${API_END_POINT}/api/v1/operators`, fd, { headers: { "Authentication": token, "UUID": UUID } })
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
      operator,
      operatorDetail,
      operatorDetails,
      weapon,
      weapons
    } = this.state;
    const { isModal, strategyName, selectedOperator } = this.props;

    console.log("#####PROPS ::", this.props);

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
                      <label className="control-label col-md-3 col-sm-3">Operator Details</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="operator_id"
                          value={operatorDetail}
                          onChange={value => this.setOperator(value)}
                          options={operatorDetails}
                          valueKey="_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                          disabled={isModal}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Weapon Details</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="weapon_id"
                          value={weapon}
                          onChange={value => this.setWeapon(value)}
                          options={weapons}
                          valueKey="weapon_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Sketch Image</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="sketch_image"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                        // required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Summary Images (Min 3)</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="summary_images"
                          className="form-control"
                          // onChange={this.handleImages}
                          onChange={this.handleSummaryImages}
                          multiple
                        // required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Strategy Maps Images (Min 3)</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="strategy_map_images"
                          className="form-control"
                          onChange={this.handleStrategyMapsImages}
                          // onChange={this.handleImages}
                          multiple
                        // required
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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Video</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="video/*"
                          name="video"
                          className="form-control"
                          onChange={this.handleVideo}
                        // multiple
                        // required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >upload_text
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="text"
                          name="upload_text"
                          className="form-control"
                          value={operator.upload_text}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
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

