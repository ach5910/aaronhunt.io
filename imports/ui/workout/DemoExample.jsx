import React from 'react';
import headerLogo from '../../startup/client/static/epl_header_logo.svg';
import manLogo from '../../startup/client/static/man_city_logo.png';
import hudLogo from '../../startup/client/static/huddersfield_logo.png';
import backImg from '../../startup/client/static/man_city_v_huddersfield_background.svg';
const DemoExample = () => (
    <div className="backdrop-img" style={{backgroundImage: `url(${backImg})`}}>
        <img className="header-logo" src={headerLogo}/>
        <img className="westbrom-logo" src={manLogo}/>
        <div className="page-content" style={{maxWidth: "90rem", width: "100%"}}>
            <div style={{width: "100%"}}>
                <div className="resp-container">
                    <iframe 
                        className="resp-iframe"
                        src="http://localhost:8000/demo/highlights/img/e4bf421e-717c-47d1-8f1b-92c4560e9b21/"
                        />
                </div>
            </div>
        </div>
        <img className="qpr-logo" src={hudLogo}/>
    </div>
)

export default DemoExample;