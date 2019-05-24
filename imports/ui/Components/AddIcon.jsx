import React from 'react';

class AddIcon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            clickState: ''
        }
    }

    handleClick = (e) => {
        e.persist();
        this.setState({clickState: "clicked"});
        setTimeout(() => {this.setState({clickState: ''}); this.props.clickHandler(e);}, 100);
    }
    
    render(){
        const {label} = this.props;
        return (
            <button onClick={this.handleClick} className={`button button--secondary button--round ${this.state.clickState}`}>
                {/* <div className="button--icon"> */}
                    <div className={`button button--icon ${this.state.clickState}`}>
                        <svg
                            focusable="false"
                            viewBox="2 2 20 20"
                            aria-hidden="true"
                            role="presentation"
                        >
                            {/* <path d="M12 0C5.48 0 0 5.48 0 12s4.48 12 12 12 12-4.48 12-12S17.52 0 12 0zm5 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path> */}
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                    </div>
                {/* </div> */}
                <div>{label}</div>
            </button>
        )
    }
}

export default AddIcon;