import React, { Component } from 'react'
import axios from 'axios'

import { Grid } from './Grid'
import { Button } from '@material-ui/core';

import logo from './logo.svg';
import './App.css';
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    axios.get("http://10.0.0.24:5000/api/dev/list",{crossDomain: true }).then(
      res => {
        this.setState({devices: res.data})
      }
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" /><h3>Click IoT Dashboard - Testing</h3>
          <div style={{display:"flex", flexDirection:"row"}}>
            <Button variant='contained' color='primary'
              onClick={()=>{
                axios.get("http://10.0.0.24:5000/api/dev/scan").then(res =>{
                  console.log(res)
                })
              }}>SCANSIONA IP</Button>&nbsp;
              <Button variant='contained' color='primary'
              onClick={()=>{
                axios.get("http://10.0.0.24:5000/api/dev/list",{crossDomain: true }).then(res => {
                  this.setState({devices: res.data})
                })
              }}>LISTA</Button>
          </div>
          <br></br><br></br>
        </header>
        
        <Grid layoutID="layout22" devices={this.state.devices}></Grid>
        
      </div>
    )
  }
}

export default App;
