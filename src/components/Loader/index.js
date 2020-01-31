import React from 'react';

import './style.scss';

export default function(props) {
  return props.loading ?  (
      <div key={1} className={`loaderOverlay ${props.position ? 'fixed' : 'absolute'} ${props.transparent ? 'transparent' : 'opaque'}`}>
        <div className={`logoCenter`}>
          <div className={`logoWrapper`}>
            <svg>
              <use xlinkHref={`${require('logo.svg')}#onlyLogo`}></use>
            </svg>
          </div>
        </div>
      </div>
  ) : null
}
