import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

import HasRole from '../hoc/HasRole';

export default class Weapons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weapons: [],
      weapon: '',
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading Weapons...',
      status: 'All'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/weapons`, {headers: {"Authentication": token, "UUID": UUID }})
    .then(response => {
      this.setState({
        weapons: response.data,
        responseMessage: 'No Weapons Found...'
      })
    })
    .catch((error) => {
      this.setState({
        loading: false,
        responseMessage: 'No Weapons Found...'
      })
    })
  }

  fetchItems = (type) => {
    const { selectedRating } = this.state;
    this.setState({
      status: type,
      weapons: [],
      responseMessage: 'Loading Weapons...',
    })
      if(type === 'All') {
        axios.get(`${API_END_POINT}/api/weapons`, {headers: {"auth-token": token} })
        .then(response => {
          this.setState({
            weapons: response.data.objects,
            // pages: Math.ceil(response.data.length/10),
          })
        })
        .catch(err => {
          this.setState({
            responseMessage: 'No Weapons for Hotels Found...'
          })
        })
      } else {
      axios.get(`${API_END_POINT}/api/fetchAll${type}/hotelRating-fetchAll${type}`)
        .then(response => {
          this.setState({
            weapons: response.data,
            pages: Math.ceil(response.data.length/10),
            responseMessage: 'No Weapons Found...'
          })
        })
        .catch((error) => {
          this.setState({
            responseMessage: 'No Weapons Found...'
          })
        })
      }
    }

  changeStatus = (weaponId, ratingStatus) => {
    if(this.state.selectedRating === 'hotels') {
    axios.get(`${API_END_POINT}/api/fetchById/hotelRating-fetchById/${weaponId}`)
      .then(response => {
        this.setState({
          weapon: response.data,
        }, () => {
          this.setState(prevState => ({
            weapon: {
                ...prevState.weapon,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'hotelRating' : JSON.stringify(this.state.weapon)}
              axios.patch(`${API_END_POINT}/api/update/hotelRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    } else {
      axios.get(`${API_END_POINT}/api/fetchById/packageRating-fetchById/${weaponId}`)
      .then(response => {
        this.setState({
          weapon: response.data,
        }, () => {
          this.setState(prevState => ({
            weapon: {
                ...prevState.weapon,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'packageRating' : JSON.stringify(this.state.weapon)}
              axios.patch(`${API_END_POINT}/api/update/packageRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    }
  }

  deleteWeapon(weaponId, index) {
    const requestParams = {
      "weaponId": weaponId,
    }
    if(confirm("Are you sure you want to delete this weapon?")) {
      axios.delete(`${API_END_POINT}/api/weapons/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const weapons = this.state.weapons.slice();
          weapons.splice(index, 1);
          this.setState({ weapons });
          window.alert(response.data.msg);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.weapons,
          activePage: page
        })
      })
  }
  
  handleSearch() {
    this.setState({loading: true, weapons: [], responseMessage: 'Loading Weapons...'})
    axios.get(`${API_END_POINT}/api/weapons/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          weapons: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Weapons Found...'
        })
      })
  }

  render() {
    const { status, selectedRating } = this.state;
    const { match } = this.props;
    console.log(this.state);
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Weapon Details</h3>
              </div>
              <div  className="col-sm-4">
                <div className='input-group'>
                  <input  className='form-control'
                    type="text"
                    name="search"
                    placeholder="Enter keyword"
                    value={this.state.q}
                    onChange={(event) => this.setState({q: event.target.value})}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        // console.log('do validate');
                        this.handleSearch();
                      }
                    }}
                  />
                  <span className="input-group-btn" >
                    <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                  </span>
                </div>
              </div>
              {!match.params.categoryId ? 
                <div className="col-sm-4 pull-right mobile-space">
                  <Link to={`/weapon-details/weapon-form`}>
                    <button type="button" className="btn btn-success">Add new Weapon Details</button>
                  </Link>
                </div>
              : null}
          </div>

          <div>                   
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Weapon Detail Id</th>
                  {/* <th>Logo</th> */}
                  <th>Gadget 1</th>
                  <th>Gadget 2</th>
                  <th>Primary Weapon</th>
                  <th>Secondary Weapon</th>
                </tr>
              </thead>
              <tbody>
                {this.state.weapons && this.state.weapons.length >= 1 ?
                  this.state.weapons.map((weapon, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{weapon.weapon_id}</td>
                    {/* <td>{<img style={{height: '50px', width: '50px'}} src={weapon.logo && weapon.logo} />}</td> */}
                    <td>{weapon.gadget1}</td>
                    <td>{weapon.gadget2}</td>
                    <td>{weapon.primary_weapon}</td>
                    <td>{weapon.secondary_weapon}</td>
                    <td>
                        <Link to={`/weapon-details/edit-weapon-details/${weapon.weapon_id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteWeapon(weapon._id, index)}></span>
                      </td>
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
            <Pagination prev next weapons={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      {/* //   : null
      // } */}
      </div>
    </div>
    );
  }
}
