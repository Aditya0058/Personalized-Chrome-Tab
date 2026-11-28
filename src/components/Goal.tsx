import { useState } from 'react';
import { useLocalStorageNumber } from './lib/useLocalStorageNumber';
import './Goal.css'
// import React from 'react';

function Goal(){
    // type Goal = {
    //     id: string;
    //     title: string;
    //     icon: string;
    //     current: number;
    //     target: number;
    //     unit: string;
    // }

    const [expanded, setExpanded] = useState(false);

    const [current, setCurrent] = useLocalStorageNumber('goal:current', 125)
    const [target, setTarget]   = useLocalStorageNumber('goal:target',  350);

    const percentage =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    
    return (

      <>
        <div className={`card ${expanded ? 'expanded' : ''}`}>
            <div className="card-visible">
                <div className="card-thumbnail">
                    <img src="src/assets/goal-thumbnail.png" alt="" />
                </div >  
                <div className="card-content"> 
                        <div className="percentage">
                            {percentage}%
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{width : `${percentage}%`}}></div> 
                        </div>
                        <div className="progress-text">
                            {current} / {target} hours
                        </div>
                </div>
            </div>
            <div className={`editor ${expanded ? 'editor-open' : ''}`}>
                <label>
                    Current hours
                    <input
                        type="number"
                        value={current}
                        onChange={(e) => setCurrent(Number(e.target.value))
                        }
                    />
                </label>

                <label>
                    Target hours
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value))
                        }
                    />
                </label>

                <button onClick={() => setExpanded(false)}>
                    Save
                </button>
            </div>

            <div className="edit">
                <button
                    className="edit-btn"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Close' : 'Edit'}
                </button>
            </div>
        </div>
        
        
      </>
    );

}
 

 
export default Goal;