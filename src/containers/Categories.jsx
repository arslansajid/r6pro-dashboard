import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
// import Swal from 'sweetalert2'
import Cookie from 'js-cookie';
const token = Cookie.get('r6pro_access_token');

import HasRole from '../hoc/HasRole';

export default class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      activePage: 1,
      pages: 1,
      q: '',
      pageSize: 10,
      responseMessage: 'Loading Categories...'
    }
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/categories`)
      .then(response => {
        this.setState({
          categories: response.data.objects,
          // pages: Math.ceil(response.data.total/10),
          responseMessage: 'No Categories Found...'
        })
      })
  }
  
  getParams() {
    const {
      activePage,
      pageSize,
    } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
  }

  deleteCategory(categoryId, index) {
    const requestParams = {
      "categoryId": categoryId,
    }
    if(confirm("Are you sure you want to delete this category?")) {
      axios.delete(`${API_END_POINT}/api/categories/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          if(response.status === 200) {
            Swal.fire({
              type: 'success',
              title: 'Deleted...',
              text: 'Categories has been deleted successfully!',
            })
          }
          
          const categories = this.state.categories.slice();
          categories.splice(index, 1);
          this.setState({ categories });
        });
    }
  }
  handleSelect(page) {
    this.setState({ activePage: page }, () => {
      axios.get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
    // axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
    .then(response => {
      this.setState({
        categories: response.data.items,
        activePage: page
      })
    })
    })
  }
  handleSearch() {
    axios.get(`/api/category?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          categories: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Categories</h3>
            </div>
            <div className="col-sm-4">
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
                  <button type="button" className="btn btn-success marginTop">Add new Categories</button>
                </Link>
              </HasRole>
            </div> */}

            <div className="col-sm-4 pull-right mobile-space">
                <Link to="/categories/category_form">
                  <button type="button" className="btn btn-success">Add new Categories</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.categories && this.state.categories.length >= 1 ?
                  this.state.categories.map((category, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={category.image && category.image} />}</td>
                    <td>{category.name}</td>
                    {/* <td>{category.size}</td> */}
                    <td>{category.description}</td>
                    {/* <td>{category.marla_size}</td>
                    <td>{category.population}</td>
                    <td>{category.lat}</td>
                    <td>{category.lon}</td> */}
                    <td>
                      <Link to={`/categories/category/${category._id}/items`}>
                        <button type="button" className="btn btn-info btn-sm">View Items</button>
                      </Link>
                    </td>
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/categories/edit-category/${category._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteCategory(category._id, index)}></span>
                      </td>
                    {/* </HasRole> */}
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
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
