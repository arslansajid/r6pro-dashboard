import React from 'react';
import axios from 'axios';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { Pagination } from 'react-bootstrap';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import HasRole from '../../../hoc/HasRole';

export default class FeaturedEntities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ResponseMessage: 'Loading Featured Entities...',
      loading: true,
      entities: [],
      cities: [],
      featured: {
      cityId: '',
      entity_id: '',
      },
      date: '',
      focused: false,
      featuredEntities: [],
      pages: 1,
      activePage: 1,
      startDate: null,
      endDate: null,
      focusedInput: null,
      isLoadingExternally: false
    }
  }
  getCity(query){
    return axios.get(`/api/city`)
    .then(response => {
      return { options: response.data }
    })
  }

  setCity(cityId) {
    var featured = Object.assign({}, this.state.featured);
    this.setState({ 
      featured: { ...this.state.featured, cityId:cityId.id , entity_id: ''},
      isLoadingExternally: true,  
    });


    var cityId = cityId.id;
    this.setState({ cityId });

    var paths = this.props.location.pathname.split('/');

    axios.get(`/api/admin/city/${cityId}/${paths[paths.length - 1]}`)
    .then(response => {
      this.setState({ 
        entities: response.data,
        isLoadingExternally: false,
       });
    })
  }
  setEntity(entity_id){
    this.setState({
      featured: { ...this.state.featured, entity_id: entity_id.id }
    })
  }
  componentDidMount() {
    axios.get("/api/city")
    .then(response => {
      this.setState({ 
      cities: response.data
       });
    });

    this.getEntities();
  }

  componentDidUpdate() {
    if (this.update) {
      this.update = false;
      this.getEntities();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.update = true;
    }
  }

  getEntities() {
    /* this.props.location.pathname == /ad-space/featured-developers || /ad-space/featured-agencies || /ad-space/featured-projects || /ad-space/mega-projects */
    /* this.props.location.pathname == /ad-space/featured-developers */
    var paths = this.props.location.pathname.split('/');
    /* paths == ["", "ad-space", "featured-developers"] */
    /* paths[paths.length-1] == featured-developers */

    axios.get(`/api/admin/feature/${paths[paths.length - 1]}`)
    .then(response => {
      this.setState({
        featuredEntities: response.data.items,
        pages: Math.ceil(response.data.total / 10),
        entities: [],
        cityId: '',
        loading: false,
        ResponseMessage: 'No Featured Entities Found'
      })
    })
  }

  handleSelect(page) {
    var paths = this.props.location.pathname.split('/');
    axios.get(`/api/admin/feature/${paths[paths.length - 1]}?offset=${(page - 1) * 10}`)
    .then(response => {
      this.setState({
        featuredEntities: response.data.items,
        activePage: page
      })
    })
  }

  getEntitiesOfCity(event) {
    var cityId = event.target.value;
    this.setState({ cityId });

    var paths = this.props.location.pathname.split('/');

    axios.get(`/api/admin/city/${cityId}/${paths[paths.length - 1]}`)
    .then(response => {
      this.setState({ entities: response.data });
    })
  }

  addFeaturedEntity(entity_id) {
    var entityId = this.state.featured.entity_id;
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var dates = {
      startDate,
      endDate,
    };
    var paths = this.props.location.pathname.split('/');
    axios.post(`/api/admin/feature/${paths[paths.length - 1]}/${entityId}`, dates)
    .then(response => {
      var featuredEntities = this.state.featuredEntities.slice();
      featuredEntities.push(response.data);
      this.setState({ featuredEntities });
      this.setState({
        cityId: '',
        entity_id: '',
        date: '',
      });
    })
    .catch((error) => {
      window.alert(error.response.data)
   })
  }

  removeFeatured(entityId, index) {
    var paths = this.props.location.pathname.split('/');

    if (confirm("Are you sure you want to unfeature it?")) {
      axios.delete(`/api/admin/feature/${paths[paths.length - 1]}/${entityId}`)
      .then(response => {
        const featuredEntities = this.state.featuredEntities.slice();
        featuredEntities.splice(index, 1);
        this.setState({ featuredEntities });
      });
    }
  }

  render() {
    return (
      <div>
        <div className="row space-3">
          <HasRole requiredRole={['admin', 'data-entry']} requiredDepartment={['admin', 'sales']}>
            <div className="col-sm-3" style={{ paddingRight: 0 }}>
              <Select.Async
                        name="city"
                        multi={false}
                        value={this.state.featured.cityId}
                        onChange={value => this.setCity(value)}
                        loadOptions={input => this.getCity(input)}
                        valueKey="id"
                        labelKey="name"
                        className=''
                      />
            </div>
            <div className="col-sm-3" style={{ paddingRight: 0 }}>
              <Select
                        name="entity"
                        multi={false}
                        isLoading={this.state.isLoadingExternally}
                        value={this.state.featured.entity_id}
                        onChange={value => this.setEntity(value)}
                        options={this.state.entities}
                        valueKey="id"
                        labelKey="name"
                        className=''
                      />
            </div>
            <div className="col-sm-3" style={{ paddingRight: 0 }}>
              {/*<SingleDatePicker id="date_input" date={this.state.date} focused={this.state.focused} onDateChange={(date) => this.setState({ date: date })} onFocusChange={({focused}) => this.setState({ focused: focused })} numberOfMonths={1}/>*/}
              <DateRangePicker startDate={this.state.startDate} endDate={this.state.endDate}
                               startDateId={`date_input_start`} endDateId={`date_input_end`}
                               onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                               focusedInput={this.state.focusedInput}
                               onFocusChange={focusedInput => this.setState({ focusedInput })}/>
            </div>
            <div className="col-sm-3">
              <button type="button" className="btn btn-sm btn-block btn-info" onClick={() => this.addFeaturedEntity()}
                      style={{ lineHeight: 1.85 }}>Add
              </button>
            </div>
          </HasRole>
        </div>
        {this.state.loading ?
            <div className="col-sm-12 text-center space-1"><i className="fa fa-spinner fa-pulse"
                                                              style={{ fontSize: '50px' }}></i></div>
            : ''}

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Expiry Date</th>
              <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}>
                <th>Un-Feature</th>
              </HasRole>
            </tr>
            </thead>
            <tbody>
            { this.state.featuredEntities && this.state.featuredEntities.length >= 1 ?
              this.state.featuredEntities.map((featuredEntity, index) => (
              <tr key={index}>
                <td>{(featuredEntity.entity && featuredEntity.entity.logo) ?
                  <img width="30" height="30" src={`${featuredEntity.entity.logo}`}/> : ''}</td>
                <td>{featuredEntity.entity ? featuredEntity.entity.name : featuredEntity.entity ? featuredEntity.entity.name : ''}</td>
                <td>{featuredEntity.entity ? featuredEntity.entity.email : ''}</td>
                <td>{featuredEntity.entity ? featuredEntity.entity.phone : ''}</td>
                <td>{featuredEntity.entity ? featuredEntity.entity.website : ''}</td>
                <td>{featuredEntity.expires_at ? moment(featuredEntity.expires_at).format('ll') : ''}</td>
                <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}>
                  <td>
                    <span className="fa fa-times" aria-hidden="true"
                          onClick={() => this.removeFeatured(featuredEntity.id, index)}></span>
                  </td>
                </HasRole>
              </tr>
            )):
            <tr>
                  <td colSpan='10' className='text-center'>{this.state.ResponseMessage}</td>
                </tr>
          }
            </tbody>
          </table>
        </div>
        <div className={`text-center`}>
          <Pagination prev next items={this.state.pages} activePage={this.state.activePage}
                      onSelect={this.handleSelect.bind(this)}></Pagination>
        </div>
      </div>
    );
  }
}
