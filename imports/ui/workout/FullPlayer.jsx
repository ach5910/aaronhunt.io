import React from 'react';

const FullPlayer = () => (
    <React.Fragment>
        {/* <button 
            style={{
                position: "absolute",
                left: "80%",
                top: "20px",
                zIndex: "1",
                background: "white"
            }}  
            onClick={() => {
                const iframe = document.querySelector("iframe");
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                    console.log('fullscreen')
                  } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                    console.log('fullscreen')
                  } else if (iframe.mozRequestFullScreen) {
                    iframe.mozRequestFullScreen();
                    console.log('fullscreen')
                  } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                    console.log('fullscreen')
                  } else {
                      console.log('fuck you')
                  }
            }}
        >Fullscreen</button> */}
        <iframe className="resp-iframe" 
        // src="http://localhost:8000/demo/video_player/fdas/?asset_id=jsports_e36ec6e0-b226-43b0-93e5-fd21a19101e3"/>
        // src="http://192.168.50.61:8000/demo/video_player/proxy_player/" /> //fdas/?asset_id=jsports_e36ec6e0-b226-43b0-93e5-fd21a19101e3"/>
        src="http://localhost:8000/demo/video_player/thuuz/?asset_id=thuuz_THUUZ-PRIMARY_c813e808-d5a9-411a-bb62-dac4459fe0c7_2019.05.07T19.00.00"/>

    </React.Fragment>
)

export default FullPlayer;