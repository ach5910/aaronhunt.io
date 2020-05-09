import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../startup/client/utils';
import { useEffect } from 'react';
import classNames from 'classnames';
import { useCallback } from 'react';


const Modal = ({open, handleClose, children, root=document.body}) => {
    const clickOutside = useCallback(() => {
        if (open) handleClose();
    }, [open, handleClose])
    
    const bind = useOnClickOutside(clickOutside);

    useEffect(() => {
        const updateOverflow = (overflow="") => {
            setTimeout(() => {
                document.body.style.overflow = overflow;
            })
        }
        if (open){
            updateOverflow("hidden");
        } else {
            updateOverflow()
        }
    }, [open])


    return(
        <>
            {ReactDOM.createPortal(
                <div className={classNames("modal-container", { open })}>
                    <div {...bind} className="modal">
                        <div onClick={handleClose} className="modal__x">
                            ✖
                        </div>
                        {children}
                    </div>
                </div>,
                root
            )}
        </>
    )
}

Modal.defaultProps = {

}

Modal.propTypes = {

}

export default Modal;