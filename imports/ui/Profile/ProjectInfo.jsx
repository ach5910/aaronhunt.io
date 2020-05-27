import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { rippleClick } from '../../startup/client/utils';
import { useCallback } from 'react';
import { useTransition, a } from 'react-spring';
import ArrowDownIcon from './ArrowDownIcon';
import { useEffect } from 'react';
import AtomIcon from './AtomIcon';


const ProjectInfo = ({name, images, history,  sections}) => {
    const [img, setImg] = useState(0);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(history.action != "REPLACE");
    const loadingTransition = useTransition(loading, null, {
        from: { opacity: 1, transform: "scale(1)"},
        enter: { opacity: 1, transform: "scale(1)"},
        leave: { opacity: 0, transform: "scale(0)"},
    })
    const dir = useRef(1)

    useEffect(() => {
        if (!mounted.current){
            mounted.current = true;
            document.body.scrollTop = 0;
        }
    }, [])

    handleImage = useCallback((_dir) => () => {
        const len = images.length
        dir.current = _dir;
        setImg(_img => (_img + _dir + len ) % len)
    }, [setImg, images])


    const transitions = useTransition(img, p => p, {
        initial: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        from: { opacity: 0, transform: `translate3d(${dir.current * 100}%,0,0)` },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0.3, transform: `translate3d(${-1 * dir.current * 50}%,0,0)` },
    })

    const {description, features, technology, ...rest} = sections;
    return(
        <>
            {loadingTransition.map(({item, props}) => (
                item &&
                <a.div className="splash-content" style={props}>
                    <div className="loading-content">
                        <AtomIcon bind={{onAnimationEnd: () => { setTimeout(() => {
                            setLoading(false)
                        }, 200)}}} style={{height: "20rem", zIndex: 3}} className="animate"/>
                    </div>
                </a.div>
            ))}
            <div className="project__img-wrapper">
                <div onClick={rippleClick(() => {console.log('rip'); history.replace("/profile")}, 300)} className="project__back">
                    <ArrowDownIcon/>
                </div>
                <div className="container">
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
                </div>
            </div>
            <div className="container">
                <h1 className="project__name">{name}</h1>
                    <div className='row '>
                        <div className='col s12 '>
                            <p className="project__description">{description}</p>
                        </div>
                    </div>
                    <h2 className="project__section">Features</h2>
                    <ul className="project__section-list">
                    {Object.keys(features).map(f => (
                        <li key={`project--info features--${f}`}>
                                <div>
                                    <strong>{f}</strong>
                                    <span>{`\u00A0\u00A0${features[f]}`}</span>
                                </div>
                        </li>
                    ))}
                    </ul>
                    <h2 className="project__section">Technology</h2>
                    <ul className="project__section-list">
                    {Object.keys(technology).map(t => (
                        <li key={`project--info technology--${t}`}>
                                <div>
                                    <strong>{t}</strong>
                                    <span>{`\u00A0\u00A0${technology[t]}`}</span>
                                </div>
                        </li>
                    ))}
                    </ul>
                    {Object.keys(rest).map((section) => (
                        <React.Fragment key={`project--info section--${section}`}>
                            <h2 className="project__section">{section}</h2>
                            <ul className="project__section-list">
                                {rest[section].map(item => (
                                    <li key={`project__info ${section}--${item}`}>
                                            {item}
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    ))}
            </div>
        </>
    )
}

ProjectInfo.defaultProps = {

}

ProjectInfo.propTypes = {

}

export default ProjectInfo;