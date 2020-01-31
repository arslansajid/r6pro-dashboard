import React from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';

export default class PropertyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      property: {
        type: 'house',
        city: {},
        area: {},
      },
      cities: [],

    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.subtype = {
      house: ['house', 'flat', 'upper portion', 'lower portion', 'farm house', 'room', 'penthouse'],
      plot: ['resedential plot', 'commercial plot', 'agricultural land', 'industrial land', 'plot file', 'plot form'],
      commercial: ['office', 'shop', 'warehouse', 'factory', 'building', 'other']
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    var property = Object.assign({}, this.state.property);
    property[name] = value;
    this.setState({ property });
  }

  componentWillMount() {
    axios.get(`/api/property/${this.props.match.params.propertyId}`)
    .then(response => {
      //console.log(response.data);

      this.setState({ property: response.data.property })
    })

    axios.get("/api/city")
    .then(response => {
      this.setState({ cities: response.data });
    })
  }

  updateProperty(event) {
    event.preventDefault();
    if (!this.state.loading) {
    this.setState({ loading: true })
    axios.put(`/api/property/${this.props.match.params.propertyId}`, this.state.property)
    .then(response => {
      this.props.history.push('/properties');
    })
  }
}

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Edit Property Details</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <br/>
                  <form id="demo-form2" className="form-horizontal form-label-left" onSubmit={this.updateProperty}>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Purpose</label>
                      <div className="col-md-6 col-sm-6">
                        <select name="purpose" value={this.state.property.purpose}
                                className="form-control" onChange={this.handleInputChange}>
                          <option value="sale">Sale</option>
                          <option value="rent">Rent</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Type</label>
                      <div className="col-md-6 col-sm-6" value={this.state.property.type}>
                        <input name="type" type="radio" value="house" checked={this.state.property.type == 'house'}
                               onChange={this.handleInputChange}/><span> </span>House<br/>
                        <input name="type" type="radio" value="plot" checked={this.state.property.type == 'plot'}
                               onChange={this.handleInputChange}/><span> </span>Plot<br/>
                        <input name="type" type="radio" value="commercial"
                               checked={this.state.property.type == 'commercial'}
                               onChange={this.handleInputChange}/><span> </span>commercial<br/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Subtype</label>
                      <div className="col-md-6 col-sm-6">
                        <select value={this.state.property.subtype} name="subtype"
                                className="form-control" onChange={this.handleInputChange}>
                          {this.subtype[this.state.property.type] ? this.subtype[this.state.property.type].map((subtype, index) => (
                            <option key={index} value={subtype}>{subtype}</option>
                          )) : null}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">City</label>
                      <div className="col-md-6 col-sm-6">
                        <select name="city_id" value={this.state.property.city_id}
                                className="form-control" onChange={this.handleInputChange}>
                          <option value="">Select City</option>
                          {this.state.cities.map((option, index) => (
                            <option key={index} value={option.id}>{option.name}</option>
                          ))
                          }
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Area (Read Only)</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="area" className="form-control disabled"
                               value={this.state.property.area ? this.state.property.area.name : null}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Address</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="address" className="form-control"
                               value={this.state.property.address} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Size</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="size" className="form-control"
                               value={this.state.property.size} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Size_Unit</label>
                      <div className="col-md-6 col-sm-6">
                        <select name="size_unit" className="form-control"
                                value={this.state.property.size_unit} onChange={this.handleInputChange}>
                          <option value="sqft">Square Feet</option>
                          <option value="sqyd">Square Yard</option>
                          <option value="sqm">square Meter</option>
                          <option value="kanal">Kanal</option>
                          <option value="marla">Marla</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Price</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="price" className="form-control"
                               value={this.state.property.price} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Description</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="textarea" name="description" className="form-control"
                               value={this.state.property.description} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Comments</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="comments" className="form-control"
                               value={this.state.property.comments} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Contact number</label>
                      <div className="col-md-6 col-sm-6">
                        <input type="text" name="phone_view" className="form-control"
                               value={this.state.property.phone_view} onChange={this.handleInputChange}/>
                      </div>
                    </div>
                    <div className="ln_solid"></div>
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
