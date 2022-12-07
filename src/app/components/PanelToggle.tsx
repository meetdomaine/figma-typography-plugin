import * as React from 'react';
import Icon from './Icon';

interface ChildProps {
    title: string,
    children: React.ReactNode,
    active: boolean,
    toggle?: React.Dispatch<React.SetStateAction<boolean>>,
}

const PanelToggle = (props: ChildProps) => {

    const handleClick = () => {
        props.toggle ? props.toggle(!props.active) : null
    }

    return (
        <div className="panel-toggle">
            <button className="panel-toggle-button" onClick={handleClick}>
                <p className="text--s text--bold">{props.title}</p>
                {props.active ? <Icon icon='minus' /> : <Icon icon='plus' />}
            </button>
            
            {props.active ? (
                <div className="panel-toggle-options">
                    {props.children}
                </div>
            ) : ''}
        </div>
    );
};

export default PanelToggle;
