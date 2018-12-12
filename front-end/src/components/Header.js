import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
    <header>
        <NavLink to="/contracts" activeClassName="is-active" exact={true} >Contracts</NavLink>
        <NavLink to="/issue" activeClassName="is-active" exact={true} >Issue RTHB</NavLink>
    </header>
);

export default Header;