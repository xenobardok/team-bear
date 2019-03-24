import React from 'react';

const animal = (props) =>
{
    return (
    <div>
         <p> I am {props.name}. I am {props.age} years old.</p>
         <p>{props.children} </p>
         <input type="text" onChange= {props.changed} value ={props.name}/>
    </div>
    )
};

export default animal;