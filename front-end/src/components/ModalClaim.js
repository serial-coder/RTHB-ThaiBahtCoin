import React from 'react';
import Modal from 'react-modal';
import { contractT } from '../templates/templates';
import { connect } from 'react-redux';
import { compose , withState, withHandlers } from 'recompose';
import { publicTakeover , claim } from '../utils/contractFuncs';

const ModalClaim = ({ state , open , isPublicClaim , close , claimOrTakeOver , contract }) => (
    <div>
        <button onClick={ open }>{isPublicClaim ? 'public claim':'owner claim'}</button>
        <Modal
            isOpen={ state.open }
            onRequestClose={ close }
            closeTimeoutMS={200}
            className="modal"
        >
            <h3 className="modal__title">Claiming confirmation</h3>
            <p>use {contract.RTHB} RTHB to claim {contract.RBTC} RBTC</p>
            <button className="button" onClick={ claimOrTakeOver }>Confirm</button>
            <button className="button" onClick={ close }>Cancel</button>
        </Modal>
    </div>
);

const addState = withState('state','updateState', props => ({ open: false, item: props.item || contractT() }));

const addHandlers = withHandlers({
    open: ({ updateState , item }) => event => {
        updateState({ open: true , item: item || contractT() });
    },    
    close: ({ updateState, state }) => event => {
        updateState({...state, open: false });
    },
    claimOrTakeOver: ({index , isPublicClaim , contract , userAccount}) => event => {
        if (isPublicClaim) {
            publicTakeover(contract,index,userAccount);
        } else {
            claim(contract,index,userAccount);
        }
    }
});

const mapStateToProps = ({ contract , userAccount }) =>  ({
    contract: contract,
    userAccount: userAccount
});

export default compose(
    connect(mapStateToProps),
    addState,
    addHandlers
)(ModalClaim);