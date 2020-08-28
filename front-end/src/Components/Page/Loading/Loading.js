import React from 'react';
import './Loading.css'
import { withRouter } from 'react-router-dom';

const Loading = ({location}) => {

    const togglePadding = ()  => location.pathname.includes('account') || location.pathname.includes('admin') ? '100px' : '0px';

    return <div style={{textAlign: 'center', paddingTop: togglePadding()}}><div className="lds-hourglass"></div></div>

}

export default withRouter(Loading)
