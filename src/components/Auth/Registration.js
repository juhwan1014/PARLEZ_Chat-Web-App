import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MailIcon, LockIcon, CautionIcon } from "../Icons";
import { withRouter } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isValid: true,
            confirmpassword: "",
            errors: [],
        };
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({ input });
    }

    resetErrors() {
        this.setState({ errors: [], isValid: true });
    }

    validate(event) {
        event.preventDefault();
        let email = this.state.email;
        let password = this.state.password;
        let confirmpassword = this.state.confirmpassword;

        if (!email) {
            //state is set to false if email is invalid
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Please enter your email address";

            //checks the array to see if error stil exisits
            if (errors.includes(errorMessage)) {
                return;
            } else {
                //pushes the error message into the error state array
                errors.push(errorMessage);
            }
        }

        let pattern = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        if (!pattern.test(email)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Not a valid email address";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        let upperCase = new RegExp(/^(?=.*[A-Z])/);

        //checks for uppercase
        if (!upperCase.test(password)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Password needs to include an UPPERCASE letter";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        let lowerCase = new RegExp(/^(?=.*[a-z])/);

        //checks for lowercase
        if (!lowerCase.test(password)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Password needs to include a lowercase letter ";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        let digits = new RegExp(/^(?=.*[0-9])/);
        //checks for a number
        if (!digits.test(password)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Password needs to include a number";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        let special = new RegExp(/^(?=.*[!@#$&*])/);

        //checks for a special character
        if (!special.test(password)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage =
                "Passwords needs a special character !, @, #, $, or &";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        let passLength = new RegExp(/^(?=.*[A-Za-z\d$@$!%*?&]{7})/);

        //Checks the password length
        if (!passLength.test(password)) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "Password must be at least 7 characters";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        //Check matching password
        if (confirmpassword !== password) {
            this.setState({ isValid: false });
            let errors = this.state.errors;
            let errorMessage = "The passwords do not match";
            if (errors.includes(errorMessage)) {
                return;
            } else {
                errors.push(errorMessage);
            }
        }

        if (this.state.isValid === true) {
            this.handleSubmit(event);
        }
    }

    handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();

        fetch("https://parlezprod.azurewebsites.net/Auth/Register", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Email: this.state.email,
                Password: this.state.password,
                ConfirmPassword: this.state.confirmpassword,
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
                    let errorMessage = json.title;
                    let errors = this.state.errors;

                    if (errors.includes(errorMessage)) {
                        return;
                    } else {
                        errors.push(errorMessage);
                    }
                    this.setState({ isValid: false });
                }
            })
            // Data not retrieved.
            .catch(function (error) {
                console.log(error);
            });
    };

    onInputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    render() {
        const { isValid, errors } = this.state;

        return (
            <section className="Login">
                <div className="form__container">
                    <div className="modal-form">
                        <div className="modal-head">
                            <h3 className="modal-title">Register</h3>
                            <form
                                onSubmit={(e) => this.validate(e)}
                                onChange={(e) => this.resetErrors(e)}
                            >
                                <div className="fieldset">
                                    <MailIcon />
                                    <input
                                        className="input"
                                        //type="email"
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
                                <div className="fieldset">
                                    <LockIcon />
                                    <input
                                        className="input"
                                        type="password"
                                        id="confirmpassword"
                                        placeholder="Confirm password"
                                        value={this.state.confirmpassword}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                <div className="fieldset submit">
                                    <button className="submit">Register</button>
                                </div>
                            </form>
                            {isValid
                                ? null
                                : errors.map((err) => {
                                      return (
                                          <div className="em__container">
                                              <div className="em__wrap">
                                                  <div className="svg-cont">
                                                      <CautionIcon />
                                                  </div>
                                                  <p>{err}</p>
                                              </div>
                                          </div>
                                      );
                                  })}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(Register);
