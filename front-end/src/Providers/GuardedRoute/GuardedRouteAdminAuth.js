import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';

const GuardedRouteAdminAuth = ({ component: Component, user, ...otherProps }) => (
    <Route
    {...otherProps}
    render={(props) => user && user.role === 'Admin' ? <Component {...props} /> : <Redirect to='/admin' />}

    />
)

GuardedRouteAdminAuth.propTypes = {
    component: propTypes.func.isRequired,
    user: propTypes.bool.isRequired
}

export default GuardedRouteAdminAuth
