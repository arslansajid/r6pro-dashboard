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
        strategy_id: '',
        weapon_id: '',
        operator_detail_id: "",
        sketch_image: [],
        summary_images: [],
      },
      strategy: "",
      strategies: [],
      operatorDetail: "",
      operatorDetails: [],
      weapon: "",
      weapons: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postOperator = this.postOperator.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/strategies`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          strategies: response.data,
        })
      })
      axios.get(`${API_END_POINT}/api/v1/operator_details`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          operatorDetails: response.data,
        })
      })
      axios.get(`${API_END_POINT}/api/v1/weapons`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          weapons: response.data,
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
        axios.get(`${API_END_POINT}/api/operators/one`, { params: {"categoryId": this.state.operator.categoryId}, headers: {"auth-token" : token} })
        .then(response => {
          this.setState({
            category: response.data.object[0],
          })
        })
      });
    });
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

  setStrategy(selectedStrategy) {
    this.setState(prevState => ({
      strategy: selectedStrategy,
      operator: {
        ...prevState.operator,
        strategy_id: selectedStrategy.strategy_id,
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

  postOperator(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, operator } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      if(match.params.operatorId) {
        axios.post(`${API_END_POINT}/api/v1/operators/update`, operator, {headers: {"auth-token": token}})
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
        axios.post(`${API_END_POINT}/api/v1/operators`, operator, {headers: {"Authentication": token, "UUID": UUID }})
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
                    <label className="control-label col-md-3 col-sm-3">Strategy</label>
                    <div className="col-md-6 col-sm-6">
                      <Select
                        name="strategy_id"
                        value={strategy}
                        onChange={value => this.setStrategy(value)}
                        options={strategies}
                        valueKey="_id"
                        labelKey="name"
                        clearable={false}
                        backspaceRemoves={false}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Operator Details</label>
                    <div className="col-md-6 col-sm-6">
                      <Select
                        name="strategy_id"
                        value={operatorDetail}
                        onChange={value => this.setOperator(value)}
                        options={operatorDetails}
                        valueKey="_id"
                        labelKey="name"
                        clearable={false}
                        backspaceRemoves={false}
                        required
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
                        labelKey="weapon_id"
                        clearable={false}
                        backspaceRemoves={false}
                        required
                      />
                    </div>
                  </div>

                {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >weapon_id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="weapon_id"
                          className="form-control"
                          value={operator.weapon_id}
                          onChange={this.handleInputChange}
                          // pattern="^[1-5]$"
                          // title="Operator should only range between 1 to 5"
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">sketch_image</label>
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
                      <label className="control-label col-md-3 col-sm-3">summary_images</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="summary_images"
                          className="form-control"
                          onChange={this.handleImages}
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

