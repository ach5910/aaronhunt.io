import React from 'react';

class EditIcon extends React.Component{
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
        return (
            <button onClick={this.handleClick} className={`button button--secondary button--round ${this.state.clickState}`}>
                <div className="button--icon">
                    <div className={`button button--icon ${this.state.clickState}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0 0h24v24H0z" />
                            <path fill="white" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </div>
                </div>
                <div>Edit</div>
            </button>
        )
    }
}

export default EditIcon;

