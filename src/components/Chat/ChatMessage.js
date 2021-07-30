import React, { Component, Fragment } from "react";
import { UpTriangle, DownTriangle } from "../Icons";

const BASE_URL = "https://parlezprod.azurewebsites.net/api/";

export class ChatMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            userId: "",
        };
    }

    componentDidMount() {
        this.checkAuthentication();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authToggle !== this.props.authToggle) {
            this.checkAuthentication();
        }
    }

    deleteMessage = (id) => {
        fetch(`${BASE_URL}Chat/mydelete?Id=${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                    "bearer-token"
                )}`,
            },
        })
            .then((res) => res.json())
            .then((json) => {
                const message = {
                    text: "Message successfully deleted",
                    active: true,
                };
                this.props.deleteMessage(message);
                this.props.fetchMessages();
            })
            .catch((err) => {
                const message = {
                    text: "Unable to delete message",
                    active: true,
                };
                this.props.deleteMessage(message);
            });
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

    checkAuthentication() {
        const userToken = sessionStorage.getItem("bearer-token");
        const userName = sessionStorage.getItem("authUserName");
        const userId = sessionStorage.getItem("userId");
        if (userToken && userName) {
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
        const { createdOn, messageText, userName, id } = this.props.message;
        const { isAuthenticated } = this.state;
        const deleteButton = (
            <Fragment>
                •&nbsp;
                <button
                    onClick={() => {
                        this.deleteMessage(id);
                    }}
                >
                    Delete
                </button>
            </Fragment>
        );
        return (
            <li>
                <div className="chat__container">
                    <div className="chat__col left">
                        <div className="img-container">
                            <img
                                src="https://pfteza-chatapp.s3-us-west-1.amazonaws.com/iconmonstr-user-20.svg"
                                alt="profile"
                            />
                        </div>
                        <div className="rating">
                            <span className="rating__container">
                                <button>
                                    <UpTriangle />
                                </button>
                                <span className="rating__int">+1</span>
                                <button>
                                    <DownTriangle />
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="chat__col right">
                        <div className="messageBody">
                            <span className="username">{userName}</span>
                            <span className="message">{messageText}</span>
                        </div>
                        <div className="messageMeta">
                            {createdOn} &nbsp;
                            {isAuthenticated &&
                            this.props.message.userId === this.state.userId
                                ? deleteButton
                                : null}
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

export default ChatMessage;
