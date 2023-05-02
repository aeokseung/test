import React from 'react';

import Map from './Map';
import SearchData from "./SearchData";
function Main() {
    return (
        <div>
            <div style={{display: "flex"}}>
                <Map/>
                <SearchData />
            </div>
        </div>
    )
}
export default Main;