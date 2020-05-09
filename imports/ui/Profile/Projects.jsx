import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Chip from './Chip';
import Modal from './Modal';
import GalleryProject from './GalleryProject';
import { useCallback } from 'react';
import { rippleClick, noop } from '../../startup/client/utils';
import ProjectInfo from './ProjectInfo';

const PROJECTS = {
    "Partner Portal" : {
        name: "Partner Portal",
        description: "A dashboard for broadcast stream owner to create, manage and publish highlights generated from by the Thuuz Smart Reels platform.",
        features: "Highlight rule creation, production effects, publish destination, live highlight feed, custom highlight creation, meta data editing and highlight preview",
        technology: "ReactJs, Redux, Thunk, Webpack, SCSS, JwPlayer, Bitmovin Video Player, Django Jest, WebDriverIO, Mocha, Chai.",
        "notable support": "Oauth support for social platforms (Twitter, Facebook, Google) to auto-publish highlights. Material UI components were migrated to custom components. Custom video player UI. Media upload support for production settings.",
        images: ["/portal_dimensions.png", "/portal_main.png",  "/portal_export.png"]
    },
    "Embedded Player" : {
        name: "Embedded Player",
        description: "An embeddable video player that allows users to create and watch custom highlights.",
        features: "Default highlight, game selection, custom highlights, live mode, Catch-up to Live, multi event highlight.",
        technology: "ReactJs, Redux, Thunk, Webpack, SCSS, JwPlayer, Bitmovin Video Player, Django Jest, WebDriverIO, Mocha, Chai.",
        "notable support": "Responsive design and mobile support. Embedded via iframe. Auto sizes for 16:9 aspect ratio.",
        images: ["/embedded_devices.png", "/embedded_multi.png","/embedded_menu.png", "/embedded_filter.png", "/embedded_live.png", "/embedded_portrait.png"],
        url: "https://www.thuuz.com/partners/video_player/al-arabiya/documentation/"
    },
    "Trash" : {
        name: "Trash",
        description: "A turn based game that promotes collusion and manipulation.",
        features: "Progressive Web App, service worker work caching requests, installable as mobile app that's available on device homescreen, SMS updates, offline accessible, messaging page, live updates via web socket, training areana for mini-games, game store for power-ups, stats page for data visualization.",
        technology: "ReactJs, GraphQl, Apollo, Meteor, NGinx, Pm2 Meteor, MongoDB, Redis PubSub, Twilio Messaging, SCSS.",
        "notable support": "Live messaging and game updates. Direct play",
        images: ["/trash_project.png", "/trash_layers.png", "/trash_menu.png", "/trash_offline.png", "/trash_stats.png",]
    },
    "Workout Tracker" : {
        name: "Workout Tracker",
        description: "A personal tracker to log workouts and exercises.",
        features: "Exercise creation, routine creation. Supports tracking(live) and logging(record/plan) a workout. Auto-fills exercises based on previous values. Calendar view. Progression stats and visualizations.",
        technology: "ReactJs, GraphQl, Apollo, Meteor, MeteorUp, MongoDB, Nginx.",
        "notable support": "First website built. Mobile support. Backend work. ",
        images: ["/portal_main.png"]
    },
    "Highlight Editing" : {
        name: "Highlight Editing",
        description: "Custom video editing support and components for clips and highlights. This suite has been ported to multiple projects and allows video editing with a standard player.",
        features: "Add segment padding, update start/end offsets, global and local scopes update, preview, window sliding. Highlight editing, segment breakdown, highlight preview, clip insertion, clip visibility control. Clip creation, metadata form.",
        technology: "ReactJs, SCSS, JwPlayer, Bitmovin Video Player, Django, Jest, WebDriverIO, Mocha, Chai.",
        "notable support": "Custom slider component, playback control, expanding a play, support for keyboard short cuts",
        images: ["/portal_main.png"]
    },
    "": {}
}

const Projects = ({}) => {
    const [chips, setChip] = useState([]);
    const [modal, setModal] = useState(false)
    const [project, setProject] = useState("");

    handleChip = (chip) => () => {
        const filter = chips.filter(name => name != chip);
        if (filter.length == chips.length){
            setChip([...filter, chip])
        } else {
            setChip(filter);
        }
    }

    const handleProject = useCallback((_project) => {
        setProject(_project);
        setModal(true);
    }, [setProject, setModal]);

    const handleModal = useCallback(() => {
        setModal(false);
        setProject("");
    }, [setProject, setModal]);

    return(
        <>
            <header className="header__title">Projects</header>
            <div className='row '>
                <div className='col s10 offset-s1 l6 offset-l3'>
                    <div className="flex " style={{width: "100%", flexWrap: "wrap"}}>
                        <Chip onClick={handleChip("GraphQl")} selected={chips.includes("GraphQl")}>
                            GraphQl
                        </Chip>
                        <Chip onClick={handleChip("React")} selected={chips.includes("React")}>
                            React
                        </Chip>
                        <Chip onClick={handleChip("Node")} selected={chips.includes("Node")}>
                            Node
                        </Chip>
                        <Chip  onClick={handleChip("MongoDB")} selected={chips.includes("MongoDB")}>
                            MongoDB
                        </Chip>
                        <Chip onClick={handleChip("Redux")} selected={chips.includes("Redux")}>
                            Redux
                        </Chip>
                        <Chip onClick={handleChip("Mobile")} selected={chips.includes("Mobile")}>
                            Mobile
                        </Chip>
                    </div>
                </div>
            </div>
            <div className='row '>
                <div className='col s10 offset-s1'>
                    <div className="gallery">
                        <GalleryProject name="Partner Portal" image="/portal_project.png" handleClick={handleProject} />
                        <GalleryProject name="Embedded Player" image="/embedded_project2.png" handleClick={handleProject} />
                        <GalleryProject name="Trash" image="/trash_project.png" handleClick={handleProject} />
                        <GalleryProject name="Workout Tracker" handleClick={handleProject} />
                        <GalleryProject name="Highlight Editing" handleClick={handleProject} />
                        <GalleryProject name="Partner Portal" handleClick={handleProject} />
                    </div>
                </div>
            </div>
            <Modal open={modal} handleClose={handleModal}>
                {modal && <ProjectInfo {...PROJECTS[project]} />}
            </Modal>
        </>
    )
}

Projects.defaultProps = {

}

Projects.propTypes = {

}

export default Projects;