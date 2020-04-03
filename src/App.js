import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Wow} from './Components/Wow'
import {Cmd} from './Components/Cmd'
import Dexie from 'dexie';



function App() {

  var db = new Dexie("FriendDatabase");
  db.version(1).stores({ friends: "++id,name,age" });

  db.transaction('rw', db.friends, async() => {

    // Make sure we have something in DB:
    if ((await db.friends.where('name').equals('Josephine').count()) === 0) {
      let id = await db.friends.add({name: "Josephine", age: 21});
      //alert (`Addded friend with id ${id}`);
    }

    // Query:
    let youngFriends = await db.friends.where("age").below(25).toArray();

    // Show result:
    //alert ("My young friends: " + JSON.stringify(youngFriends));

  }).catch(e => {
    alert(e.stack || e);
  });

  return (
    <div className="App">
      <header className="App-header">
        <Cmd />
        <img src={logo} className="App-logo" alt="logo" />
        <Wow />
      </header>
    </div>
  );
}

export default App;
