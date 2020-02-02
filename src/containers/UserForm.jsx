import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        profile_photo: '',
        loading: false,
      },
      cities: [],
      city: '',
      userId: '',
      profile_picture: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postUser = this.postUser.bind(this);
  }

  componentWillMount() {

  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
    const requestParams = {
      "userId": match.params.userId,
    }
      if (match.params.userId)
      axios.get(`${API_END_POINT}/api/users/one`, {params: requestParams})
        .then((response) => {
          this.setState({
            user: response.data.object[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {

          });
        });
    }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  postUser(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user } = this.state;
    const token = Cookie.get('r6pro_access_token');
    if (!loading) {
        this.setState({ loading: true });
        if(match.params.userId) {
          user.userId = user._id
          delete user["_id"];
          delete user["email"];
          delete user["password"];
          delete user["date"];
          delete user["__v"];
          this.setState({ user });
          // axios.patch('/api/user/update', fd)
          axios.post(`${API_END_POINT}/api/users/update`, user, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:', response.data.error)
              this.setState({ loading: false });
            }
          });
        }
        else {
          const { email, password, first_name, last_name /*, profile_photo */ } = this.state.user
          axios.post(`${API_END_POINT}/api/v1/users/sign_up`, null, { params: {
            email,
            password,
            first_name,
            last_name,
            // profile_photo
          }})
          .then(response => {
            console.log("####", response);
            if (response && response.status == 200) {
              window.alert("SAVED");
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR:')
            this.setState({ loading: false });
          })
        }
    }
  }

  handleFile = (event) => {
    const { user } = this.state;
    user.profile_photo = event.target.files[0];
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
      user
    });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      user,
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter User Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postUser}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >First Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="first_name"
                          className="form-control"
                          value={user.first_name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >First Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="last_name"
                          className="form-control"
                          value={user.last_name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Email
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="email"
                          className="form-control"
                          value={user.email}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Password
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="password"
                          name="password"
                          className="form-control"
                          value={user.password}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Profile Picture</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="profile_photo"
                          className="form-control"
                          onChange={this.handleFile}
                        />
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

