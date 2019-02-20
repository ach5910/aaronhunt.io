import React from 'react';

const ConfirmationModal = ({onSubmit, onCancel, value, action}) => (
    <div className="boxed-view boxed-view--modal">
        <div className="page-content page-content--modal">
            <div className="boxed-view__box">
                <h2>{`Are you sure you want to ${action} ${value}?`}</h2>
                <div className="button__container">
                    <button onClick={onCancel} className="button button--secondary button--margin">Cancel</button>
                    <button onClick={onSubmit} className="button button--margin">{action}</button>
                </div>
            </div>
        </div>
    </div>
)

export default ConfirmationModal;