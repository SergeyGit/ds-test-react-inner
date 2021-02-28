import React from 'react';

import FirstSection from "../../components/Section/FirstSection/FirstSection";
import Promo from "../../components/Section/Promo/Promo";
// import Bradcrumb from "../Navigation/Bradcrumbs/Bradcrumb";

const Home = props => {
    return (
        <React.Fragment>
            {/*<Bradcrumb*/}
            {/*    {...props}*/}
            {/*    inner={false}*/}
            {/*/>*/}
            <FirstSection {...props}/>
            <Promo {...props}/>
        </React.Fragment>
    );
}

export default Home;
