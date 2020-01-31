import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class PopularForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      popular: {
        name: '',
        // last_name: '',
        // city_id: '',
        email: '',
        // phone: '',
        password: '',
        // address: '',
        // user_type: '',
      },
      cities: [],
      city: '',
      popularId: '',
      profile_picture: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postPopular = this.postPopular.bind(this);
  }

  componentWillMount() {
    // axios.get(`${API_END_POINT}/api/fetch/city-fetch`)
    //   .then(response => {
    //     this.setState({
    //       cities: response.data,
    //     })
    //   })
  }

  componentDidMount() {
    const { match } = this.props;
    const requestParams = {
      "popularId": match.params.popularId,
    }
      if (match.params.popularId)
      axios.get(`${API_END_POINT}/api/users/one`, {params: requestParams})
        .then((response) => {
          this.setState({
            popular: response.data.object[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            // axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.popular.city_id}`)
            // .then((response) => {
            //   this.setState({
            //     city: response.data[0],
            //   });
            // });
          });
        });
    }

    setCity(selectedCity) {
      this.setState(prevState => ({
        city: selectedCity,
        popular: {
          ...prevState.popular,
          city_id: selectedCity.ID,
        },
      }));
    }

  setDescription(description) {
    const { popular } = this.state;
    popular.description = description.toString('html');
    this.setState({
      popular,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { popular } = this.state;
    popular[name] = value;
    this.setState({ popular });
  }

  postPopular(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, popular } = this.state;
    const token = Cookie.get('waffle_world_access_token');
    if (!loading) {
        const fd = new FormData();
        // if(profile_picture) {
        // fd.append('profile_picture', profile_picture);
        // }
        fd.append('popular', JSON.stringify(popular));

        this.setState({ loading: true });
        if(match.params.popularId) {
          popular.popularId = popular._id
          this.setState({ popular });
          // axios.patch('/api/popular/update', fd)
          axios.post(`${API_END_POINT}/api/users/update`, popular, {headers: {"auth-token": token}})
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
          axios.post(`${API_END_POINT}/api/users/register`, popular)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:', response.data.error)
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
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      popular,
      description,
      city,
      cities,
    } = this.state;
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
      INLINE_STYLE_BUTTONS: [
        {
          label: 'Bold',
          style: 'BOLD',
          className: 'custom-css-class',
        },
        {
          label: 'Italic',
          style: 'ITALIC',
        },
        {
          label: 'Underline',
          style: 'UNDERLINE',
        },
      ],
      BLOCK_TYPE_DROPDOWN: [
        {
          label: 'Normal',
          style: 'unstyled',
        },
        {
          label: 'Large Heading',
          style: 'header-three',
        },
        {
          label: 'Medium Heading',
          style: 'header-four',
        },
        {
          label: 'Small Heading',
          style: 'header-five',
        },
      ],
      BLOCK_TYPE_BUTTONS: [
        {
          label: 'UL',
          style: 'unordered-list-item',
        },
        {
          label: 'OL',
          style: 'ordered-list-item',
        },
      ],
    };
    // console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Popular Item Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postPopular}
                  >

                    <div className="ln_solid" />
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

