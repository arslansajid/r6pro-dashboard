import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import { API_END_POINT } from '../config';

import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import HasRole from '../hoc/HasRole';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maps: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Maps...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/maps`, {headers: {"Authentication": token, "UUID": UUID }} )
      .then(response => {
        this.setState({
          maps: response.data,
          loading: false,
          responseMessage: 'No Maps Found'
        })
      })
  }

  
  
  deleteMap(mapId, index) {
    const requestParams = {
      "map_id": mapId,
    }
    const token = Cookie.get('r6pro_access_token');
    if(confirm("Are you sure you want to delete this map?")) {
      axios.delete(`${API_END_POINT}/api/v1/maps/destroy_map`, {
        headers: {"Authentication": token, "UUID": UUID },
        data: {
          "map_id": mapId
        }
      })
        .then(response => {
          const maps = this.state.maps.slice();
          maps.splice(index, 1);
          this.setState({ maps });
          window.alert(response.data.message);
          console.log(response.data.message);
        })
        .catch(() => {
          window.alert("ERROR")
        })
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
    // console.log(this.state);
    const {loading, maps, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Maps Items</h3>
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
              <Link to="/maps/map-form">
                <button type="button" className="btn btn-success">Add new Maps</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Map Id</th>
                  <th>Picture</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {this.state.maps && this.state.maps.length >= 1 ?
                this.state.maps.map((map, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{map.map_id}</td>
                  <td>{<img style={{height: '50px', width: '50px'}} src={map.image && map.image}/>}</td>
                  <td>{map.name}</td>
                  <td>
                    <Link to={`/maps/edit-map/${map.map_id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteMap(map.map_id, index)}></span>
                  </td>
                </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
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
