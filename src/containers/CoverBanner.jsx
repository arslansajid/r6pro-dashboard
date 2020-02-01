import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import moment from 'moment';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');

import HasRole from '../hoc/HasRole';

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coverBanners: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Gallery Banners...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${API_END_POINT}/api/gallery`, {headers: {"auth-token": token} })
      .then(response => {
        this.setState({
          coverBanners: response.data.objects,
          pages: Math.ceil(response.data.objects.length/10),
          responseMessage: 'No Gallery Banners Found...'
        })
      })
  }

  // const requestParams = {
  //   "userId": userId,
  // }

  deleteGallery(coverBannerId, index) {
    const requestParams = {
      "galleryId": coverBannerId,
    }
    if(confirm("Are you sure you want to delete this item?")) {
      axios.delete(`${API_END_POINT}/api/gallery/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const coverBanners = this.state.coverBanners.slice();
          coverBanners.splice(index, 1);
          this.setState({ coverBanners });
          window.alert(response.data.msg);
        });
    }
  }
  
  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }
  handleSearch() {
    axios.get(`/api/area?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          areas: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Gallery Banners</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>
            {/* <div className="col-sm-4 pull-right mobile-space">
              <HasRole requiredRole={['admin', 'data-entry']} requiredDepartment={['admin', 'sales']}>
                <Link to="/area_form">
                  <button type="button" className="btn btn-success marginTop">Add new Area</button>
                </Link>
              </HasRole>
            </div> */}

            <div className="col-sm-4 pull-right mobile-space">
                <Link to="/gallery/cover_banner_form">
                  <button type="button" className="btn btn-success">Add new Gallery Banner</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.coverBanners && this.state.coverBanners.length >= 1 ?
                  this.state.coverBanners.map((coverBanner, index) => (
                  <tr key={index}>
                    <td>{coverBanner._id}</td>
                    <td>{<img style={{height: '50px', width: '70px'}} src={coverBanner.image ? coverBanner.image : null}/>}</td>
                    <td>{coverBanner.name}</td>
                    <td>{coverBanner.description}</td>
                    <td>{moment(coverBanner.date).format('DD-MMM-YYYY')}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${coverBanner.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/gallery/edit_coverBanner/${coverBanner._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteGallery(coverBanner._id, index)}></span>
                      </td>
                    {/* </HasRole> */}
                  </tr>
                )):
                <tr>
                    <td colSpan="15" className="text-center">{this.state.responseMessage}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
