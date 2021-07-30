import React from "react";

const Preloader = () => {
    return (
        <div className="loader ">
            <div className="loading_ring">
                <div className="loading_select">
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <h3>loading</h3>
            </div>
        </div>
    );
};

export default Preloader;
