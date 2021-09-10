import React, { Component } from 'react'
import axios from 'axios'

import { Grid } from './Grid'
import { Button } from '@material-ui/core';
import { FormControl, InputLabel } from '@material-ui/core';

// import logo from './logo.svg';
import './App.css';
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import Dropdown from './Dropdown';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      devices: [],
      selectedGroup: 0
    }
  }

  componentDidMount() {
    axios.get("http://10.0.0.24:5000/api/dev/0/list",{crossDomain: true }).then(
      res => {
        this.setState({devices: res.data})
      }
    )
  }

  componentDidUpdate(){
    console.log("DID UPDATE",this.state)
  }

  selectGroup(gid){
    console.log("NEW GROUP",gid)

    let devs = []
    axios.get("http://10.0.0.24:5000/api/dev/"+gid+"/list",{crossDomain: true }).then(
      res => {
        this.setState({devices: res.data})
      }
    )
    // this.setState( {selectedGroup: gid, devices: devs} )
    this.setState( {selectedGroup: gid} )
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h3>Click IoT Dashboard - Tuya GW</h3>
          <div style={{display:"flex", flexDirection:"row", width:"75%"}}>
            {/* <Button variant='contained' color='primary'
              onClick={()=>{
                axios.get("http://10.0.0.24:5000/api/dev/scan").then(res =>{
                  console.log(res)
                })
              }}>SCANSIONA IP</Button>&nbsp; */}
            <Button variant='contained' color='primary'
              onClick={()=>{
                axios.get("http://10.0.0.24:5000/api/dev/"+this.state.selectedGroup+"/list",{crossDomain: true }).then(res => {
                  this.setState({devices: res.data})
                })
                this.selectGroup(this.state.selectedGroup)
              }}>Ricarica</Button>&nbsp;
            <FormControl variant="filled" style={{width:"100%", borderRadius:"4px", backgroundColor: '#FFFFFF'}}>
              <InputLabel id="demo-simple-select-outlined-label">Stanza</InputLabel>
              <Dropdown onSelect={this.selectGroup.bind(this)}></Dropdown>
            </FormControl>
          </div>
          <br></br>

          <br></br>
        </header>
        
        <br></br>

        <Grid layoutID={this.state.selectedGroup} devices={this.state.devices}></Grid>
        
      </div>
    )
  }
}

export default App;
