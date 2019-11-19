import React, { useState } from 'react';
import {Meteor} from "meteor/meteor";
import PropTypes from 'prop-types';
import { CONTACT } from '../../startup/client/constants';

const NAME = "name";
const EMAIL = "email";
const MESSAGE = "message";

const ContactSection = ({refCallback}) => {

    const [form, setInput] = useState({[NAME]: "", [EMAIL]: "", [MESSAGE]: ""})

    handleChange = (input) => (e) => {
        e.preventDefault()
        e.persist()
        setInput((prevForm) => ({
            ...prevForm,
            [input]: e.target.value
        }))
    }

    submitEmail = (e) => {
        e.preventDefault();
        Meteor.call(
            'sendEmail',
            form.email,
            `Message from ${form.name}`,
            `${form.message}\nemail: ${form.email}`
        );
    }

    return(
        <section data-section={CONTACT} ref={(el) => {refCallback(el, CONTACT)}} className="section contact">
            <header  className="header__title">Contact</header>
                <div className="row">
                    <div className="col s12 m8 offset-m2 title">
                        <div className="title">
                            Interested in working together or know a good dad joke?
                        </div>
                        <div className="contact__description">
                            Send me a message.
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <input 
                            type="text"
                            className="text__input"
                            onChange={handleChange([NAME])}
                            placeholder="Name"
                            value={form[NAME]}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <input 
                            type="text"
                            className="text__input"
                            onChange={handleChange([EMAIL])}
                            placeholder="Email"
                            value={form[EMAIL]}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <textarea 
                            rows="20"
                            type="text"
                            className="text__area" 
                            onChange={handleChange([MESSAGE])}
                            placeholder="Message"
                            value={form[MESSAGE]}
                        />
                    </div>
                </div>
                <div className='row '>
                    <div className='col s12 m6 offset-m3 contact__button-container'>
                        <button onClick={submitEmail} className='btn btn--outlined'>
                            Submit
                        </button>
                    </div>
                </div>
        </section>
    )
}

ContactSection.defaultProps = {

}

ContactSection.propTypes = {
    refCallback: PropTypes.func.isRequired,
}

export default ContactSection;