import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';

const GuardedRouteAuth = ({ component: Component, user, ...otherProps }) => (
    <Route
    {...otherProps}
    render={(props) => user ? <Component {...props} /> : <Redirect to='/home' />}

    />
)

GuardedRouteAuth.propTypes = {
    component: propTypes.func.isRequired,
    user: propTypes.oneOfType([propTypes.bool, propTypes.object]).isRequired
}

export default GuardedRouteAuth
