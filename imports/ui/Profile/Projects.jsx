import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Chip from './Chip';
import Modal from './Modal';
import GalleryProject from './GalleryProject';
import { useCallback } from 'react';
import { rippleClick, noop, useMeasure, useMedia } from '../../startup/client/utils';
import ProjectInfo from './ProjectInfo';
import { history } from '../../startup/client';
import { PORTFOLIO_PROJECTS } from '../../routes/liftRoutes';
import { useTransition } from 'react-spring';
import { useRef } from 'react';

const tags = [
    "Redux",
    "React Router",
    "GraphQl",
    "Node",
    "MongoDB",
    "Meteor",
    "Mobile",
    "Desktop",
]
const Projects = ({}) => {
    const [chips, setChip] = useState([]);
    const projects = useRef(Object.values(PORTFOLIO_PROJECTS));
    // Hook2: Measure the width of the container element
    const [bind, { width }] = useMeasure()
    const columns = useMedia(['(min-width: 993px)', '(min-width: 601px)'], [2, 1], 1)

    handleChip = (chip) => () => {
        let _filter = chips.filter(name => name != chip);
        if (_filter.length == chips.length){
            _filter = [..._filter, chip]
        } 
        projects.current = projects.current
            .map((p) => ({
                ...p,
                disabled: _filter.length > 0 &&  !_filter.every(f => p.tags.includes(f)) //p.tags.every(t => !_filter.includes(t))
            }))
            .sort((a, b) => {
                if (a.disabled !== b.disabled){
                    if (a.disabled){
                        return 1
                    }
                    return -1
                }
                return 0;
            })
        setChip(_filter);
    }

    let heights = (new Array(columns).fill(0)) // Each column gets a height starting with zero
    let gridItems = projects.current.map((child, i) => {
        const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
        const xy = [(width / columns) * column, (heights[column] += child.height + 16) - child.height] // X = container width / number of columns * column index, Y = it's just the height of the current column
        return { ...child, xy, width: width / columns, height: child.height}
    })
    // Hook5: Turn the static grid values into animated transitions, any addition, removal or change will be animated
    const transitions = useTransition(gridItems, item => item.name, {
        from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
        enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
        update: ({ xy, width, height }) => ({ xy, width, height }),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25
    })

    const handleProject = useCallback((_project) => {
        history.push(`/profile/project/${_project}`)
        // setProject(_project);
        // setModal(true);
    }, [history]);

    return(
        <>
            <header className="header__title">Projects</header>
            <div className='row no-margin'>
                <div className='col s12  l8 offset-l2'>
                    <div className="flex " style={{width: "100%", flexWrap: "wrap"}}>
                        {tags.map((tag) => (
                            <Chip key={`project__tags tag--${tag}`} onClick={handleChip(tag)} selected={chips.includes(tag)}>
                                {tag}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
            <div className='row '>
                <div className='col s10 offset-s1 no-padding'>
                    <div  {...bind} className="gallery" style={{ height: `${Math.max(...heights)}px` }}>
                        {transitions
                            .map(({item: {name, thumbnail, disabled}, props}) => (
                            <GalleryProject style={props} disabled={disabled} key={`project__list project--${name}`} name={name} image={thumbnail} handleClick={handleProject} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

Projects.defaultProps = {

}

Projects.propTypes = {

}

export default Projects;