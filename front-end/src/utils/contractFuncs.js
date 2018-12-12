export const getGlobalStatus = (contract , dispatch , numContracts) => {
    if (contract) {
        contract.methods.getGlobalStatus().call().then(result => {
            if (result !== numContracts) {
                dispatch({
                    type: 'SET_CONTRACT_PROPS',
                    contractProps: {
                        numContracts: result[0],
                        threshold: result[1],
                        collateralRate: result[2],
                        currentRate: result[3]
                    }
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }
};

export const getContractInfo = (contract,dispatch,index) => {
    if (contract && !isNaN(index)) {
        contract.methods.getContractInfo(index).call().then(result => {
            dispatch({
                type: 'SET_CONTRACT',
                index: index,
                contract: {
                    owner: result[0],
                    RBTC: result[1],
                    RTHB: result[2],
                    rate: result[3],
                    invalidContract: result[6]
                }
            })
        }).catch(err => {
            console.log(err);
        });
    }
};

export const publicTakeover = (contract,index,userAccount) => {
    if (contract && !isNaN(index)) {
        contract.methods.publicTakeover(index).send({ from: userAccount });
    }
};

export const claim = (contract,index,userAccount) => {
    if (contract && !isNaN(index)) {
        contract.methods.claim(index).send({ from: userAccount });
    }
};

export const addContract = (contract,rbtc,rthb,userAccount) => {
    if (contract && !isNaN(rbtc) && !isNaN(rthb)) {
        contract.methods.addContract(rbtc,rthb).send({ from: userAccount });
    }
};

export const issue = (contract,userAccount,val) => {
    if (contract && !isNaN(val)) {
        contract.methods.issue().send({ from: userAccount , value: val });
    }
};

export const interval = (func) => setInterval(func , 1000);