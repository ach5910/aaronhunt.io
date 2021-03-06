import moment from 'moment';

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