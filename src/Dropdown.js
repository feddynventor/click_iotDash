import React from 'react'
import axios from 'axios'
import { Select, MenuItem } from '@material-ui/core';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: []
        }
    }

    componentDidMount(){
        axios.get("http://10.0.0.24:5000/api/group/list",{crossDomain: true }).then(
            res => {
                console.log(res.data)
                this.setState({groups: res.data})
            }
          )
    }

    handleGroupChange(item) {
        // let devs = []
        // this.state.groups.forEach(group => {
        //     if (group.id == item.target.value)
        //         devs = group.devs
        // });

        this.props.onSelect(item.target.value)
    }

    render(){
        return <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              defaultValue="0"
              onChange={this.handleGroupChange.bind(this)}
              label="Age"
            >
              <MenuItem value={"0"}>Tutti</MenuItem>
              {this.state.groups.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
            </Select>
        
        // return <MenuItem value={"all"}>Tutti</MenuItem>

    }
}