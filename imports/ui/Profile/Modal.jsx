import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useOnClickOutside, rippleClick, rippleClickDark } from '../../startup/client/utils';
import { ButtonPrimary, ButtonSecondary } from '../Components/Button';

// import Button from '../Components/Button';


const Modal = ({handleConfirm, handleCancel, title, text, open, approveOnly=false}) => {
    const bind = useOnClickOutside(handleCancel);
    return(
        <React.Fragment>
        {open && ReactDOM.createPortal(
            <div {...bind} className="modal__background">
                <div className="modal">
                    <h3 className="modal__title">{title}</h3>
                    <p className="modal__text">{text}</p>
                    <div className="btn-container btn-container--expand">
                        <div className="btn-container">
                            {!approveOnly && <ButtonSecondary onClick={handleCancel} className="btn--outlined" label="Cancel"/>}
                            <button onClick={rippleClickDark(handleConfirm, 300)} className='btn'>
                                Continue
                            </button>
                            {/* <ButtonPrimary onClick={handleConfirm} className="btn--flat" label="Continue"/> */}
                        </div>
                    </div>
                </div>
            </div>
        , document.body)}
        </React.Fragment>
    )
}

// const Modal = ({open, handleClose, children, root=document.body}) => {
//     const clickOutside = useCallback(() => {
//         if (open) handleClose();
//     }, [open, handleClose])
    
//     const bind = useOnClickOutside(clickOutside);

//     useEffect(() => {
//         const updateOverflow = (overflow="") => {
//             setTimeout(() => {
//                 document.body.style.overflow = overflow;
//             })
//         }
//         if (open){
//             updateOverflow("hidden");
//         } else {
//             updateOverflow()
//         }
//     }, [open])


//     return(
//         <>
//             {ReactDOM.createPortal(
//                 <div className={classNames("modal-container", { open })}>
//                     <div {...bind} className="modal">
//                         <div onClick={handleClose} className="modal__x">
//                             ✖
//                         </div>
//                         {children}
//                     </div>
//                 </div>,
//                 root
//             )}
//         </>
//     )
// }

Modal.defaultProps = {

}

Modal.propTypes = {

}

export default Modal;