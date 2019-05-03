import React from 'react';
export default class Picker extends React.Component {
    constructor(props) {
        super(props);
            const value = props.decimal ? parseFloat(props.value).toFixed(1) : parseInt(props.value);
            // const nums = props.decimal ? value.toString().length - 1 : value.toString().length;
        this.state = {
            value: value,
            animation: false,
            className: "",
        }
        this.wrapper = null;
        this.timeoutId = null;
    }
    
    roundNumbers = () => {
        if (this.props.decimal){
            return {
                prev: parseFloat(this.state.value).toFixed(1),
                curr: parseFloat(this.props.value).toFixed(1)
            }
        } 
        return {
            prev: parseInt(this.state.value),
            curr: parseInt(this.props.value)
        }
    }
    componentDidUpdate() {
        const {prev, curr} = this.roundNumbers()
        if (prev !== curr){
            this.setState({
                animating: true,
                previousValue: prev,
                value: curr
            })
            if (this.timeoutId) clearTimeout(this.timeoutId)
            this.timeoutId = setTimeout(() => {
                this.setState({
                    animating: false,
                    className: ""
                })
            },300)
        }
    }
    
    render(){
        const {animating, previousValue, value} = this.state;
        const nums = this.props.decimal ? value.toString().length - 1 : value.toString().length;
        const dec = this.props.decimal ? 0.5 : 0;
        return(
            <div className="picker" style={{width: `${(nums * 11) + dec}px`}}>
                <div ref={(node) => this.wrapper = node} className={`picker--wrapper ${!animating ? "" : parseFloat(previousValue) > parseFloat(value) ? 'dec' : 'inc' }`}>
                    <div className="picker--dec">{value}</div>
                    <div className="picker--value">{animating ? previousValue : value}</div>
                    <div className="picker--inc">{value}</div>
                </div>
            </div>
        )
    }
  }