import React,{ useEffect, useRef, useState, useCallback} from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import anime from "animejs";
import floatySpace from '../../startup/client/canvas';
import { rippleClick, rippleClickDark, noop } from '../../startup/client/utils';
import PerformanceIcon from './PerformanceIcon';
import ResponsiveIcon from './ResponsiveIcon';
import IntuitiveIcon from './IntuitiveIcon';
import DynamicIcon from './DynamicIcon';
import { HOME, ABOUT, PROJECTS, CONTACT } from '../../startup/client/constants';
import ContactSection from './ContactSection';

let observer;
let intersectCb = noop;

function buildThresholds(n){
    const thresholds = []
    for (let i = 0; i <= n; i++)
        thresholds.push(i / n)
    return thresholds;
}
function createObserver(){
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: buildThresholds(20),
    }
    observer = new IntersectionObserver(handleIntersect, options);
    Object.keys(refs).forEach((section) => {
        if (refs[section]){
            observer.observe(refs[section])
        }
    })
}

function handleIntersect(entries){
    console.log('handleIntersect')
    entries.forEach(entry => {
        // if (entry.isIntersecting)
        if (entry.isIntersecting){
            const {
                boundingClientRect: {height: sectionHeight}, 
                rootBounds: {height: pageHeight}
            } = entry;
            if (sectionHeight * entry.intersectionRatio >= pageHeight / 2){
                intersectCb(entry.target.dataset.section)
            }
        }
    })
}

// window.addEventListener("load", createObserver, false)
const scrollEl = document.scrollingElement || document.body;


const refs = {
    [HOME]: null,
    [ABOUT]: null,
    [PROJECTS]: null,
    [CONTACT]: null,
}
const Profile = ({}) => {
    const [section, setSection] = useState(HOME);
    const refCallback = useCallback((el, section) => {
        if (el) {
            if (!refs[section] && observer){
                observer.observe(el);
            }
            refs[section] = el;
        }
    })

    useEffect(() => {
        createObserver()
        intersectCb = setSection;
    },[])

    function scrollToSection(section){
        return function scrollToSectionEvent(e){
            if (refs[section]){
                const {top} = refs[section].getBoundingClientRect();
                anime({
                    targets: document.body,
                    scrollTop: refs[section].offsetTop,
                    duration: 500,
                    autoplay: true,
                    easing: 'easeInOutQuad',
                })
                setSection(section);
            }
        }
    }
    return(
        <React.Fragment>
            <section data-section={HOME} ref={(el) => {refCallback(el, HOME)}} className="section home anchor">
                <div id="pt" className="canvas"></div>
                <div className="flex flex--col">
                    <div className="home-text">
                        Hello, I'm <span className="primary">Aaron Hunt</span>.
                        <br/>
                        Im a Frontend Engineer.
                    </div>
                    <button onClick={rippleClickDark(scrollToSection(ABOUT), 300, "clicked")} className="btn btn--outlined margin" style={{zIndex: 1}}>
                        View my work
                    </button>
                </div>
            </section>
            <nav className="row nav-bar">
                <ul className="nav-links col s12 m6  offset-m2">
                    <li><a href="#" onClick={scrollToSection(HOME)} className={classNames("nav-link", {active: section == HOME })}>{HOME}</a></li>
                    <li><a href="#" onClick={scrollToSection(ABOUT)} className={classNames("nav-link", {active: section == ABOUT })}>{ABOUT}</a></li>
                    <li><a href="#" onClick={scrollToSection(PROJECTS)} className={classNames("nav-link", {active: section == PROJECTS })}>{PROJECTS}</a></li>
                    <li><a href="#" onClick={scrollToSection(CONTACT)} className={classNames("nav-link", {active: section == CONTACT })}>{CONTACT}</a></li>
                </ul>
            </nav>
            <div className="container">
                <section data-section={ABOUT} ref={(el) => {refCallback(el, ABOUT)}} className="section about">
                    <header className="header__title">About</header>
                    <div className="row vision-row">
                        <div className="col s6 l3 padding-horiz">
                            <div className="vision-card flex flex--col">
                                <PerformanceIcon/>
                                <div className="title">Performance</div>
                                <p className="vision-desc">Fast load times and lag free interaction, my highest priority.</p>
                            </div>
                        </div>
                        <div className="col s6 l3 padding-horiz">
                            <div className="vision-card flex flex--col">
                                <ResponsiveIcon />
                                <div className="title">Responsive</div>
                                <p className="vision-desc">My layouts will work on any device, big or small.</p>
                            </div>
                        </div>
                        <div className="col s6 l3 padding-horiz">
                            <div className="vision-card flex flex--col">
                                <IntuitiveIcon />
                                <div className="title">Intuitive</div>
                                <p className="vision-desc">Strong preference for easy to use, intuitive UX/UI.</p>
                            </div>
                        </div>
                        <div className="col s6 l3 padding-horiz">
                            <div className="vision-card flex flex--col">
                                <DynamicIcon />
                                <div className="title">Dynamic</div>
                                <p className="vision-desc">Websites don't have to be static, I love making pages come to life.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row card">
                        <article className="col s12 l4 offset-l1 flex flex--col padding">
                            <div className="image">
                                <img src="https://s.cdpn.io/profiles/user/2662279/512.jpg?1555384482"/>
                            </div>
                            <br/>
                            <br/>
                            <h2 className="title">Who is this guy?</h2>
                            <p className="center-text">
                                I'm the Front-End Developer for Thuuz Sport in Palo Alto, CA.
                                I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences.
                            </p>
                            <p className="primary center-text">Let's make something special.</p>
                        </article>
                        <article className="col s12 offset-l2 l5 no-padding">
                            <div className="skill-sets padding">
                                <div className="skill-set">
                                    <header className="skill title">Languages</header>
                                    {/* <p className="skills">Javascript, Node, HTML, CSS, SCSS/SASS, Python, C</p> */}
                                    <ul>
                                        <li className="skills">Javascript</li>
                                        <li className="skills">Node</li>
                                        <li className="skills">HTML</li>
                                        <li className="skills">CSS</li>
                                        <li className="skills">SCSS/SASS</li>
                                        <li className="skills">Python</li>
                                        <li className="skills">C</li>
                                    </ul>
                                </div>
                                <div className="skill-set">
                                    <header className="skill title">Frameworks</header>
                                    {/* <p className="skills">React, Apollo, Meteor, Redux/Flux, React Router, Jest, Enzyme</p> */}
                                    <ul>
                                        <li className="skills">React</li>
                                        <li className="skills">Apollo</li>
                                        <li className="skills">Meteor</li>
                                        <li className="skills">Redux/Flux</li>
                                        <li className="skills">React Router</li>
                                        <li className="skills">Jest</li>
                                        <li className="skills">Enzyme</li>
                                    </ul>
                                </div>
                                <div className="skill-set">
                                    <header className="skill title">Databases / APIs</header>
                                    {/* <p className="skills">MongoDB, GraphQl, REST, Firebase</p> */}
                                    <ul> 
                                        <li className="skills">MongoDB</li>
                                        <li className="skills">GraphQl</li>
                                        <li className="skills">REST</li>
                                        <li className="skills">Firebase</li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                    </div>    
                </section>
                <section data-section={PROJECTS} ref={(el) => {refCallback(el, PROJECTS)}} className="section projects">
                    <header className="header__title">Projects</header>
                </section>
                <ContactSection refCallback={refCallback}/>
            </div>
            {/* <div className="container">
            <div className="row" style={{height: "75vh"}}>
                <aside className="col s3 offset-s2 surface-1">Aside 1</aside>
                <section className="col s3  surface-3 primary">Section</section>
                <aside className="col s3 suface-1 secondary">Aside 3</aside>
            </div>
            </div> */}
            <footer className="footer surface-1">Footer</footer>
        </React.Fragment>
    )
}

Profile.defaultProps = {

}

Profile.propTypes = {

}

export default Profile;