import React, { Component } from 'react';
//import './Person/Person.css';
import Person from './Person/Person';
//import Animal from './Animal/Animal';

import Notification from './notification/Notification';

class App extends Component {
  state = {
    persons : [
      {name: 'Saransh', age : 23},
      {name: 'Sunil', age: 21},
      {name: 'Bipana', age: 22},
      {name: 'Ramos', age: 33}

    ],
    showPersons: false

  }
 
  switchHandler = (newName) =>
  {
    // console.log('was clicked');
    this.setState(
      {
        persons : [
          {name: newName, age : 23},
          {name: 'Sunila', age: 21},
          {name: 'Bipu', age: 22},
          {name: 'Sergio', age: 33}
    
        ],

      }
    )
  }


  nameChangeHandler = (event) =>
  {
    this.setState(
      {
        persons : [
          {name: 'JEtan', age : 23},
          {name: 'Sunila', age: 21},
          {name: 'Rita', age: 22},
          {name: 'Sergio', age: 33}
    
        ],

        
      }
    )
  }


  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({showPersons: !doesShow});

  }

  render()
   {

    const style = {
        backgroundColor: "Orange",
        font:"inherit",
        border: "1x solid blue",
        padding: "8px",
        cursor: "pointer"
    };

    let persons = null;
    
    if(this.state.showPersons) {
      persons = (
      <div>
        <Person 
          name ={this.state.persons[0].name} 
          age = {this.state.persons[0].age } 
          click = {this.switchHandler.bind(this, "Ronaldo")}/>
        <Person
           name ={this.state.persons[1].name} 
           age = {this.state.persons[1].age } />
        <Person 
           name ={this.state.persons[2].name} 
           age = {this.state.persons[2].age } />
        <Person
           name ={this.state.persons[3].name}
          age= {this.state.persons[3].age} />
      </div>     
     
      );

    }


    return (
      <div className="App">
      <Notification />
        <h1>Hi, I am a natural react player and I have won {Math.floor(Math.random()*30)} champions league titles</h1>
      
      
      <button 
        style = {style} 
        onClick= {this.togglePersonsHandler}> Switch names</button>  
      
      {persons} 
        
      </div>
    );
    
  
}
}
export default App;
