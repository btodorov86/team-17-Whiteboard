import React from 'react';
import imges from './img1.png'
// import imges from './img2.jpg'


const Home = () => {

    return (
        <div style={{textAlign: 'center'}}>
        {/* <h1>Home Page</h1> */}
        <img src={imges} alt={'sffdf'} style={{width: '100%'}}/>
        </div>
    )

}

export default Home
