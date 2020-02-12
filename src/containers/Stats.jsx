import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import { API_END_POINT } from '../config';
const token = Cookie.get('r6pro_access_token');
const UUID = localStorage.getItem("UUID");

// import {Pagination} from 'react-bootstrap';
// import LineChart from '../components/LineChart'
// import PieChart from '../components/PieChart'
// import BarChart from '../components/BarChart'
// import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maps: [],
      users: [],
      sites: [],
    }
  }
  componentWillMount() {
    axios.get(`${API_END_POINT}/api/v1/users/all_users`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          users: response.data.all_users
        })
      })
      .catch(err => {
        console.log("error fetching data");
      })
      axios.get(`${API_END_POINT}/api/v1/maps`, {headers: {"Authentication": token, "UUID": UUID }} )
      .then(response => {
        this.setState({
          maps: response.data
        })
      })
      axios.get(`${API_END_POINT}/api/v1/sites`, {headers: {"Authentication": token, "UUID": UUID }})
      .then(response => {
        this.setState({
          sites: response.data,
        })
      })
        .catch(err => {
          console.log("error fetching data");
        })
  }

  render() {
    const { maps, users, sites } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 pull-right mobile-space">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
            <div className = 'row space-1'>
              <div className='col-sm-6'>
                <h3 className='space-1'>Total Users Registered</h3>
                <h5>{users.length ? users.length : "Fetching details..."}</h5>
                {/* <Doughnut className='chart' data={[1,2,3,4,5,6,7]} labels={['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}/> */}
              </div>
              <div className='col-sm-6 '>
                <h3 className='space-1'>Total Maps in Database</h3>
                <h5>{maps.length ? maps.length : "Fetching details..."}</h5>
                {/* <PieChart className='chart' data={[5,7]}/> */}
              </div>
            </div>
            <div className = 'row space-3'>
              <div className='col-sm-6 pull-left'>
                <h3 className='space-1'>Total Sites in Database</h3>
                <h5>{sites.length ? sites.length : "Fetching details..."}</h5>
                {/* <LineChart className='chart' data={[1,2,3,4,5,6,7]} labels={['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}/> */}
              </div>
              {/* <div className='col-sm-6 '>
                <h3 className='space-1'>Total Orders Received</h3>
                <PieChart className='chart' data={[5,7]}/>
              </div> */}
            </div>
        </div>
      </div>
    );
  }
}
