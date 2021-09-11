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
      groups: [],
      selectedGroup: "0"
    }
  }

  componentDidMount() {
    axios.get("http://10.0.0.24:5000/api/group/list",{crossDomain: true }).then(
      res => {
          console.log("GROUPS GATHERED",res.data)
          this.setState({groups: res.data})
      }
    )
  }

  componentDidUpdate(){
    // Alla modifica del gruppo selezionato e poi dello stato
    console.log("DID UPDATE",this.state)
  }

  selectGroup(gid){
    console.log("NEW GROUP",gid)
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

        {
          (this.state.selectedGroup==="0")?
          <Grid layoutID="0"></Grid>:null
        }
        {
          this.state.groups.map(el=>{
            // {console.log("SHOW GROUP", el.id)}
            if (el.id===this.state.selectedGroup)
              return <Grid layoutID={el.id}></Grid>
            else
              return null
          })
        }
        
      </div>
    )
  }
}

export default App;
