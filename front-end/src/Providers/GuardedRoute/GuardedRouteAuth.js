import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';

const GuardedRouteAuth = ({ component: Component, user, ...otherProps }) => (
    <Route
    {...otherProps}
    render={(props) => user ? <Component {...props} /> : <Redirect to='/login' />}

    />
)

GuardedRouteAuth.propTypes = {
    component: propTypes.func.isRequired,
    user: propTypes.bool.isRequired
}

export default GuardedRouteAuth
