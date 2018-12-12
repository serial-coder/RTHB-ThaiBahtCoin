import { createStore } from 'redux';
import abi from '../utils/abi';
import getWeb3 from '../utils/getWeb3';
import { interval , getGlobalStatus , getContractInfo } from '../utils/contractFuncs';

const reduxState = {
    contractAddress :'0x5b87755b8e2b430877967f480d2a07349472a33d',
    contract : null,
    userAccount: null,
    contractFetchIndex: 0,
    numContracts: 0,
    threshold: 0,
    collateralRate: 0,
    currentRate: 0,
    contracts:[],
    windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
    },
};

const updateInterval = (store) => {
    const { dispatch } = store
    const { contract , numContracts , contracts , contractFetchIndex } = store.getState();
    if (contract && dispatch) {
        getGlobalStatus(contract , dispatch , numContracts);
    }
    if (contracts.length < numContracts) {
        getContractInfo(contract, dispatch , contracts.length);
    } else {
        getContractInfo(contract, dispatch , contractFetchIndex);
        dispatch({ type: 'INCREASE_FETCH_INDEX' })
    }
};

const reducer = (state = reduxState , action) => {
    switch (action.type) {
        case('SET_CONTRACT_PROPS') :
            return {...state, ...action.contractProps}
        case('ADD_CONTRACT') :
            return {...state , contracts: [...state.contracts , action.contract] };
        case('SET_CONTRACT') :
            return {...state , contracts: [...state.contracts.slice(0, action.index),action.contract,...state.contracts.slice(action.index + 1) ]};
        case('SET_ALL_CONTRACTS') :
            return {...state , contracts: [...action.contracts] };
        case('REMOVE_CONTRACT') :
            return {...state , contracts: state.contracts.filter((contract , i) => i !== action.index) };
        case('REMOVE_ALL_CONTRACTS') :
            return {...state , contracts: [] };
        case('INCREASE_FETCH_INDEX') :
            if ( !isNaN(state.contracts.length) && state.contracts.length > 0) {
                return {...state , contractFetchIndex: (state.contractFetchIndex + 1) % state.contracts.length };
            }
            return state;
        case('SET_WINDOW_DIM') :
            return {...state , windowSize: { width: window.innerWidth, height: window.innerHeight }};
        case('SAVE_STATE_TO_LOCAL_STORAGE') :
            const userData = { customerid: state.customerid, contracts: state.contracts };
            localStorage.setItem(state.username, JSON.stringify(userData));
            return state;
        default:
            return state;
    }
};

export default () => {
    const store = createStore(reducer);
    const updateWindowDimensions = () => store.dispatch({type: 'SET_WINDOW_DIM'});

    window.addEventListener('resize', updateWindowDimensions);

    getWeb3.then((result) => {
        const web3 = result.web3;
        web3.eth.getAccounts().then((result) => {
            if(result[0] == undefined) alert('Please Login MetaMask.');
            console.log(result[0]);
            web3.eth.defaultAccount = result[0];
            store.dispatch({
                type: 'SET_CONTRACT_PROPS',
                contractProps: {
                    contract : new web3.eth.Contract(abi, reduxState.contractAddress),
                    userAccount: result[0]
                }
            });
        });
    });

    interval(() => updateInterval(store));

    return store;
};