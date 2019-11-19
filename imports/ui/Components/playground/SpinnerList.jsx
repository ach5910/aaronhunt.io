import React from 'react';
import PropTypes from 'prop-types';

const colorMap = {
    dud: "#DBE1B6",
    ok: "#F6DB68",
    good: "#F58543",
    great: "#EE3B30",
}
const goodArr = [
    "ok",
    "good",
    "good",
]

const greatArr = [
    "good",
    "great",
    "great",
]
const clampArr = [
    () => ("dud"),
    () => ("dud"),
    () => ("ok"),
    (r) => (goodArr[r]),
    (r) => (greatArr[r]),
    () => ("great"),
    () => ("great")
]

export function clamp(n){
    const i = Math.floor(n / 20)
    const r = Math.round((n % 20) / 10)
    return clampArr[i](r)
}

function scale(ratio){
    return function percentScale(percentage){
        return  (1.0 - ((1 - ratio) * percentage));
    }
}

function rotateX(ratio){
    return function percentRotate(percentage){
        return ratio * percentage;
    }
}

function opacity(ratio){
    return function percentOpacity(percentage){
        return ((1 - ratio) * (1 - percentage))
    }
}

function translate(baseValue){
    return function percentTranslate(percentage){
        return baseValue * percentage;
    }
}




class HeatBar extends React.Component {
    constructor(props){
        super(props);
        this.bar = React.createRef();
        this.state = {
            style: {}
        }
    }

    componentDidMount(){
        let totalDur = 0;
        this.heatMap = this.props.clips.filter(clip => _.get(clip, "excitement.neutral") > 40).map(clip => {
            totalDur += clip.duration;
            return {
                id: clip.id,
                excitement: _.get(clip, "excitement.neutral"),
                color: colorMap[clamp(_.get(clip, "excitement.neutral"))],
                duration: clip.duration,
                durationAt: totalDur
            }
        })
        let str = "";
        this.heatMap.forEach(exc => {
            str = `${str}${str == "" ? "" : ","} ${exc.color} ${(exc.durationAt / totalDur) * 100}%`
        })
        console.log(str);
        // this.setState({style: {backgroundImage: `linear-gradient(${str})`}})
        console.log(this.bar.current);
        console.log(this.bar.current.style);
        console.log(this.bar.current.style.backgroundImage);
        this.bar.current.style.backgroundImage = `linear-gradient(${str})`;
        console.log(this.bar.current.style.backgroundImage);
    }

    render(){
        return (
            <div style={this.state.style} ref={this.bar} className="heat-bar" />
        )
    }
}

class SpinnerList extends React.Component {
    constructor(props){
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.transformList = this.transformList.bind(this);
        this.scaleItem = scale(0.8);
        this.transItem = translate(-1 * 10 * this.props.fade)
        this.rotItem = rotateX(15);
        this.opacItem = opacity(0.3);
        this.transformStart = this.transform(1)
        this.transformEnd = this.transform(-1);
    }

    initList = (node) => {
        this.childHeight = node.children[this.props.fade].offsetHeight;
        this.e = {target: node, persist: () => {}}
        this.transformList()
    }

    getPercentages = (dir) => {
        const {fade} = this.props;
        const pow = 2;
        return function calculatePercentages({perc, idx}, cond){
            const percs = [];
            for(let i = 0; i < fade; i++){
                percs.push(Math.pow(perc - (i / fade), pow))
            }
            return [
                cond ? [Math.pow(perc + (1/ fade), pow), ...percs] : percs,
                cond ? idx - (1 * dir) : idx
            ]
        }
    }
    
    handleScroll(event){
        event.persist()
        this.e = {...event}
        
        if (!this.ticker){
            this.ticker = true;
            window.requestAnimationFrame(this.transformList);
        }
    }

    getListCondition(dir, idx){
        if (dir == 1){
            return idx > 0
        }
        return idx < this.e.target.children.length - 1;
    }
        
    transform(dir, debug = false){
        const getDirectionPercentages = this.getPercentages(dir)
        return function transformItems(item){
            const [percs, idx] = getDirectionPercentages(item, this.getListCondition(dir, item.idx));
            let printOut = []
            percs.forEach((perc, i) => {
                this.e.target.children[idx + (i * dir)].style.transform = ` scale(${this.scaleItem(perc)}) rotateX(${dir * this.rotItem(perc)}deg)`;
                this.e.target.children[idx + (i * dir)].style.opacity = this.opacItem(perc);
                if (debug){
                    console.log(this.e.target.children[idx + (i * dir)])
                    printOut.push({idx: idx + (i * dir), perc, scale: this.scaleItem(perc), rot: dir * this.rotItem(perc), opac: this.opacItem(perc)})
                }
            })
            if (debug) console.table(printOut)
        }
    }
    
    getStartItem({scrollTop}, fadePos){
        const idx = Math.ceil(scrollTop / this.childHeight);
        const perc =(scrollTop + fadePos - (this.e.target.children[idx].offsetTop) )/ fadePos;
        return {idx, perc};
    }

    getEndItem({scrollTop, offsetHeight},fadePos){
        const idx = Math.floor((scrollTop + offsetHeight)/ this.childHeight) -1;
        const perc =  ((this.e.target.children[idx].offsetTop + this.childHeight) - (scrollTop + offsetHeight - fadePos))/ fadePos
        return {idx, perc}
    }

    transformMiddle(startItem, endItem){
        const {fade} = this.props;
        for(let i = startItem.idx + (fade); i < endItem.idx - (fade - 1); i++){
            this.e.target.children[i].style.transform = `translateZ(0) rotateX(0deg)`;
            this.e.target.children[i].style.opacity= 1.0;
        }
    }

    transformListItems(startItem, endItem){
        this.transformStart(startItem)
        this.transformEnd(endItem);
        this.transformMiddle(startItem, endItem);
    }

    transformList(){
        const startItem = this.getStartItem(this.e.target, this.childHeight * this.props.fade)
        const endItem = this.getEndItem(this.e.target, this.childHeight * this.props.fade);
        this.transformListItems(startItem, endItem);
        this.ticker = false;
    }

    renderListBuffer(){
        const listBuffer = []
        for(let i = 0; i < this.props.fade; i++){
            listBuffer.push(<li className="list-item list-item--filler"></li>)
        }
        return listBuffer;
    }

    render(){
      const {children} = this.props;
    //   console.log(children.length, children)
      return (
        <ul 
          onScroll={this.handleScroll} 
          className="list-comp"
          ref={(node) => {this.initList(node)}}
        >
            {this.renderListBuffer()}
            {children}
            {this.renderListBuffer()}
        </ul>
      )
    }
}

SpinnerList.defaultProps = {

}

SpinnerList.propTypes = {

}

export default SpinnerList