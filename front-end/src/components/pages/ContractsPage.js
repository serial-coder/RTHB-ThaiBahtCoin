import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { compose , withState, withHandlers } from 'recompose';

const loading = (<div> ...loading </div>);

const ContractsList = Loadable({
    loader: () => import('../contractsList'),
    loading: () => loading
});

const Header = Loadable({
    loader: () => import('../Header'),
    loading: () => loading
});

const ContractsPage = ({ numContracts , threshold , collateralRate , currentRate }) => (
    <div>
        <Header />
        <h1>Contracts</h1>
        <span>{numContracts} ,</span>
        <span>{threshold} ,</span>
        <span>{collateralRate} ,</span>
        <span>{currentRate}</span>
        <ContractsList isActive={true} />
    </div>
);

const addState = withState('state','updateState',props => ({ customerid: props.customerid }));
const addHandlers = withHandlers({
    setCustomerId: ({ updateState , dispatch }) => event => {
        const customerid = event.target.value;
        updateState({
            customerid: customerid,
        });
        dispatch({type: 'SET_CUSTOMER_ID', customerid: customerid });
    },
    onSubmit: ({ dispatch }) => event => {
        dispatch({ type: 'SAVE_STATE_TO_LOCAL_STORAGE'});
    },
    clear:  ({ dispatch }) => event => {
        dispatch({
            type: 'REMOVE_ALL_ITEMS'
        });
    }
});

const mapStateToProps = ({ contract , userAccount , numContracts , threshold , collateralRate , currentRate }) =>  ({ 
    contract: contract,
    userAccount: userAccount,
    numContracts: numContracts,
    threshold: threshold,
    collateralRate: collateralRate,
    currentRate: currentRate
});

export default compose(
    connect(mapStateToProps),
    addState,
    addHandlers
)(ContractsPage);