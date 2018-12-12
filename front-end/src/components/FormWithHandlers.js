import React from 'react';
import { withHandlers } from 'recompose';

const Form = ({ onSubmit , onChange, prefix, value , type="text"}) => (
    <div>
        {prefix}
        <form onSubmit={onSubmit} >
            <input type={type} value={value} onChange={onChange} />
        </form>
    </div>
);

export default withHandlers({
    onSubmit: props => event => {
        event.preventDefault();
    }
})(Form);