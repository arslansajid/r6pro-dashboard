import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      specialOffer: {
        itemId: '',
        isSpecialOffer: false,
        specialOfferPrice: '',
      },
      items: [],
      item: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postSpecialUser = this.postSpecialUser.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/items`, {headers: {"auth-token": token} })
        .then(response => {
          this.setState({
            items: response.data.objects,
          })
        })
        .catch(err => {
          this.setState({
            responseMessage: 'No Items Found...'
          })
        })
  }

  componentDidMount() {
    const { match } = this.props;
    const requestParams = {
      "itemId": match.params.specialOfferId,
    }
      if (match.params.specialOfferId)
      axios.get(`${API_END_POINT}/api/items/one`, { params: requestParams, headers: {"auth-token" : token} })
        .then((response) => {
          this.setState({
            specialOffer: response.data.object[0],
            item: response.data.object[0],
          });
        })
        .catch((error) => {
          window.alert(error)
        })
    }

    setCity(selectedCity) {
      this.setState(prevState => ({
        city: selectedCity,
        specialOffer: {
          ...prevState.specialOffer,
          city_id: selectedCity.ID,
        },
      }));
    }

  setDescription(description) {
    const { specialOffer } = this.state;
    specialOffer.description = description.toString('html');
    this.setState({
      specialOffer,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { specialOffer } = this.state;
    specialOffer[name] = value;
    this.setState({ specialOffer });
  }

  postSpecialUser(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, specialOffer } = this.state;
    const token = Cookie.get('r6pro_access_token');
    if (!loading) {
        this.setState({ loading: true });
        if(match.params.specialOfferId) {
          const requestParams = {
            "itemId": specialOffer._id,
            "specialOfferPrice": specialOffer.specialOfferPrice,
          }
          axios.post(`${API_END_POINT}/api/items/update`, requestParams, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR:', response.data.error)
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            window.alert(error);
          })
        }
        else {
          axios.post(`${API_END_POINT}/api/items/specialoffer`, specialOffer, {headers: {"auth-token": token}})
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

  setItem(selectedItem) {
    this.setState(prevState => ({
      item: selectedItem,
      specialOffer: {
        ...prevState.specialOffer,
        itemId: selectedItem._id,
      },
    }));
  }

  render() {
    console.log(this.state);
    const { match } = this.props;
    const {
      loading,
      specialOffer,
      item,
      items,
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
                  <h2>Enter Special Offer Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postSpecialUser}
                  >
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Item</label>
                      <div className="col-md-6 col-sm-6">
                        <Select
                          name="itemId"
                          value={item}
                          onChange={value => this.setItem(value)}
                          options={items}
                          valueKey="_id"
                          labelKey="name"
                          clearable={false}
                          backspaceRemoves={false}
                          required
                          readOnly={match.params.specialOfferId ? true : false}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Special Offer</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={specialOffer.isSpecialOffer}
                        onClick={() => {
                          specialOffer.isSpecialOffer = !specialOffer.isSpecialOffer;
                          this.setState({ specialOffer })
                        }}
                      />
                      </div>
                    </div>

                    {
                      specialOffer.isSpecialOffer
                      ?
                      <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Special Offer Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="specialOfferPrice"
                          className="form-control"
                          value={specialOffer.specialOfferPrice}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    :
                    null
                    }
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

