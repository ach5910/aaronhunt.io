import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import Signup from '../ui/Signup';
import Dashboard from '../ui/workout/WorkoutDashBoard';
import Translator from '../ui/translator/Translator';
import EmbeddedPlayer from '../ui/workout/EmbeddedPlayer';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';
import PlayerGround from '../ui/Components/playground/Playground';
import Profile from '../ui/Profile/Profile';
import ProjectInfo from '../ui/Profile/ProjectInfo';
import floatySpace from '../startup/client/canvas';
import LandingPage from '../ui/Profile/LandingPage';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];
export const PORTFOLIO_PROJECTS = {
  "Partner Portal" : {
    name: "Partner Portal",
      sections: {
        // description: `A B2B web application that allowed broadcast stream owners to create, manage and publish auto-generated highlights from by the Thuuz Smart Reels platform.
        // Using the dashboard user's are able to create projects, which typically represents a league or season, and then attache events to it by providing a broadcast stream.
        // Once the event begins, the core platform starts breaking down the video into clips and curating highlights as it's being transmitted.
        // These clips and highlights can then be viewed with the event's detail page of the dashboard. Once the highlights are accessible in the event detail page user's can edit in and out points,
        // insert and remove plays, apply pre-roll and post-roll video, add transitions, manually published to social or private destinations and create new custom highlights from available filters.`,
        description: `A B2B web application that allows broadcast stream owners to create, manage and publish highlights generated from the Thuuz Smart Reels platform.`,
        features: {
          "Highlight Rule Creation": "Using available filters, based on the associated league or season, rules can be created that are used to generate highlights in upcoming events. Some available filter options are plays, players, teams, perspective, period and duration",
          "Production Effects": "Pre-roll and post-roll video, transition effects and watermarks can be uploaded and added to specific projects and applied to future highlights.",
          "Publish Destinations": "Destinations can be added to projects for publishing generated content. Some of the supported platforms include Facebook, Twitter, Youtube, S3, Adobe Premiere Pro and private FTP Servers.",
          "Live Highlight Feed": "A realtime feed of clips and plays populate the event's dashboard once the game begins. Highlight can viewed and edited and publishing statuses can be monitored.",
          "Custom Highlights": "Using available filters for the event (teams, players, plays, etc.) custom highlights cab be defined and created, allowing clients to adapt to unique circumstances.",
          "Clip Editing": "Custom editing support allows users to change a clip's in-and-out points with sliders and keyboard shortcuts then save the changes or use them to create a new play.",
          "Highlight Editing": "Highlights are expanded out to show the clips that make it up and supports clip removal, insert and reordering. Edited highlights can then be previewed prior to saving changes.",
        },
        technology: {
          "Client": "ReactJs, React Router, Redux, Thunk, SCSS",
          "Bundler":  "Webpack",
          "Video Playback": "JwPlayer, Bitmovin",
          "Backend Framework": "Django",
          "Frontend Testing":  "Jest, Enzyme, WebDriverIO, Mocha, Chai",
        },
        notes: [
          "Oauth support for social platforms (Twitter, Facebook, Google) and permission management to auto-publish highlights.",
          "Custom video player UI, playback controls and keyboard shortcuts.",
          "Media upload support for production settings.",
          "Combinatoric filters applied to the highlight view. Each filter option's visibility/accessibility was determine by the current content of the stream and other selected filters (ie: selecting a play limits the player options to those who have made the specified play in the current event).",
        ],
        "personal contributions":[
          "Lead frontend efforts to develop solutions based on the requests/requirements specified by the product team.",
          "Coordinated with product and design teams to rollout new design versions.",
          "Collaborated with the design team to achieved the desired UI/UX for new features.",
          "Provided development timelines for potential features and outlined the required tasks.",
          "Established BEM methodology standards and migrated existing styles to SCSS.",
          "Created a custom component library that replaced Material UI to support new deigns and desired functionality.",
          "Created a custom video player UI to support standard playback controls, custom playback options, video editing controls and keyboard shortcuts.",
          "Interviewed Senior Frontend candidates to fill a Lead position within our team.",
          "Improved client-side development experience by optimizing the local development server to support Hot Reloading and live updates in conjunction with the local Django server.",
          "Optimized the build process to reduce the application's bundle size by 5x. Improved application load time by 2x.",
          "Established functional testing standards using WebdriverIO, Mocha and Chai.",
        ],
        "personal accomplishments": [
          "First time developing a production application.",
          "Managed and developed the application as only Frontend Engineer for ~9 months.",
          "First introduction to Agile Scrum methodology."
        ]
    },
    tags: [
      "Redux",
      "Desktop",
      "React Router",
    ],
    images: ["/portal_dimensions.png", "/portal_main.png",  "/portal_export.png"],
    thumbnail: "/portal_project.png",
    height: 300,
    disabled: false,
  },
  "Embedded Player" : {
    name: "Embedded Player",
      sections: {
        description: "A browser based embeddable video player that allows users to create and watch custom highlights.",
        features: {
          "Embeddable": "Clients can easily embed the player into their own web page using an iframe",
          "Catch-up to Live": "Creates a custom highlight including all the important plays that occurred up to a specified time in a game.",
          "Live Mode": "Ability to view the live stream of the loaded event",
          "Custom Highlights":"Users can request custom highlights based on teams, players, plays, perspective, themes and video duration",
          "Configuration": "Customization support for setting the color scheme, insert a brand logo, manage menu option visibility, override forced orientation and set up a default highlight on first load.",
          "Multi Event": "Custom highlights can be created over multiple events for a selected sport.",
          "Default highlight":"The embedded player creates and loads a custom 2 minute, neutral perspective, highlight when player is initially accessed.",
          "Game Selection": "The player can be set up for a specific event or linked to a project to access to all it's events.",
        },
        technology: {
          "Client": "ReactJs, Redux, Thunk, SCSS",
          "Bundler": "Webpack",
          "Video Playback": "JwPlayer, Bitmovin",
          "Backend Framework": "Django",
          "Frontend Testing":  "Jest, Enzyme, WebDriverIO, Mocha, Chai",
        },
        notes: [
          "Responsive design, supports all screen sizes.",
          "Orientation is forced to landscape on mobile devices in an attempt to use all the available viewport space while avoiding rendering unusable menus in portrait mode.",
          "Mobile support for touch events, screen orientation and video playback",
          "Auto sizes for 16:9 aspect ratio. If embedded into another page the player will consume the largest available space while maintaining a 16:9 aspect ratio. Additional space is rendered black.",
        ],
        "personal contributions":[
          "Initialized/created the new project.", 
          "Determined the frontend technology stack based on the project's requirements.",
          "Migrated existing functionality internal projects using Angular I to React.",
          "Leveraged PubSub design pattern to create/maintain the app's state machine.",
          "Developed Beta version in 2 under weeks to meet client requirements.",
          "Implemented layout support to force landscape orientation on mobile devices.",
          "Lead frontend efforts to develop solutions based on the requests/requirements specified by the product team.",
          "Collaborated with the design team to achieved the desired UI/UX for new features.",
          "Provided development timelines for potential features and outlined the required tasks.",
          "Created a custom video player UI to support standard playback controls and custom playback options.",
          "Established BEM methodology standards.",
          "Established functional testing standards using WebdriverIO, Mocha and Chai.",
        ],
        "personal accomplishments": [
          "First project to use React Hooks and functional components over React's class components.",
          "First time leading the development of a new project.",
          "Managed and developed the application as the only Frontend Engineer for ~1 year.",
          "First mobile supported production application.",
          "Created a client facing document for integrating the player into another website.",
          "Created a custom state machine to bypass Redux boilerplate and create a lighter application.",
        ]
      },
      tags: [
        "Mobile",
        "Desktop"
      ],
      images: ["/embedded_devices.png", "/embedded_multi.png","/embedded_menu.png", "/embedded_filter.png", "/embedded_live.png", "/embedded_portrait.png"],
      url: "https://www.thuuz.com/partners/video_player/al-arabiya/documentation/",
      thumbnail: "/embedded_project2.png",
      height: 300,
      disabled: false,
  },
  "Trash" : {
    name: "Trash",
      sections: {
        description: "Progressive web app for a turn based game promoting collusion and manipulation. A personal project that I've been developing since November 2019 that is intended for mobile use only.",
        features: {
          "Downloadable": "From the browser, users can download the app to their phone's home screen, similar to mobile apps added from the App Store or the Google Play Store",
          "Offline Support": "Local Storage is leveraged to support game play while the device is offline or has a poor network connection.",
          "Optimized Performance": "A cache first fetch policy is implemented to return cached response data while waiting for the response.",
          "SMS updates": "Game updates and notifications and sent via text messages to players. This is work around since iOS doesn't support the Push API.",
          "Live Messaging": "Realtime in app messaging for players in both private and public channels.",
          "Live Updates": "Game updates are pushed to the device via a GraphQl subscription and a websocket.",
          "Game Store": "Players have the ability to purchase power ups and additional items using the in-games currency.",
          "Data Visualization": "Round outcomes and player state data is used to populate charts and graphs so that players can make more informed decisions.",
        },
        technology: {
          "Client": "ReactJs, GraphQl, Apollo Client, Meteor, React Spring, React Gesture, SCSS",
          "Messaging": "Redis PubSub, Apollo Link WS, SockJs, GraphQl",
          "Backend": "Node, GraphQl, MongoDB, Apollo Server, Meteor, Express, NGinx",
          "Deployment": "PM2 Meteor, Meteor Bundler",
          "SMS Messaging": "Twilio",
        },
        notes: [
          "Supports 7 mini-games that can be selected based on round results.",
          "Training mode allows users to practice mini games to hone their skills.",
          "In game currency support and time based investment strategy for burying your money and digging it up later.",
          "Custom application router was created to avoid using the History API in a downloaded app.",
          "Ability to send SMS Messages to other players using text tokens in the in-app messaging.",
          "Page Visibility API used to trigger fetches when the app is reopened.",
          "Game updates are narrated and posted to the main public channel.",
          "Splash screen used when accessing the app to inform the player on most recent action and it's result."
        ],
        "personal contributions":[
          "Sole contributor/maintainer.",
        ],
        "personal accomplishments": [
          "Used daily by active players.",
          "First Progressive Web App.",
          "First time creating a production level game.",
          "Pushing real-time data to clients using websockets.",
          "Real-time in-app Messaging.",
          "Passing the PWA Lighthouse audit in Google's developer tools.",
          "First dark theme application designed."
        ],
        "explored technology / support": [
          "Progressive Web App.",
          "Service Worker - Implement a cache first fetching policy for offline support using the application cached.",
          "Apollo Cache Persist - Implement a cache first fetching policy for offline support using local storage.",
          "PageVisibility API - Refetch apis when the application accessed after already being open.",
          "Offline API - Limit the users ability to make certain mutations (create or save data).",
          "Local Storage - Persisting application and component state.",
          "Downloadable - Ability to download the app to a mobile phone's home screen.",
          "Real-time messaging using web sockets, GraphQl Subscriptions and Redis PubSub.",
          "Twilio - Provides game notifications via SMS Messaging.",
          "Nginx - Custom configuration to support forced HTTPS/SSL and websockets.",
          "React Spring - Physics based animations for React Components.",
          "React Gesture - React Hook to binding mouse and touch events to provide a richer user experience.",
        ]
      },
      tags: [
        "GraphQl",
        "Node",
        "MongoDB",
        "Mobile",
        "Meteor",
      ],
      images: ["/trash_layers.png", "/trash_menu.png", "/trash_offline.png", "/trash_stats.png",],
      thumbnail: "/trash_project.png",
      height: 300,
      disabled: false,
  },
  "Workout Tracker" : {
    name: "Workout Tracker",
      sections: {
        description: "A mobile responsive web app for recording workouts and exercises.",
        features: {
          "Exercise Creation": "Users create custom exercises and apply tags to allow categorization for statistical data.",
          "Routine Creation": "Users create routines add exercises to them. When a new workout is tracked or logged, it requires a routine to be identified so that workout can be rendered from the available exercises. ",
          "Tracking": "Tracking involves recording a live workout. This has the advantage of capturing time related data.",
          "Logging": "Logging involves creating a workout that is already complete or a planed a workout to complete later.",
          "Prepopulated Exercises": "When an exercise is started the form is populated with data entered from the previous submission. Pre-populated data can be based globally on the exercise or specific to that routine.",
          "Completed View": "Finished workouts can be rendered as calender view or a list view, and allow users to access finished workout and make edits.",
          "Data Visualization": "Progression statistics are graphed by exercise and result format, total weight or one rep max, so users can easily monitor their progress.",
        },
        technology: {
          "Client": "ReactJs, GraphQl, Apollo Client, SCSS",
          "Backend": "Node, Express, GraphQl, Apollo Server, Meteor, MongoDB, Nginx",
          "Deployment": "MeteorUp",
        },
        notes: [
          "Mobile support with a mobile first design",
          "Exercise log support calendar and list view.",
          "Handles login and new user signup/creation.",
        ],
        "personal contributions":[
          "Sole contributor/maintainer.",
        ],
        "personal accomplishments": [
          "First website built end to end.",
          "Mobile first design",
          "First publicly accessible application on a personal domain.",
          "First custom application that solved a need in my personal life.",
          "Creating and managing application models and schema.",
          "Leveraging GraphQl for api requests.",
          "Setting up a web application server.",
        ],
        "explored technology": [
          "Meteor - Fullstack development framework.",
          "MeteorUp - Application deployment.",
          "MongoDB",
          "GraphQl",
          "Apollo Client",
          "Apollo Server",
          "Nginx",
        ]
      },
      tags: [
        "GraphQl",
        "Node",
        "MongoDB",
        "Mobile",
        "Meteor",
        "Desktop",
        "React Router"
      ],
      images: ["/workout_devices.png", "/workout_add.png", "/workout_update.png", "/workout_create_exercise.png", "/workout_create_routine.png"],
      thumbnail: "/workout_project.png",
      height: 300,
      disabled: false,
  },
}
// "training areana for mini-games, game store for power-ups, stats page for data visualization.",

export default class Routes extends React.Component{
  constructor(props){
    super(props);
  }

  onEnterPublicPage = (RouteComponent) => {
    console.log('public page')
    if (Meteor.userId()) {
      console.log('public page logged in')
      return (<Redirect to="/dashboard" />)
    }
    console.log('public page logged not in')
    return <RouteComponent history={this.props.history} />
  };
  
  onEnterPrivatePage = (RouteComponent)  => {
    console.log('private page')
    if (!Meteor.userId()) {
      console.log('private page no logged in')
      return (<Redirect to="/" />)
    }
    console.log('private page logged in')
    return <RouteComponent history={this.props.history} />
  };


  render(){
    return (
      <Router history={this.props.history}>
        <Switch >
          {/* <Route path="/" exact render={() => this.onEnterPublicPage(Login)}/> */}
          {/* <Route path="/signup" exact render={() => this.onEnterPublicPage(Signup)}/> */}
          {/* <Route path="/dashboard" exact render={() => this.onEnterPrivatePage(Dashboard)}/> */}
          {/* <Route path="/yeliz" exact render={() => <Translator history={this.props.history}/>}/> */}
          <Route path="/profile/project/:projectName"  render={(props) => {
              return <ProjectInfo history={this.props.history} {...PORTFOLIO_PROJECTS[props.match.params.projectName]} />
            } 
          }/>
          <Route path="/profile" exact render={() => {
              return <Profile history={this.props.history}/>
            }
          } />
          <Route path="/" exact render={() => {
              return <LandingPage history={this.props.history}/>
            }
          } />
          <Redirect to="/"/>
        </Switch>
      </Router>
    )
  }
}

