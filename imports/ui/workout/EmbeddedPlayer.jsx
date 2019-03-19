import React from 'react';

const EmbeddedPlayer = () => (
    <div className="backdrop">
        <div className="page-content" style={{maxWidth: "90rem"}}>
            <h1 style={{fontSize: "4.4rem"}}>Centered inline player</h1>
            <div className="resp-container">
                <iframe className="resp-iframe"
                src="http://localhost:8000/demo/video_player/fdas/?asset_id=jsports_e36ec6e0-b226-43b0-93e5-fd21a19101e3"/>
                {/* src='http://localhost:8000/demo/highlights/jsports/e36ec6e0-b226-43b0-93e5-fd21a19101e3/'/>  */}
            </div>
        </div>
        <div className="page-content" style={{maxWidth: "90rem"}}>
            <br/>
            <br/>
            <h1 style={{fontSize: "4.4rem"}}>Inline player with additional content</h1>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: 'center'}}>
                <div>
                    <h2 style={{fontSize: "3.4rem"}}>Conent Sub header</h2>
                    <p style={{fontSize: "2.4rem"}}>This is some content. Imagine some content here and here and over here. Sooo much content</p>
                </div>
                <div style={{width: "150%"}}>
                    <div className="resp-container">
                        <iframe className="resp-iframe"
                        src="http://localhost:8000/demo/video_player/fdas/?asset_id=jsports_e36ec6e0-b226-43b0-93e5-fd21a19101e3"/>
                    </div>
                </div>
            </div>
            <br/>
            <p style={{fontSize: "2.4rem"}}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum optio, voluptas consequuntur ipsam in non laudantium amet fuga eos error sequi, sed dolore architecto voluptates autem eligendi sint alias suscipit!</p>
        </div>
    </div>
)

export default EmbeddedPlayer;