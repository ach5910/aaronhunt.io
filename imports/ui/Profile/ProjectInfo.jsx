import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Chip from './Chip';
import { rippleClick } from '../../startup/client/utils';
import { useCallback } from 'react';
import { useTransition, a } from 'react-spring';
import ArrowDownIcon from './ArrowDownIcon';


const ProjectInfo = ({name, images, ...rest}) => {
    const [tab, setTab] = useState("description");
    const [img, setImg] = useState(0);
    // const [dir, setDir] = useState(1)
    const dir = useRef(1)

    handleTab = (t) => () => {
        setTab(t);
    }

    handleImage = useCallback((_dir) => () => {
        const len = images.length
        // setDir(_dir)
        dir.current = _dir;
        setImg(_img => (_img + _dir + len ) % len)
    }, [setImg, images])

    const transitions = useTransition(img, p => p, {
        initial: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        from: { opacity: 0, transform: `translate3d(${dir.current * 100}%,0,0)` },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: `translate3d(${-1 * dir.current * 50}%,0,0)` },
    })

    return(
        <>
            <h1>{name}</h1>
            <div className="project__img-container">
                {transitions.map(({ item, props, key }) => (
                    <a.img key={key} style={props} className="project__img" src={images[item]}/>
                ))}
                <div onClick={rippleClick(handleImage(-1))}className="project__img-btn project__img-btn--left">
                    <ArrowDownIcon style={{transformOrigin: "50% 50%", transform: "rotate(90deg)"}} />
                </div>
                <div onClick={rippleClick(handleImage(1))}className="project__img-btn project__img-btn--right">
                    <ArrowDownIcon style={{transformOrigin: "50% 50%", transform: "rotate(-90deg)"}} />
                </div>
            </div>
            <div className="chip-container chip-container--tabs">
                <Chip onClick={handleTab("description")} tab selected={tab == "description"} >
                    Description
                </Chip>
                <Chip onClick={handleTab("features")} tab selected={tab == "features"} >
                    Features
                </Chip>
                <Chip onClick={handleTab("technology")} tab selected={tab == "technology"} >
                    Technology
                </Chip>
                <Chip onClick={handleTab("notable support")} tab selected={tab == "notable support"} >
                    Notable Support
                </Chip>
            </div>
            <div className="project-content">
                {rest[tab]}
            </div>
        </>
    )
}

ProjectInfo.defaultProps = {

}

ProjectInfo.propTypes = {

}

export default ProjectInfo;