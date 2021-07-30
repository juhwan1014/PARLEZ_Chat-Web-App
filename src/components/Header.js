import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { UserIcon, ChatBubble } from "./Icons";

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            username: "",
        };
    }

    componentDidMount() {
        this.checkAuthentication();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.checkAuthentication();
        }
    }

    checkAuthentication() {
        const userToken = sessionStorage.getItem("bearer-token");
        const userName = sessionStorage.getItem("authUserName");
        if (userToken && userName) {
            this.setState({ isAuthenticated: true, username: userName });
        } else {
            this.handleLogout();
        }
    }

    handleLogout = () => {
        this.setState({ isAuthenticated: false }, () => {
            this.props.toggleAuth();
            sessionStorage.clear();
            localStorage.clear();
        });
    };

    render() {
        const { isAuthenticated, username } = this.state;
        const authLinks = (
            <Fragment>
                <ul className="header__navigation">
                    <li>
                        <button onClick={() => this.handleLogout()}>
                            Logout
                        </button>
                    </li>
                    <li className="icon">
                        {username}{" "}
                        <div className="svg-cont">
                            <UserIcon />
                        </div>
                    </li>
                </ul>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <ul className="header__navigation">
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            </Fragment>
        );

        return (
            <header>
                <section className="header__wrap">
                    <div className="header__pseudo">
                        <h3 className="white logo">
                            <div className="svg-cont">
                                <ChatBubble />
                            </div>
                            <Link to="/">PARLEZ</Link>
                        </h3>
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </section>
            </header>
        );
    }
}

export default withRouter(Header);
