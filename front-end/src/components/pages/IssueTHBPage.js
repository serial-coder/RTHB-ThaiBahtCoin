import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose , withState, withHandlers } from 'recompose';
import { issue } from '../../utils/contractFuncs';

const loading = (<div> ...loading </div>);

const Form = Loadable({
    loader: () => import('../FormWithHandlers'),
    loading: () => loading
});

const Header = Loadable({
    loader: () => import('../Header'),
    loading: () => loading
});

const IssueTHBPage = ({ state , setUserProperty , onSubmit }) => (
    <div>
        <Header />
        <Form prefix={"RBTC"} value={state.RBTC} onChange={() => setUserProperty("RBTC")} />
        <p>RTHB : {state.RTHB}</p>
        <button onClick={onSubmit}>Create RTHB</button>
        { state.redirect && <Redirect to='/create'/> }
    </div>
);

const addState = withState('state','updateState',{ RBTC:'' , RTHB: '',  redirect: false });
const addHandlers = withHandlers({
    setUserProperty: ({ updateState , state , collateralRate , currentRate }) => property => {
        const val = event.target.value;
        if (!isNaN(val)) {
            const thb = (val * currentRate * 100) / collateralRate;
            updateState({...state, [property]: val, RTHB: thb});
        }
    },
    onSubmit: ({ contract , userAccount , state }) => event => {
        const { RBTC } = state;
        if (!isNaN(RBTC)) {
            issue(contract,userAccount,parseInt(RBTC));
        }
    }
});

const mapStateToProps = ({ contract , userAccount, collateralRate , currentRate }) =>  ({
    contract: contract,
    userAccount: userAccount,
    collateralRate: collateralRate,
    currentRate: currentRate
});

export default compose(
    connect(mapStateToProps),
    addState,
    addHandlers,
)(IssueTHBPage);