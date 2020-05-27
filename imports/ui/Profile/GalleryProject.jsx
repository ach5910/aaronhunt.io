import React from 'react';
import PropTypes from 'prop-types';
import {a, interpolate} from 'react-spring';


const GalleryProject = ({image, name, disabled, handleClick, style: {xy, ...rest}}) => {
    handleOpen = () => {
        console.log('click')
        handleClick(name)
    }
    return(
        <a.div style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }} className="project-img__container">
            <img className="project-img" src={image}/>
            <div className={cn("cover", {"cover--disabled": disabled})}>
                <div className="cover-title">
                    {name}
                </div>
                <div onClick={handleOpen} className="cover-link">
                    View More
                </div>
            </div>
        </a.div>
    )
}

GalleryProject.defaultProps = {

}

GalleryProject.propTypes = {

}

export default GalleryProject;