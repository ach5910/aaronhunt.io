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
import Chip from './Chip';
import Projects from './Projects';
import { history } from '../../startup/client';
import LinkedInIcon from './LinkedInIcon';
import GithubIcon from './GithubIcon';
import CodePenIcon from './CodePenIcon';
import EmailIcon from './EmailIcon';
import AtomIcon from './AtomIcon';
import { useTransition, a } from 'react-spring';

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
    // console.log('handleIntersect')
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
const scrollEl = document.scrollingElement || document.getElementById("app");


const refs = {
    [HOME]: null,
    [ABOUT]: null,
    [PROJECTS]: null,
    [CONTACT]: null,
}
const Profile = ({history}) => {
    const [section, setSection] = useState(history.actionABOUT);
    const navRef = useRef(null);
    const [loading, setLoading] = useState(history.action != "REPLACE");
    const transition = useTransition(loading, null, {
        from: { opacity: 1, transform: "scale(1)"},
        enter: { opacity: 1, transform: "scale(1)"},
        leave: { opacity: 0, transform: "scale(0.5)"},
    })

    const refCallback = useCallback((el, section) => {
        if (el) {
            if (!refs[section] && observer){
                observer.observe(el);
            }
            refs[section] = el;
        }
    })

    function scrollToSection(section){
        return function scrollToSectionEvent(e){
            if (refs[section]){
                const {top} = refs[section].getBoundingClientRect();
                const {height} = navRef.current.getBoundingClientRect();
                anime({
                    targets: document.getElementById("app"),
                    scrollTop: Math.max(refs[section].offsetTop - height, 0),
                    duration: 500,
                    autoplay: true,
                    easing: 'easeInOutQuad',
                })
                setSection(section);
            }
        }
    }

    useEffect(() => {
        createObserver();
        intersectCb = setSection;
        if (history.action == "REPLACE"){
            scrollToSection(PROJECTS)()
        }
    },[])
    return(
        <React.Fragment>
            {transition.map(({item, props}) => (
                item &&
                <a.div className="splash-content" style={props}>
                    <div className="loading-content">
                        <AtomIcon bind={{onAnimationEnd: () => { setTimeout(() => {
                            setLoading(false)
                        }, 200)}}} style={{height: "20rem", zIndex: 3}} className="animate"/>
                    </div>
                </a.div>
            ))}
            <nav ref={navRef} className="row nav-bar no-margin">
                <ul className="nav-links col s12 m6  offset-m2">
                    <li>
                        <a href="#" onClick={() => history.replace("/")} className={classNames("nav-link", "nav-link--title")}>
                            <AtomIcon style={{height: "5.0rem"}} />
                        </a>
                    </li>
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
                        <article className="col s12 l6  flex flex--col padding">
                            <div className="image">
                                <img src="https://s.cdpn.io/profiles/user/2662279/512.jpg?1555384482"/>
                            </div>
                            <br/>
                            <br/>
                            <h2 className="title">Who is this guy?</h2>
                            <p className="bio__description">
                                I'm the Front-End Developer in San Francisco, CA.
                            </p>
                            <p className="bio__description">
                                I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences.
                            </p>
                            <a href="#" onClick={scrollToSection(CONTACT)}  className="bio__description bio__description--important">Let's make something special.</a>
                            <a className="link margin" href="/AaronHunt_FrontEndEngineer_Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
                        </article>
                        <article className="col s12 offset-l1 l5 no-padding">
                            <div className="skill-sets padding">
                                <div className="skill-set">
                                    <header className="skill title">Languages</header>
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
                                    <ul>
                                        <li className="skills">React</li>
                                        <li className="skills">Apollo</li>
                                        <li className="skills">Meteor</li>
                                        <li className="skills">Redux/Thunk</li>
                                        <li className="skills">React Router</li>
                                        <li className="skills">Jest/Enzyme</li>
                                        <li className="skills">Webpack</li>
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
                    <Projects/>
                    <p className="center-text text-med-emphasis">
                        Check out my&nbsp;
                        <a href="https://codepen.io/ach5910" target="_blank" rel="noopener noreferrer"className="link">
                            CodePen
                        </a>
                        &nbsp;for small projects and CSS fun.</p>
                </section>
                <ContactSection refCallback={refCallback}/>
            </div>
            <footer className="footer surface-1">
                <div className="footer__row">
                    <a href="https://www.linkedin.com/in/aaron-hunt-b44a58140" target="_blank" rel="noopener noreferrer"className="footer__link anchor">
                        <LinkedInIcon/>
                    </a>
                    <a href="https://github.com/ach5910" target="_blank" rel="noopener noreferrer"className="footer__link anchor">
                        <GithubIcon />
                    </a>
                    <a href="https://codepen.io/ach5910" target="_blank" rel="noopener noreferrer"className="footer__link anchor">
                        <CodePenIcon />
                    </a>
                    <a href="mailto:ach5910@gmail.com" target="_blank" rel="noopener noreferrer"className="footer__link anchor">
                        <EmailIcon />
                    </a>
                </div>
                <div className="footer__row">
                    <div className="footer__name">Aaron Hunt</div>
                    <div className="footer__year">©2019</div>
                </div>
            </footer>
        </React.Fragment>
    )
}

Profile.defaultProps = {

}

Profile.propTypes = {

}

export default Profile;