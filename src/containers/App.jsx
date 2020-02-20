import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from "axios";
import Cookie from 'js-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader/index';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import Stats from '../containers/Stats'
import { Container } from 'reactstrap';

import Strategies from './Strategies';
import StrategyForm from './StrategyForm';

import Users from '../containers/Users';
import UserForm from '../containers/UserForm';

import SpecialOffers from '../containers/SpecialOffers';
import SpecialOffersForm from '../containers/SpecialOffersForm';

import Maps from './Maps';
import MapForm from './MapForm';

import CoverForm from '../containers/CoverForm';
import CoverBanner from '../containers/CoverBanner';

import OrderForm from '../containers/OrderForm';
import Orders from '../containers/Orders';

import Operators from './Operators';
import OperatorForm from './OperatorForm';

import OperatorDetails from './OperatorDetails';
import OperatorDetailForm from './OperatorDetailForm';

import Weapons from './Weapons';
import WeaponForm from './WeaponForm';

import Properties from './Properties';
import PropertyForm from './PropertyForm';

import { API_END_POINT } from "../config";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayApp: false,
      displayMessage: 'Loading User Data...'
    }
  }

  componentWillMount() {
    const { dispatch, history } = this.props;
    const token = Cookie.get('r6pro_access_token');
    if (token) {
      // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      // axios.defaults.headers.common.Authorization = `${token}`;
      this.setState({ loading: false });
      // this.setState({
      //   displayApp: true,
      //   displayLoading: false,
      //   loading: false,
      // })

      // To get currently signed in user

      // const requestParams = {
      //   "userId": localStorage.getItem("userId"),
      // }

      // axios.get(`${API_END_POINT}/api/users/one`, {params: requestParams})
      //   .then((response) => {
      //     dispatch({
      //       type: types.SET_USER_FROM_TOKEN,
      //       payload: response.data.object[0],
      //     });
      //   })
      //   .catch((error) => {
      //     this.setState({ loading: false });
      //   })

      // axios.get(`https://admin.saaditrips.com/api/user/me`)
      //   .then((response) => {
      //     // console.log("#### success", response.data);
      //     dispatch({
      //       type: types.SET_USER_FROM_TOKEN,
      //       payload: response.data,
      //     });
      //     this.setState({
      //       user: response.data,
      //       loading: false,
      //       displayApp: true,
      //       displayLoading: false,
      //     });
      //   })
      //   .catch((/* error */) => {
      //     // console.log("app componentWillMount error :: ", error);
      //     this.setState({ loading: false });
      //     Cookie.remove('saadi_admin_access_token');
      //     // history.push('/login');
      //     // window.location.replace('/login')
      //   });
    } else {
      // this.setState({ loading: false, displayApp: true });
      history.push('/login');
      // window.location.replace('/login')
    }
  }

  render() {
      return (
      <div className="app">
        <Loader loading={this.state.loading} position={`fixed`} transparent={true}/>
        <Header/>
        <div className="app-body">
          <Sidebar {...this.props} user={this.state.user}/>
          <main className="main">
            <Breadcrumb/>
            <Container fluid>
              <Switch>
                  <Route exact={true} path='/' component={Stats}/>     

                  <Route exact={true} path="/strategies" component={Strategies}/>
                  <Route exact={true} path="/strategies/strategy-form" component={StrategyForm}/>
                  <Route exact={true} path="/strategies/edit-strategy/:strategyId" component={StrategyForm}/>
                  <Route path="/strategies/operator/:strategyId" component={Operators}/>

                  <Route exact={true} path="/users" component={Users}/>
                  <Route exact={true} path='/users/user_form' component={UserForm}/>
                  <Route exact={true} path="/users/edit_user/:userId" component={UserForm}/>

                  <Route exact={true} path="/sites" component={SpecialOffers}/>
                  <Route exact={true} path="/special-offers/specialOffer_form" component={SpecialOffersForm}/>
                  <Route exact={true} path="/special-offers/edit_specialOffer/:specialOfferId" component={SpecialOffersForm}/>

                  <Route exact={true} path="/maps" component={Maps}/>
                  <Route exact={true} path="/maps/map-form" component={MapForm}/>
                  <Route exact={true} path="/maps/edit-map/:mapId" component={MapForm}/>

                  <Route exact={true} path="/gallery" component={CoverBanner}/>
                  <Route exact={true} path="/gallery/cover_banner_form" component={CoverForm}/>
                  <Route exact={true} path="/gallery/edit_coverBanner/:coverBannerId" component={CoverForm}/>

                  <Route exact={true} path="/orders" component={Orders}/>
                  <Route exact={true} path="/orders/order_form" component={OrderForm}/>
                  <Route exact={true} path="/orders/edit_order/:orderId" component={OrderForm}/>
                  
                  <Route exact={true} path="/operators" component={Operators}/>
                  <Route exact={true} path="/operators/edit-operator/:operatorId" component={OperatorForm}/>
                  <Route exact={true} path="/operators/operator-form" component={OperatorForm}/>

                  <Route exact={true} path="/operator-details" component={OperatorDetails}/>
                  <Route exact={true} path="/operator-details/edit-operator-details/:operatorDetailsId" component={OperatorDetailForm}/>
                  <Route exact={true} path="/operator-details/operator-details-form" component={OperatorDetailForm}/>

                  <Route exact={true} path="/weapons" component={Weapons}/>
                  <Route exact={true} path="/weapon-details/edit-weapon/:weaponId" component={WeaponForm}/>
                  <Route exact={true} path="/weapon-details/weapon-form" component={WeaponForm}/>

                  <Route exact={true} path="/properties" component={Properties}/>
                  <Route exact={true} path="properties/property-form" component={PropertyForm}/>
                  <Route exact={true} path="properties/edit-property/:pid" component={PropertyForm}/>
                  
                </Switch>
              </Container>
              </main>
            </div>
            <Footer />
          </div>
      );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(App));