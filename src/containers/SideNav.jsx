import React from 'react';
import { Link } from 'react-router-dom';
import HasRole from '../hoc/HasRole';
import axios from 'axios';
import Cookie from 'js-cookie';

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'stats',
      user: this.props.user
    }
  }
  componentDidMount() {

  }

  logout() {
    axios.defaults.headers.common['Authorization'] = ''
    if (process.env.NODE_ENV === 'production') {
      // Cookie.remove('r6pro_access_token', {domain: `.${window.location.host}`})
      // Cookie.remove('r6pro_access_token', { path: '', domain: '.saaditrips.com' }); this was the code previously
      Cookie.remove('r6pro_access_token');
    }
    else {
      Cookie.remove('r6pro_access_token');
      // Cookie.remove('r6pro_access_token', { path: '', domain: '.saaditrips.com' });
    }
    this.props.history.push("/login");
    // window.location.href = ("/");
  }

  render() {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <h1 className='sideNavHeading text-center'>Entities</h1>
        <ul className="nav nav-sidebar">
            <Link onClick={() => {this.setState({active:'stats'})}} to="/">
              <li className={`side_nav ${this.state.active == 'stats' ? 'active' : ''}`}>Stats</li>
            </Link>
            <Link onClick={() => {this.setState({active:'categories'})}} to="/categories">
              <li className={`side_nav ${this.state.active == 'categories' ? 'categories' : ''}`}>Categories</li>
            </Link>
            {/* <Link onClick={() => {this.setState({active:'cities'})}} to="/cities">
              <li className={`side_nav ${this.state.active == 'cities' ? 'active' : ''}`}>Cities</li>
            </Link>
            <Link onClick={() => {this.setState({active:'hotels'})}} to="/hotels">
              <li className={`side_nav ${this.state.active == 'hotels' ? 'active' : ''}`}>Hotels</li>
            </Link>
            <Link onClick={() => {this.setState({active:'featured_hotels'})}} to="/featured_hotels">
              <li className={`side_nav ${this.state.active == 'featured_hotels' ? 'active' : ''}`}>Featured Hotels</li>
            </Link> */}
            <Link onClick={() => {this.setState({active:'users'})}} to="/users">
              <li className={`side_nav ${this.state.active == 'users' ? 'active' : ''}`}>Users</li>
            </Link>
            <Link onClick={() => {this.setState({active:'special-offers'})}} to="/special_offers">
              <li className={`side_nav ${this.state.active == 'special-offers' ? 'active' : ''}`}>Special Offers</li>
            </Link>
            <Link onClick={() => {this.setState({active:'popular'})}} to="/popular">
              <li className={`side_nav ${this.state.active == 'popular' ? 'active' : ''}`}>Popular</li>
            </Link>
            <Link onClick={() => {this.setState({active:'orders'})}} to="/orders">
              <li className={`side_nav ${this.state.active == 'orders' ? 'active' : ''}`}>Orders</li>
            </Link>
            <Link onClick={() => {this.setState({active:'cover_banner'})}} to="/cover_banner">
              <li className={`side_nav ${this.state.active == 'cover_banner' ? 'active' : ''}`}>Gallery</li>
            </Link>
            {/* <Link onClick={() => {this.setState({active:'agents'})}} to="/agents">
              <li className={`side_nav ${this.state.active == 'agents' ? 'active' : ''}`}>Agents</li>
            </Link>
            <Link onClick={() => {this.setState({active:'packages'})}} to="/packages">
              <li className={`side_nav ${this.state.active == 'packages' ? 'active' : ''}`}>Packages</li>
            </Link>
            <Link onClick={() => {this.setState({active:'featured_packages'})}} to="/featured_packages">
              <li className={`side_nav ${this.state.active == 'featured_packages' ? 'active' : ''}`}>Featured Packages</li>
            </Link> */}
            {/* <Link onClick={() => {this.setState({active:'bookings'})}} to="/bookings">
              <li className={`side_nav ${this.state.active == 'bookings' ? 'active' : ''}`}>Bookings</li>
            </Link> */}
            <Link onClick={() => {this.setState({active:'items'})}} to="/items">
              <li className={`side_nav ${this.state.active == 'items' ? 'active' : ''}`}>Items</li>
            </Link>
            {/* <Link onClick={() => {this.setState({active:'experiences'})}} to="/experiences">
              <li className={`side_nav ${this.state.active == 'experiences' ? 'active' : ''}`}>Experiences</li>
            </Link>
            <Link onClick={() => {this.setState({active:'events'})}} to="/events">
              <li className={`side_nav ${this.state.active == 'events' ? 'active' : ''}`}>Events</li>
            </Link> */}
            {/* <Link onClick={() => {this.setState({active:'premiumPlusRequests'})}} to="/premium-plus-requests">
              <li className={`side_nav ${this.state.active == 'premiumPlusRequests' ? 'active' : ''}`}>Premium Plus Requests</li>
            </Link>
            <Link onClick={() => {this.setState({active:'premiumRequests'})}} to="/premium-requests">
              <li className={`side_nav ${this.state.active == 'premiumRequests' ? 'active' : ''}`}>Premium Requests</li>
            </Link>
            <Link onClick={() => {this.setState({active:'users'})}} to="/user_list">
              <li className={`side_nav ${this.state.active == 'users' ? 'active' : ''}`}>Users</li>
            </Link>
            <Link onClick={() => {this.setState({active:'packages'})}} to="/packages">
              <li className={`side_nav ${this.state.active == 'packages' ? 'active' : ''}`}>Packages</li>
            </Link>
            <Link onClick={() => {this.setState({active:'features'})}} to="/features">
              <li className={`side_nav ${this.state.active == 'features' ? 'active' : ''}`}>Features</li>
            </Link>
            <Link onClick={() => {this.setState({active:'orders'})}} to="/orders">
              <li className={`side_nav ${this.state.active == 'orders' ? 'active' : ''}`}>Package / Feature Orders</li>
            </Link>
            <Link onClick={() => {this.setState({active:'featured'})}} to="/ad-space/featured-agency">
              <li className={`side_nav ${this.state.active == 'featured' ? 'active' : ''}`}>Featured / Mega</li>
            </Link>
            <Link onClick={() => {this.setState({active:'bannerAds'})}} to="/banner-ads">
              <li className={`side_nav ${this.state.active == 'bannerAds' ? 'active' : ''}`}>Banner Ads</li>
            </Link>
            <Link onClick={() => {this.setState({active:'covers'})}} to="/cover">
              <li className={`side_nav ${this.state.active == 'covers' ? 'active' : ''}`}>Covers / Footers</li>
            </Link>
            <Link onClick={() => {this.setState({active:'settings'})}} to="/settings">
              <li className={`side_nav ${this.state.active == 'settings' ? 'active' : ''}`}>Settings</li>
            </Link>
            <Link onClick={() => {this.setState({active:'wanted'})}} to="/wanted">
              <li className={`side_nav ${this.state.active == 'wanted' ? 'active' : ''}`}>Wanted</li>
            </Link>
            <Link onClick={() => {this.setState({active:'columnAds'})}} to="/column-ads">
              <li className={`side_nav ${this.state.active == 'columnAds' ? 'active' : ''}`}>Column Ads</li>
            </Link>
            <Link onClick={() => {this.setState({active:'mop'})}} to="/mop">
              <li className={`side_nav ${this.state.active == 'mop' ? 'active' : ''}`}>MOP</li>
            </Link>
            <Link onClick={() => {this.setState({active:'mop_projects'})}} to="/projects-mop">
              <li className={`side_nav ${this.state.active == 'mop_projects' ? 'active' : ''}`}>Projects MOP</li>
            </Link>
            <Link onClick={() => {this.setState({active:'mop-dashboard'})}} to="/mop-dashboard">
              <li className={`side_nav ${this.state.active == 'mop-dashboard' ? 'active' : ''}`}>MOP Dashboard</li>
            </Link>
            <Link onClick={() => {this.setState({active:'brando-dashboard'})}} to="/brando-dashboard">
              <li className={`side_nav ${this.state.active == 'brando-dashboard' ? 'active' : ''}`}>Brando Dashboard</li>
            </Link>
            <Link onClick={() => {this.setState({active:'schedulers'})}} to="/schedulers">
              <li className={`side_nav ${this.state.active == 'schedulers' ? 'active' : ''}`}>Schedulers</li>
            </Link>
          <Link onClick={() => {this.setState({active:'inquiries'})}} to="/inquiries">
              <li className={`side_nav ${this.state.active == 'inquiries' ? 'active' : ''}`}>Inquiries</li>
          </Link> */}
        </ul>
        <div className='text-center' style={{'position':'absolute',}}>
          <span style={{'paddingTop':'3px'}} className="pull-left glyphicon glyphicon-off" aria-hidden="true" onClick={() => this.deleteDeveloper(developer.id, index)}></span>
          <p style={{'paddingLeft': '10px'}} className='pull-left'>
            <span onClick={this.logout.bind(this)} style={{cursor: 'pointer', textDecoration: 'underline'}}>Log Out</span>
          </p>
        </div>
      </div>
    );
  }
}
