import React, { useState } from 'react';
import {Meteor} from "meteor/meteor";
import PropTypes from 'prop-types';
import { CONTACT } from '../../startup/client/constants';
import Modal from './Modal';
import { useRef } from 'react';
import { useCallback } from 'react';

const NAME = "name";
const EMAIL = "email";
const MESSAGE = "message";

const ERROR = [
    "Message delivery failure",
    "A problem has occurred while sending your message. You can retry your message or contact me directly at ach5910@gmail.com."
]
const SUCCESS = [
    "Thank you for your interest",
    "Your message has successfully been delivered. You can expect a response within a couple business days."
]

const initState = {[NAME]: "", [EMAIL]: "", [MESSAGE]: ""}
const ContactSection = ({refCallback}) => {
    const [modal, setModal] = useState(false)
    const [form, setInput] = useState(initState);
    const modalContent = useRef(SUCCESS)

    handleChange = (input) => (e) => {
        e.preventDefault()
        e.persist()
        setInput((prevForm) => ({
            ...prevForm,
            [input]: e.target.value
        }))
    }

    handleModal = useCallback(() => {
        setModal(false);
    })

    submitEmail = (e) => {
        e.preventDefault();
        Meteor.call(
            'sendEmail',
            form.email,
            `Message from ${form.name}`,
            `${form.message}\nemail: ${form.email}`,
            (err, res) => {
                if (err) {
                    console.log('error', err)
                    modalContent.current = ERROR;
                } else {
                    console.log('resp', res)
                    modalContent.current = SUCCESS
                    setInput(initState);
                }
                setModal(true)
            }
        )
    }

    return(
        <section data-section={CONTACT} ref={(el) => {refCallback(el, CONTACT)}} className="section contact">
            <header  className="header__title">Contact</header>
                <div className="row">
                    <div className="col s12 m8 offset-m2 title">
                        <div className="title">
                            Have a question or interested in working together?
                        </div>
                        <div className="contact__description">
                            Send me a message.
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="input">
                            <input 
                                id="name"
                                type="text"
                                className="text__input"
                                onChange={handleChange([NAME])}
                                placeholder="John Doe"
                                value={form[NAME]}
                            />
                            <label htmlFor="name" className="text__label">Name</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="input">
                            <input 
                                id="email"
                                type="text"
                                className="text__input"
                                onChange={handleChange([EMAIL])}
                                placeholder="johnDoe@gmail.com"
                                value={form[EMAIL]}
                            />
                            <label htmlFor="email" className="text__label">Email</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="input">
                            <textarea 
                                id="message"
                                rows="20"
                                type="text"
                                className="text__area" 
                                onChange={handleChange([MESSAGE])}
                                placeholder="I believe you would make a great asset to our team. We should touch base to discuss working together..."
                                value={form[MESSAGE]}
                            />
                            <label htmlFor="message" className="text__label">Message</label>
                        </div>
                    </div>
                </div>
                <div className='row '>
                    <div className='col s12 m6 offset-m3 contact__button-container'>
                        <button onClick={submitEmail} className='btn btn--outlined'>
                            Submit
                        </button>
                    </div>
                </div>
            <Modal open={modal} text={modalContent.current[1]} title={modalContent.current[0]} handleConfirm={handleModal} handleCancel={handleModal} approveOnly />
        </section>
    )
}

ContactSection.defaultProps = {

}

ContactSection.propTypes = {
    refCallback: PropTypes.func.isRequired,
}

export default ContactSection;