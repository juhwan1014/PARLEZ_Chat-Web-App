import React, { Component } from "react";
import Chatlist from "./Chat/Chatlist";
import SubmitMessage from "./Chat/SubmitMessage";

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { rerender: false };
    }

    didPost = () => {
        this.setState({ rerender: !this.state.rerender });
    };

    render() {
        const { rerender } = this.state;
        const { authToggle } = this.props;
        return (
            <div className="Chat">
                <Chatlist rerender={rerender} authToggle={authToggle} />
                <SubmitMessage didPost={this.didPost} authToggle={authToggle} />
            </div>
        );
    }
}

export default Chat;
