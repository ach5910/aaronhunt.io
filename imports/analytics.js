import ReactGA from 'react-ga';

const trackerId = "UA-180865586-1";
/**
 * Internal wrapper around ReactGA (Google Analytics) to track and fire
 * pageviews and events within the Portal
 * 
 * @module
 */
const analytics= (function analytics(){
    let initialized = false;

    /**
     * Initialize the the Google Analytics tracker and track the initial page
     * 
     * @param {string} url 
     * @param {{permissionSet: string, id: number}} user 
     * @param {boolean} debug Toggle on to print GA logs to console.info
     */
    function init(url){
        /**
         * @todo After testing analytics uncomment line below to stop tracking Thuuz staff users
         */
        // if (user.permissionSet == "admin") return;
        console.log('init')
        if (process.env.NODE_ENV != "production") return;
        ReactGA.initialize(trackerId);
        initialized = true;
        // page(url);
    }

    /**
     * Tracks the page changes
     * 
     * @param {string} url 
     */
    function page(url){
        console.log("url", url)
        if (!initialized || process.env.NODE_ENV != "production") return;
        ReactGA.pageview(url);
    };

    function openModal(modal){
        openView(modal)
    }

    function closeModal(){
        closeView()
    }

    /**
     * Tracks events by category and action, and allows for optional object to specify
     * label and/or nonInteraction state.
     * 
     * @param {string} category 
     * @param {string} action 
     * @param {{label: string, nonInteraction: boolen}}
     */
    function event(category, action, {label = undefined, nonInteraction = false} = {}){
        if (!initialized || process.env.NODE_ENV != "production") return;
        ReactGA.event({category, action, label, nonInteraction})
    }

    const publicAPI = {
        init,
        page,
        openModal,
        closeModal,
        event,
    }

    return publicAPI;
})();

export default analytics;