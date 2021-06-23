import React, {useState} from 'react';

import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const db = require('./dbjs/infoManager')


const Task = ({children}) => {
  const [show, toggleShow] = useState(true);
  return (
    <Card>
    {children}
    </Card>

  )
}

class Agenda extends React.Component{



  render(){
    return(
      <div>
    <a> Welcome to BaseCamp </a>
    <Task>Bonk</Task>
    </div>
      )
  }
}

export default Agenda;
