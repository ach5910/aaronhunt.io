import React from 'react';
import PropTypes from 'prop-types';

const _image = "https://s.cdpn.io/profiles/user/2662279/512.jpg?1555384482";
const _name = "Partner Portal";

const GalleryProject = ({image=_image, name=_name, handleClick}) => {
    handleOpen = () => {
        console.log('click')
        handleClick(name)
    }
    return(
        <div className="project-img__container">
            <img className="project-img" src={image}/>
            <div className="cover">
                <div className="cover-title">
                    {name}
                </div>
                <div onClick={handleOpen} className="cover-link">
                    Click Here
                </div>
            </div>
        </div>
    )
}

GalleryProject.defaultProps = {

}

GalleryProject.propTypes = {

}

export default GalleryProject;