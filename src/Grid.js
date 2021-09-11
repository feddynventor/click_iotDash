import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import SpringModal from './Modal';
import { Button } from '@material-ui/core';

import axios from "axios";

const ReactGridLayout = WidthProvider(RGL);
// const originalLayout = getFromLS("click-layout") || [];

class Grid extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {},
    compactType: null
  };

  constructor(props) {
    super(props);

    let layoutID = this.props.layoutID
    console.log("STARTUP",Object.keys(getFromLS(layoutID)).length,getFromLS(layoutID))
    // console.log(layoutID, originalLayout[layoutID])
    this.state = {
      // items: JSON.parse(JSON.stringify(getFromLS(layoutID) || [])),
      layoutID,
      devices: [],
      items: (Object.keys(getFromLS(layoutID)).length===0)?[]:getFromLS(layoutID),
      newCounter: Object.keys(getFromLS(layoutID)).length
    };

    axios.get("http://10.0.0.24:5000/api/dev/"+layoutID+"/list",{crossDomain: true }).then(res => {
      this.setState({devices: res.data})
    })

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  componentDidUpdate() {
    console.log("CHANGE_LAYOUT",this.props.layoutID,this.state.devices, this.state.items)
    this.state.devices.forEach(device => {
      if ( this.state.items.find(o => o.i === device.id) === undefined ){
        console.log("missing",device.id, device.name)
        this.onAddItem(device)
      }
    });
  }

  // ws = new WebSocket('ws://localhost:8765')

  // componentDidMount() {
  //     this.ws.onopen = () => {
  //     // on connecting, do nothing but log it to the console
  //     console.log('connected')
  //     }

  //     this.ws.onmessage = evt => {
  //     // listen to data sent from the websocket server
  //     // const message = JSON.parse(evt.data)
  //     // this.setState({dataFromServer: message})
  //     console.log(evt.data)
  //     }

  //     this.ws.onclose = () => {
  //     console.log('disconnected')
  //     // automatically try to reconnect on connection loss

  //     }

  // }

  resetLayout() {
    this.setState({
      layout: []
    });
  }

  createElement(el) {
    const i = el.add ? "+" : el.i;
    // return (
    //   <div key={i} data-grid={el}>
    //     {el.add ? (
    //       <span
    //         className="add text"
    //         onClick={this.onAddItem}
    //         title="You can add an item by clicking here, too."
    //       >
    //         Add +
    //       </span>
    //     ) : (
    //       <span className="text">{i}</span>
    //     )}
    //     <span
    //       className="remove"
    //       style={removeStyle}
    //       onClick={this.onRemoveItem.bind(this, i)}
    //     >
    //       x
    //     </span>
    //   </div>
    // );
    if (this.state.devices === undefined)
      return

    let deviceBox = this.state.devices.find(o => o.id === el.i)
    if (deviceBox === undefined)
      return

    return(
      <div key={i} data-grid={el} ref="supergrid" style={{
        border:'2px solid #282c34', 
        borderRadius: "10px", 
        display:"flex", flexDirection:"row",
        backgroundColor:"#aff"
      }}>
          <SpringModal device={deviceBox} onDelete={()=>{
            axios.get("http://10.0.0.24:5000/api/dev/"+deviceBox.id+"/delete").then(()=>{
              this.onRemoveItem(i)
            })
          }}></SpringModal>
      </div>
    )
  }

  onAddItem(device) {
    /*eslint no-console: 0*/
    console.log("adding #", this.state.newCounter, device.id);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: device.id,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: 0,
        w: 2,
        h: 2
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1
    });
  }
  
  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout) {
    // console.log(this.state.items,this.state.items.length)
    saveToLS(this.props.layoutID, layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout); // updates status display
  }

  render() {
    return (
      <div>
        {/* <button onClick={this.onAddItem}>Add Item</button>
        <button onClick={this.resetLayout}>Reset Layout</button> */}
        
        <Button variant="contained" color="primary" style={{width:"95%"}}>
          <SpringModal device={{"name":"Tutta la stanza","id":this.props.layoutID}}></SpringModal>
        </Button>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
        >
          {_.map(this.state.items, el => this.createElement(el))}
        </ReactGridLayout>
      </div>
    );
  }
}




function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls;
}

function saveToLS(key, value) {
  console.log("SAVING", key)
  global.localStorage.setItem(
      key, JSON.stringify(value)
  );
}

export { Grid };