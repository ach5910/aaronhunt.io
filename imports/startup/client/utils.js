import moment from 'moment';

export function noop(){}

export function isEmptyValue(value) {
    if (value instanceof Set) {
      return value.size <= 0;
    } else if (Array.isArray(value)) {
      return value.length <= 0;
    } else if (value instanceof Function) {
      return false;
    } else if (typeof value === "string" || value instanceof String) {
      return value.length <= 0;
    } else if (typeof value === "object" && JSON.stringify(value) === JSON.stringify({})) {
      return true;
    }
    return value === null || value === undefined || value === false;
}

export function isFalseyValue(value) {
    return isEmptyValue(value) || value === 0;
}
  
export const safeInject = (dependency, fallback = "", desired = false) => {
    if (isFalseyValue(dependency)) {
      return fallback;
    } else if (desired === false) {
      return dependency;
    } else {
      return desired;
    }
};
  
export const getDuration = (startTime, endTime) => {
    if (!endTime) return "";
    const start = moment(startTime, "x");
    const end = moment(endTime, "x")
    return moment.utc(end.diff(start)).format("HH:mm:ss");
}

export const getORM = (set) => {
    const orm = parseInt(set.weight) * (1 + (parseInt(set.reps) / 30))
    return isNaN(orm) ? 0 : orm.toFixed(2);
}

export const formatText = (text) => {
  const formattedText = text.trim().replace(/ +(?= )/g,'').toLowerCase();
  return formattedText;
}

export const rabinKarp = (pat, txt) => { 
    const M = pat.length; 
    const N = txt.length;
    const q = 31;
    const d = 256;
    let i, j;
    let p = 0; // hash value for pattern 
    let t = 0; // hash value for txt 
    let h = 1; 
  
    // The value of h would be "pow(d, M-1)%q" 
    for (i = 0; i < M-1; i++){
        h = (h*d)%q; 
    }
  
    // Calculate the hash value of pattern and first 
    // window of text 
    for (i = 0; i < M; i++) { 
        p = (d*p + pat.charCodeAt(i))%q; 
        t = (d*t + txt.charCodeAt(i))%q; 
    } 
    
    // Slide the pattern over text one by one 
    for (i = 0; i <= N - M; i++){ 
  
        // Check the hash values of current window of text 
        // and pattern. If the hash values match then only 
        // check for characters on by one 
        if ( p === t ) 
        { 
            /* Check for characters one by one */
            for (j = 0; j < M; j++){ 
                if (txt[i+j] !== pat[j]) 
                    break; 
            } 
  
            // if p == t and pat[0...M-1] = txt[i, i+1, ...i+M-1] 
            if (j == M) {
                return true
            }; 
        } 
  
        // Calculate hash value for next window of text: Remove 
        // leading digit, add trailing digit 
        if ( i < N-M ) { 
            t = (d*(t - txt.charCodeAt(i)*h) + txt.charCodeAt(i+M))%q; 
  
            // We might get negative value of t, converting it 
            // to positive 
            if (t < 0) t = (t + q); 
        } 
    }
    return false;
}

export function getTransitionEvent(el){

  const transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  // eslint-disable-next-line no-restricted-syntax
  for (let t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
  return "transitionend"
}

export const getNumberArray = num => {
  const arr = [];
  for (let i = 1; i <= num; i++) {
    arr.push(i);
  }
  return arr;
};

export function strPadLeft(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

export const rippleClick = rippleColor('rgba(255, 255, 255, 0.3)');
export const rippleClickDark = rippleColor('rgba(0, 0, 0, 0.3)');
/**
 * Creates a ripple animation effect for user clicks and touches
 * 
 * @param {func} cb The onClick function for the element
 */
function rippleColor(bg){
    return function rippleCallback(cb, delay, className = ""){
        return function rippleAnimate(e){
            (e.preventDefault && e.preventDefault());
            e.persist();
            const {target} = e;
            if (className){
              target.classList.toggle(className)
            }
            if (delay && typeof delay == "number" && !Number.isNaN(delay)){
                setTimeout(function rippleTimeout() {cb()}, delay)
            } else {
                cb()
            }
            const ripple = document.createElement("div");
            ripple.classList.add('ripple');
            const removeNode = (e) => {
                if(e.persist) e.persist();
                const {target} = e;
                console.log(target)
                if (className && target.parentElement){
                  target.parentElement.classList.toggle(className)
                }
                target.remove();
            }
            target.appendChild(ripple);
            ripple.addEventListener(getTransitionEvent(target), removeNode)
            const {offsetX, offsetY} = e.nativeEvent;
            ripple.setAttribute("style", `background-color: ${bg}; top: ${offsetY}px; left: ${offsetX}px; transform: scale(10); webkitTransform: scale(10); msTransform: scale(10); opacity: 0;`);
        }
    }
}