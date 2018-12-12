import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const ModalClaim = Loadable({
    loader: () => import('./ModalClaim'),
    loading: () => <div> ...loading </div>
});

const Contract = ({ owner ,RBTC , RTHB , rate , invalidContract , isRed , index , userAccount}) => (
    <div style={{backgroundColor: invalidContract ? 'gray' : (isRed ? 'red':'green'), margin: '10px'}}>
        <p> Owner : {owner} </p>
        <span> RBTC : {RBTC} </span>
        <span> RTHB : {RTHB} </span>
        <span> rate : {rate} </span>
        {!invalidContract && (userAccount === owner || isRed) && 
        <ModalClaim index={index} isPublicClaim={isRed && userAccount !== owner} 
        contract={{
            owner: owner,
            RBTC: RBTC,
            RTHB: RTHB
        }}/>}
    </div>
);

export default compose(connect())(Contract);