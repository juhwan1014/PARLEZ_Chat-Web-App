import React, { Component } from "react";
import ChatMessage from "./ChatMessage";
import ChatBlocker from "./ChatBlocker";
import Preloader from "../Global/Preloader";
import { CautionIcon } from "../Icons";

const BASE_URL = "https://parlezprod.azurewebsites.net/api/";

export class Chatlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: true,
            messages: [],
            isLoading: false,
            message: {
                text: "",
                active: false,
            },
        };
    }

    componentDidMount = () => {
        this.fetchMessages();
        this.scrollToBottom();
    };
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.rerender !== this.props.rerender) {
            this.fetchMessages();
        }
        if (prevState.message.active !== this.state.message.active) {
            this.resetErrors();
        }
    };

    messageDelete = (childData) => {
        console.log(childData);
        this.setState({
            message: { text: childData.text, active: childData.active },
        });
    };

    resetErrors = () => {
        setTimeout(() => {
            this.setState({
                message: {
                    text: "",
                    active: false,
                },
            });
        }, 2000);
    };

    fetchMessages = () => {
        this.setState({ isLoading: true });
        fetch(`${BASE_URL}Chat`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                    "bearer-token"
                )}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const mappedData = data.map((d) => {
                    return {
                        ...d,
                        createdOn: this.parseDate(d.createdOn),
                    };
                });
                this.setState({ messages: mappedData }, () => {
                    this.scrollToBottom();
                });
                this.setState({ isLoading: false });
            })
            .catch((err) => {});
    };

    parseDate = (date) => {
        // Parse data into a date string
        const parsedDate = Date.parse(date);
        // if can't parse, return the original string
        if (!parsedDate) return date;
        // Make parsedDate into a new Date object
        const d = new Date(parsedDate);
        // config date options
        const dateOptions = { year: "numeric", month: "long", day: "2-digit" };
        const timeOptions = { hour: "numeric", minute: "numeric" };
        // Set current date and time
        const currDate = new Intl.DateTimeFormat("en", dateOptions).format(d);
        const time = new Intl.DateTimeFormat("en", timeOptions).format(d);
        // Return formatted date string
        const dateString = `${currDate} at ${time}`;
        return dateString;
    };

    scrollToBottom = () => {
        const ChatList = document.querySelector(".ChatList");
        const Chat = document.querySelector("ul.Chat");
        setTimeout(() => {
            ChatList.scrollTop = Chat.scrollHeight;
        }, 500);
    };

    render() {
        const { isAuthenticated, isLoading, message } = this.state;
        const { authToggle } = this.props;
        const activeChat = {
            overflowY: "auto",
        };
        const inactiveChat = {
            overflowY: "hidden",
        };
        return (
            <div
                className="ChatList"
                style={isAuthenticated ? activeChat : inactiveChat}
            >
                {message.active === true ? (
                    <div className="info-text">
                        <div className="info__container">
                            <div className="svg-cont">
                                <CautionIcon />
                            </div>
                            <p> {message.text} </p>
                        </div>
                    </div>
                ) : null}
                {isAuthenticated ? "" : <ChatBlocker />}
                {isLoading ? <Preloader /> : null}
                <ul className="Chat">
                    {this.state.messages.map((message, index) => {
                        return (
                            <ChatMessage
                                message={message}
                                key={index}
                                authToggle={authToggle}
                                fetchMessages={this.fetchMessages}
                                deleteMessage={this.messageDelete}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default Chatlist;
