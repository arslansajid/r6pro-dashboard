import React, {Component} from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        {/* <span><a href="#">Waffle World Admin</a> &copy; 2020 Waffleworld.com</span> */}
        <span className="ml-auto">Powered by <a href="http://waffleworld.com.cy/">Waffleworld.com</a></span>
      </footer>
    )
  }
}

export default Footer;
