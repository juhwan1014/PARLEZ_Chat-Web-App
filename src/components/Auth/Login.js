import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { MailIcon, LockIcon, CautionIcon } from "../Icons";
import { withRouter } from "react-router-dom";

class Login extends Component {
    state = {
        email: "",
        password: "",
        error: {
            message: "",
            active: false,
        },
    };

    handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();

        //Integrate Auth here on valid form submission
        fetch("https://parlezprod.azurewebsites.net/Auth/Login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Email: this.state.email,
                Password: this.state.password,
            }),
        })
            // Response received.
            .then((response) => response.json())
            // Data retrieved.
            .then((json) => {
                // Store token with session data.
                if (json["status"] === "OK") {
                    sessionStorage.setItem("bearer-token", json["token"]);
                    sessionStorage.setItem("authUserName", json["username"]);
                    sessionStorage.setItem("userId", json["userid"]);
                    this.props.history.push("/");
                } else {
                    // error message handling
                    this.setState({
                        error: {
                            message:
                                "The validation is failed. Please check again your email and password.",
                            active: true,
                        },
                    });
                }
            })
            // Data not retrieved.
            .catch(function (error) {
                console.log(error);
            });
    };

    validateLogin = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        let isEmail = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );

        if (!email && !password) {
            this.setState({
                error: {
                    message: "Please enter your email.",
                    active: true,
                    message2: "Please enter your password.",
                    active2: true,
                },
            });
        } else if (!email) {
            this.setState({
                error: { message: "Please enter your email.", active: true },
            });
            return null;
        } else if (!password) {
            this.setState({
                error: { message: "Please enter your password.", active: true },
            });
            return null;
        } else if (!isEmail.test(email) && !password) {
            this.setState({
                error: {
                    message:
                        "Your Email is not valid. Please check your Email again.",
                    active: true,
                    message2: "Please enter your password.",
                    active2: true,
                },
            });
        } else if (!isEmail.test(email)) {
            this.setState({
                error: {
                    message:
                        "Your Email is not valid. Please check your Email again.",
                    active: true,
                },
            });
        } else {
            this.handleSubmit(e);
        }
    };

    resetErrors = () => {
        setTimeout(() => {
            this.setState({
                error: {
                    message: "",
                    active: false,
                    message2: "",
                    active2: false,
                },
            });
        }, 4000);
    };

    onInputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    render() {
        const { error } = this.state;

        const errorMessage = (
            <Fragment>
                <div className="em__container">
                    <div className="em__wrap">
                        <div className="svg-cont">
                            <CautionIcon />
                        </div>
                        <p>{error.message}</p>
                    </div>
                </div>
            </Fragment>
        );
        const errorMessage2 = (
            <Fragment>
                <div className="em__container">
                    <div className="em__wrap">
                        <div className="svg-cont">
                            <CautionIcon />
                        </div>
                        <p>{error.message2}</p>
                    </div>
                </div>
            </Fragment>
        );

        return (
            <section className="Login">
                <div className="form__container">
                    <div className="modal-form">
                        <div className="modal-head">
                            <h3 className="modal-title">Login</h3>
                        </div>
                        <form onSubmit={(e) => this.validateLogin(e)}>
                            <div className="fieldset">
                                <MailIcon />
                                <input
                                    className="input"
                                    type="text"
                                    id="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onInputChange}
                                />
                            </div>

                            <div className="fieldset">
                                <LockIcon />
                                <input
                                    className="input"
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.onInputChange}
                                />
                            </div>

                            <div className="fieldset submit">
                                <button className="submit">Login</button>
                            </div>
                        </form>
                        <div className="error-container">
                            <div className="active1">
                                {error.active ? errorMessage : ""}
                            </div>
                            <div className="active2">
                                {error.active2 ? errorMessage2 : ""}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register">Sign up</Link>
                        </p>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(Login);
