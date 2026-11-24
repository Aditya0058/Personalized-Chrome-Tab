import './Goal.css'
// import React from 'react';

function Goal(){
    return (

      <>
        <div className="card">
            <div className="card-thumbnail">
                <img src="src/assets/goal-thumbnail.png" alt="" />
            </div >  
            <div className="card-content"> 
                    <div className="percentage">17%</div>
                    <div className="progress-bar">
                        <div className="progress-fill"></div> 
                    </div>
            </div> 
            <div className="edit">
                <button className='edit-btn'>Edit</button> 
            </div> 
        </div>  
        
      </>
    );

}
 

 
export default Goal;