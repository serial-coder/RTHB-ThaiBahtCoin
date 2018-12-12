import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const ContractsPage = Loadable({
    loader: () => import('../pages/ContractsPage'),
    loading: () => null
});

const IssueTHBPage = Loadable({
    loader: () => import('../pages/IssueTHBPage'),
    loading: () => null
});

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/contracts" component={ContractsPage} />
                <Route path="/issue" component={IssueTHBPage} />
                <Route component={ContractsPage} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;