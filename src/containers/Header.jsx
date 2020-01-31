import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <h3 style={{color: 'white'}} className="text-center">R6Pro Admin Dashboard</h3>
        </nav>
      </div>
    );
  }
}
