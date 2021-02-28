import React, {useState, useRef} from 'react';

import useResponse from "../../hooks/useResponse";

export const StateTransformer = () => {
    const [count, setCounter] = useState(0);
    const [user, setUser] = useState({email: '', password: ''});
    const testRef = useRef(null);
    // const [isSubmit, setIsSubmit] = useState(false);
    const [data, doResponse] = useResponse('/users/login');


    const transformCounter = () => {
        setCounter((prevCount) => prevCount + 1)
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("data ", email, password);
        doResponse({user})
    };
    const handleInput = (e) => {
        setUser((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


    return (
        <div className="StateTransformer">
            <button onClick={transformCounter}>Число {count}</button>
            <br/>
            <br/>
            <form onSubmit={handleSubmit}>
                <input type="email"
                       name="email"
                       value={user.email}
                       ref={testRef}
                       onChange={handleInput}
                />
                <br/><br/>
                <input type="password"
                       name="password"
                       value={user.password}
                       onChange={handleInput}
                />
                <br/><br/>
                {
                    data.isLoading
                        ? <div className='sk-circle-bounce'>
                            <div className='sk-child sk-circle-1'/>
                            <div className='sk-child sk-circle-2'/>
                            <div className='sk-child sk-circle-3'/>
                            <div className='sk-child sk-circle-4'/>
                            <div className='sk-child sk-circle-5'/>
                            <div className='sk-child sk-circle-6'/>
                            <div className='sk-child sk-circle-7'/>
                            <div className='sk-child sk-circle-8'/>
                            <div className='sk-child sk-circle-9'/>
                            <div className='sk-child sk-circle-10'/>
                            <div className='sk-child sk-circle-11'/>
                            <div className='sk-child sk-circle-12'/>
                        </div>
                        : <input type="submit"/>
                }
            </form>

        </div>
    );
};