import React from 'react';
import axios from 'axios';
import moment from 'moment';

export default class PropertyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      property: {
        user: {},
        property_images: [],
        area: {
          city: {},
        },
      },
    };
  }

  componentWillMount() {
    axios.get(`/api/property/${this.props.match.params.propertyId}`)
    .then(response => {
      this.setState({
        property: response.data.property,
        loading:false,
     })
    })
  }

  handleStatus(status) {
    axios.post(`/api/property/${this.props.match.params.propertyId}/status`, { status })
    .then((response) => {
      this.props.history.push('/properties');
    })
  }

  render() {
    var property = this.state.property;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2 className="inlineDisplay">Property Details</h2>
                  <div className="col-sm-4 float-right text-right">
                    {this.state.property.status == 'pending' ? '' : <button type="button" className="btn-primary btn-sm"
                                                                            onClick={() => this.handleStatus('pending')}>Pending</button>}
                    {this.state.property.status == 'published' ? '' :
                      <button type="button" style={{ marginLeft: 5 }} className="btn-primary btn-sm"
                              onClick={() => this.handleStatus('published')}>Published</button>}
                    {this.state.property.status == 'rejected' ? '' :
                      <button type="button" style={{ marginLeft: 5 }} className="btn-primary btn-sm"
                              onClick={() => this.handleStatus('rejected')}>Rejected</button>}
                    {this.state.property.status == 'closed' ? '' :
                      <button type="button" style={{ marginLeft: 5 }} className="btn-primary btn-sm"
                              onClick={() => this.handleStatus('closed')}>Closed</button>}
                  </div>
                  <div className="clearfix"></div>
                </div>
                {this.state.loading ?
                <div className="col-sm-12 text-center space-1"><i className="fa fa-spinner fa-pulse"
                                                              style={{ fontSize: '50px' }}></i></div>
                 : ''}
                <div className="row x_content space-2">
                  <div className="col-sm-12">
                    <div className={`row`}>
                      <div className="col-sm-5">
                        <div className="space-0">
                          <span>Purpose of Property:</span>
                          <span> </span>
                          <strong>{property.purpose}</strong>
                        </div>
                        <div className="space-0">
                          <span>Type of property:</span>
                          <span> </span>
                          <strong>{property.type}</strong>
                        </div>
                        <div className="space-0">
                          <span>Subtype:</span>
                          <span> </span>
                          <strong>{property.subtype}</strong>
                        </div>
                        <div className="space-0">
                          <span>City:</span>
                          <span> </span>
                          <strong>{(property.area && property.area.city) ? property.area.city.name : ''}</strong>
                        </div>
                        <div className="space-0">
                          <span>Area:</span>
                          <span> </span>
                          <strong>{property.area ? property.area.name : ''}</strong>
                        </div>
                        <div className="space-0">
                          <span>location:</span>
                          <span> </span>
                          <strong>{property.address}</strong>
                        </div>
                        <div className="space-0">
                          <span>Size:</span>
                          <span> </span>
                          <strong>{property.size}</strong>
                        </div>
                        <div className="space-0">
                          <span>Size Unit:</span>
                          <span> </span>
                          <strong>{property.size_unit}</strong>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="space-0">
                          <span>Price:</span>
                          <span> </span>
                          <strong>{property.price}</strong>
                        </div>
                        <div className="space-0">
                          <span>Posted By:</span>
                          <span> </span>
                          <strong>{property.user ? property.user.email : ''}</strong>
                        </div>
                        <div className="space-0">
                          <span>Listing Type:</span>
                          <span> </span>
                          <strong>{property.listing_type}</strong>
                        </div>
                        <div className="space-0">
                          <span>Contact Number:</span>
                          <span> </span>
                          <strong>{property.user ? property.user.phone : ''}</strong>
                        </div>
                        <div className="space-0">
                          <span>Status:</span>
                          <span> </span>
                          <strong>{property.status}</strong>
                        </div>
                        <div className="space-0">
                          <span>Comments:</span>
                          <span> </span>
                          <strong>{property.comments}</strong>
                        </div>
                        <div className="space-0">
                          <span>Posted At:</span>
                          <span> </span>
                          <strong>{moment(property.created_at).format('ll')}</strong>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="space-0">
                          <span>Description:</span>
                          <span> </span>
                          <strong>{property.description}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ln_solid"></div>
              <div className={`x_panel`}>
                <div className="col-sm-12" style={{ marginTop: 30 }}>
                  {property.property_images ? property.property_images.map((image, index) => {
                    return <div key={index} className="col-sm-4 space-1"><img width="300" height="300"
                                                                              src={`${image.url}`}/></div>
                  }) : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
