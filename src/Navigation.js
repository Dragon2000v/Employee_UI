import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";

export class Navigation extends Component {
    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink className="nav-link" to="/" end>Home</NavLink>
                        <NavLink className="nav-link" to="/department">Department</NavLink>
                        <NavLink className="nav-link" to="/employee">Employee</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
