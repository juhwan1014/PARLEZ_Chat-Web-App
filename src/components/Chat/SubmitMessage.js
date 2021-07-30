import React, { Component, Fragment } from "react";
import { CautionIcon, RefreshIcon } from "../Icons";
const BASE_URL = "https://parlezprod.azurewebsites.net/api/";

export class SubmitMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            messageText: "",
            isAuthenticated: false,
            userId: "",
            error: {
                message: "",
                active: false,
            },
        };
    }

    componentDidMount() {
        this.checkAuthentication();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.authToggle !== this.props.authToggle) {
            this.checkAuthentication();
        }
        if (prevState.error.active !== this.state.error.active) {
            this.resetErrors();
        }
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    submitMessages = (e) => {
        e.preventDefault();
        fetch(`${BASE_URL}Chat`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                    "bearer-token"
                )}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: this.state.userName,
                messageText: this.state.messageText,
                createdOn: new Date().toLocaleString('en-US'),
                userId: this.state.userId,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                this.props.didPost();
                this.setState({ messageText: "" });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    validateMessage = (e) => {
        e.preventDefault();
        const { messageText, userName } = this.state;
        if (!messageText && !userName) {
            this.setState({
                error: {
                    message:
                        "You cannot submit a message without message content or an alias.",
                    active: true,
                },
            });
            return null;
        } else if (!messageText) {
            this.setState({
                error: {
                    message:
                        "You cannot submit a message without message content.",
                    active: true,
                },
            });
            return null;
        } else if (!userName) {
            this.setState({
                error: {
                    message: "You cannot submit a message without an alias.",
                    active: true,
                },
            });
            return null;
        } else {
            this.submitMessages(e);
        }
    };

    handleLogout = () => {
        this.setState(
            {
                isAuthenticated: false,
                userName: "",
                messageText: "",
                userId: "",
            },
            () => {
                sessionStorage.clear();
            }
        );
    };

    resetErrors = () => {
        setTimeout(() => {
            this.setState({
                error: {
                    message: "",
                    active: false,
                },
            });
        }, 4000);
    };

    loadMore = () => {
        this.props.didPost();
    };

    checkAuthentication() {
        const userToken = sessionStorage.getItem("bearer-token");
        const userName = sessionStorage.getItem("authUserName");
        const userId = sessionStorage.getItem("userId");
        if (userToken && userName && userId) {
            this.setState({
                isAuthenticated: true,
                userName: userName,
                userId: userId,
            });
        } else {
            this.handleLogout();
        }
    }

    render() {
        const { isAuthenticated, error } = this.state;
        const authInput = (
            <Fragment>
                <label id="sm__label">
                    <p>Alias:</p>
                </label>
                <div className="fieldset">
                    <input
                        type="text"
                        placeholder="Username"
                        id="userName"
                        value={this.state.userName}
                        onChange={() => {
                            return null;
                        }}
                    />
                </div>
            </Fragment>
        );

        const guestInput = (
            <Fragment>
                <label id="sm__label">
                    <p>Alias: </p>
                </label>
                <div className="fieldset">
                    <input
                        type="text"
                        placeholder="Username"
                        id="userName"
                        value={this.state.userName}
                        onChange={(e) => this.onInputChange(e)}
                    />
                </div>
            </Fragment>
        );

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

        return (
            <section className="SubmitMessage">
                <button
                    className="refresh"
                    onClick={(e) => {
                        this.loadMore(e);
                    }}
                >
                    {" "}
                    <div className="svg-cont">
                        <RefreshIcon />
                    </div>
                    <span>Fetch Messages</span>
                </button>
                {error.active ? errorMessage : ""}
                <div className="sm__wrap">
                    <form onSubmit={(e) => this.validateMessage(e)}>
                        {isAuthenticated ? authInput : guestInput}
                        <br />
                        <label id="sm__label">
                            <p>Message:</p>
                        </label>
                        <div className="fieldset">
                            <textarea
                                rows="2"
                                type="text"
                                placeholder="Aa"
                                id="messageText"
                                value={this.state.messageText}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </div>
                        <div className="fieldset submit">
                            <button>Send</button>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default SubmitMessage;
