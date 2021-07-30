import "./styles/App.css";
import "./styles/scss/main.scss";
import React, { Component } from "react";
import Interface from "./components/Interface";

export class App extends Component {
    render() {
        return (
            <div className="App">
                <Interface />
            </div>
        );
    }
}

export default App;
