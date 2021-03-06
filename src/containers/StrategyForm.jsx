import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const UUID = localStorage.getItem("UUID");

// import Select from 'react-select';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const token = Cookie.get('r6pro_access_token');

export default class StrategyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      strategy: {
        name: "",
        site_id: "",
        strategy_type: "",
        image: "",
      },
      selectedOperators: [],
      gallery: '',
      site: '',
      sites: [],
      operators: [],
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postStrategy = this.postStrategy.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/sites`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          sites: response.data,
        })
      })
    axios.get(`${API_END_POINT}/api/v1/operators`, {headers: {"Authentication": token, "UUID": UUID }})
    .then(response => {
      this.setState({
        operators: response.data,
      })
    })
  }

  componentDidMount() {
    const { match } = this.props;
      if (match.params.strategyId) {
      axios.get(`${API_END_POINT}/api/v1/strategies/get_strategy?strategy_id=${match.params.strategyId}`, {headers: {"Authentication": token, "UUID": UUID }})
        .then((response) => {
          this.setState({
            strategy: response.data,
          }, () => {
            axios.get(`${API_END_POINT}/api/v1/sites/get_site?site_id=${this.state.strategy.site_id}`, {headers: {"Authentication": token, "UUID": UUID }})
            .then((response) => {
              this.setState({
                site: response.data
              })
            })
          });
        });
      }
    }

  setDescription(description) {
    const { strategy } = this.state;
    strategy.description = description.toString('html');
    this.setState({
      strategy,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { strategy } = this.state;
    strategy[name] = value;
    this.setState({ strategy });
  }

  // handleFile = (event) => {
  //   this.setState({
  //     files: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setSite(selectedSite) {
    this.setState(prevState => ({
      site: selectedSite,
      strategy: {
        ...prevState.strategy,
        site_id: selectedSite.site_id,
      },
    }))
  }

  handleImages = (event) => {
    const { strategy } = this.state;
    strategy.image = event.target.files[0];
    this.setState({ gallery: event.target.files[0], strategy });
  }

  postStrategy(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, strategy, gallery, selectedOperators } = this.state;

    const fd = new FormData();
    Object.keys(strategy).forEach((eachState, index) => {
      fd.append(`${eachState}`, strategy[eachState]);
    })

    selectedOperators.split(',').forEach((operator, index) => {
      fd.append(`operator_array[${index}]`, operator);
    })

    if (!loading) {
        this.setState({ loading: true });
        if(match.params.strategyId) {
          axios.put(`${API_END_POINT}/api/v1/strategies/update_strategy?strategy_id=${match.params.strategyId}`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert("Updated successfully!");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            window.alert("ERROR");
            this.setState({ loading: false });
          })
        } else {
          axios.post(`${API_END_POINT}/api/v1/strategies`, fd, {headers: {"Authentication": token, "UUID": UUID }})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert("SAVED!");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR!')
              this.setState({ loading: false });
            }
          }).catch((err) => {
            window.alert('ERROR!', err.response.message ? err.response.message: "" )
            this.setState({ loading: false });
          })
        }
      }
    }

    deleteImage = (url, ID) => {
      const data =  {ID, url}
      let requestBody = { 'locationGallery' : JSON.stringify(data)};
      if(confirm("Are you sure you want to delete this image?")) {
        // axios.delete(`${API_END_POINT}/api/delete/Image-deleteByPublicId`, {reqBody})
        axios.delete(`${API_END_POINT}/api/deleteGallery/strategy-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
          .then(response => {
            if(response.status === 200) {
              window.alert('Image deleted Successfully!')
            }
            // const strategy = this.state.strategy[gallery].slice();
            // strategy.splice(index, 1);
            // this.setState({ strategy });

            const { strategy } = this.state;
            strategy.gallery.splice(index, 1);
            this.setState({ strategy });
          });
      }
    }

    handleSelectChange = (value) => {
      console.log('You\'ve selected:', value);
      this.setState({ selectedOperators: value });
    }

  render() {
    console.log('this.state', this.state);
    const {
      loading,
      strategy,
      sites,
      site,
      description,
      operators,
      selectedOperators,
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Strategy Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postStrategy}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Strategy Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={strategy.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Site</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="site_id"
                          value={site}
                          onChange={value => this.setSite(value)}
                          options={sites}
                          valueKey="id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Select 5 Operators</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        multi
                        onChange={(val) => this.handleSelectChange(val)}
                        options={operators}
                        placeholder="Select at least 5"
                        rtl={false}
                        simpleValue
                        value={selectedOperators}
                        valueKey="operator_id"
                        labelKey="name"
                      />
                      </div>
                    </div>

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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Strategy Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="strategy_type"
                          value={strategy.strategy_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="attack">Attack</option>
                          <option value="defence">Defence</option>
                        </select>
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
                          name="site"
                          className="form-control"
                          value={strategy.site}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}


                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Strategy Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={strategy.gallery ? 0 : 1}
                        />
                      </div>
                    </div> */}

                    {strategy.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {strategy.gallery.map((image,index) => {
                          return (
                          <span key={index}>
                            <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${image.url}`}
                            alt="cover"
                          />
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, strategy.ID)}/>
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
                        checked={strategy.recommended}
                        onClick={() => {
                          strategy.recommended = !strategy.recommended;
                          this.setState({ strategy })
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
