import React from 'react';
import Contract from './contract';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const ContractsList = ({ contracts , userAccount , minimumRate }) => (
    <div>
        {contracts.map( (contract , i) => <Contract index={i} {...contract} userAccount={userAccount} isRed={contract.rate > minimumRate}/>)}
    </div>
);

const mapStateToProps = ({ contracts , userAccount , threshold , currentRate }) =>  ({
    contracts: contracts,
    userAccount: userAccount,
    minimumRate: (currentRate * threshold) / 100,
});

export default compose( connect(mapStateToProps) )(ContractsList);