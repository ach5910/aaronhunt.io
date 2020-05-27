import React from 'react';
import PropTypes from 'prop-types';
import { history } from '../../startup/client';
import { rippleClickDark } from "../../startup/client/utils";


const LandingPage = ({}) => {

    return(
        <section className="section home anchor">
            <div  className="home-content" >
                <div className="home-text">
                    Hello, I'm <span className="primary">Aaron Hunt</span>.
                    <br/>
                    Im a Frontend Engineer.
                </div>
                <button onClick={rippleClickDark(() => history.push("profile/"), 300, "clicked")} className="btn btn--outlined margin" style={{zIndex: 1}}>
                    View my work
                </button>
            </div>
        </section>
    )
}

LandingPage.defaultProps = {

}

LandingPage.propTypes = {

}

export default LandingPage;