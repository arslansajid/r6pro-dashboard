import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import Cookie from "js-cookie";
import axios from "axios/index";
import Formsy from 'formsy-react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { API_END_POINT } from '../config';

const style = {
  logoWrapper: {
    width: '70%',
    margin: '15px auto 0',
    height: 100 + 'px',
  },
  svg: {
    width: '100%',
    fill: '#ffffff',
  },
};

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      profile_photo: '',
      loading: false,
    }
  }

  componentDidMount() {
    // let token = Cookie.get('r6pro_access_token');
    // if (token) {
    //   this.props.history.push("/");
    // }
  }

  submit() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      const { email, password, first_name, last_name /*, profile_photo */ } = this.state.user
      axios.post(`${API_END_POINT}/api/v1/users/sign_up`, null, { params: {
        email,
        password,
        first_name,
        last_name,
        // profile_photo
      }})
      .then(response => {
        //console.log("####", response);
        if (response && response.status == 200) {
          const token = response.data.authToken;
          console.log('Token', token)
          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          if (process.env.NODE_ENV === 'production') {
            Cookie.set('r6pro_access_token', `${token}`, { expires: 14 })
          }
          else {
            Cookie.set('r6pro_access_token', `${token}`, { expires: 14 })
          }
          // this.props.location.push("/");
          this.props.history.push("/login")
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        window.alert("ERROR");
      });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center animated fadeIn login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Signup</h1>
                    <p className="text-muted">Sign Up</p>
                    <Formsy onValidSubmit={this.submit.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="First Name" required
                               ref={(input) => (this.first_name = input)}
                               onChange={(e) => this.setState({ first_name: e.target.value })}/>
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Last Name" required
                               ref={(input) => (this.last_name = input)}
                               onChange={(e) => this.setState({ last_name: e.target.value })}/>
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Email" required
                               ref={(input) => (this.email = input)}
                               onChange={(e) => this.setState({ email: e.target.value })}/>
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Profile Photo"
                               ref={(input) => (this.profile_photo = input)}
                               onChange={(e) => this.setState({ profile_photo: e.target.value })}/>
                      </InputGroup>
                      
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" required
                               ref={(input) => (this.password = input)}
                               onChange={(e) => this.setState({ password: e.target.value })}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="graana-red" className={`px-4 ${this.state.loading ? 'disabled' : ''}`}>
                            <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`}/> Signup
                          </Button>
                        </Col>
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card className="text-white bg-graana-red py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                    <div style={style.logoWrapper} className={`svg-logo`}>
                      <img className={`companyLogo`} src={`${require('waffle_logo_2019.png')}`} />
                    </div>
                      <div className={`text-center`} style={{ fontSize: '20px', paddingTop: "10px", fontWeight: "bold" }}>R6Pro Admin Dashboard</div>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Signup.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default withRouter(connect()(Signup));
