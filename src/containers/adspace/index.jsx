import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import FeaturedEntities from "./pages/FeaturedEntities";

export default class AdSpace extends React.Component {
  constructor(props) {
    super(props);
    let activeButton = null;
    if (this.props.location.pathname === "/ad-space/featured-agency")
      activeButton = "agencies";
    else if (this.props.location.pathname === "/ad-space/featured-developer")
      activeButton = "developers";
    else if (this.props.location.pathname === "/ad-space/featured-project")
      activeButton = "projects";
    else if (this.props.location.pathname === "/ad-space/mega-project")
      activeButton = "mProjects";
    this.state = {
      activeButton
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
            <div className="col-12 text-center space-5">
              <Link to="/ad-space/featured-agency">
                <button type="button"
                        className={`${this.state.activeButton == 'agencies' ? 'btn-primary' : ''} btn btn-default`}
                        >Featured Agencies
                </button>
              </Link>
              <Link to="/ad-space/featured-developer">
                <button type="button" style={{ marginLeft: 5 }}
                        className={`${this.state.activeButton == 'developers' ? 'btn-primary' : ''} btn btn-default`}
                        >Featured developers
                </button>
              </Link>
              <Link to="/ad-space/featured-project">
                <button type="button" style={{ marginLeft: 5 }}
                        className={`${this.state.activeButton == 'projects' ? 'btn-primary' : ''} btn btn-default`}
                        >Featured Projects
                </button>
              </Link>
              <Link to="/ad-space/mega-project">
                <button type="button" style={{ marginLeft: 5 }}
                        className={`${this.state.activeButton == 'mProjects' ? 'btn-primary' : ''} btn btn-default`}
                        >Mega Projects
                </button>
              </Link>
            </div>
          </div>
          <Switch>
            <Route exact path="/ad-space/featured-agency"
                   component={FeaturedEntities}/>
            <Route exact path="/ad-space/featured-developer"
                   component={FeaturedEntities}/>
            <Route exact path="/ad-space/featured-project"
                   component={FeaturedEntities}/>
            <Route exact path="/ad-space/mega-project"
                   component={FeaturedEntities}/>
          </Switch>
        </div>
      </div>
    );
  }
}
