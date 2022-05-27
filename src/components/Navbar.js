import React from "react";
  
function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <img
                    src=
                    "https://media.giphy.com/media/MNa0HKdhc3SGQ/giphy.gif"
                    width="75"
                    height="75"
                    className="d-inline-block align-top logo"
                    alt=""
                />
            </nav>
            <h1 className="display-4 font-weight-bold">Poll the Room</h1>
        </div>
    );
}
  
export default Navbar;