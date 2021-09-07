import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring'; // web.cjs is required for IE 11 support
import { Button } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import CircularColor from 'react-circular-color';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    borderRadius: '20px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function SpringModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r,g,b]
    } 
    return null;
  }
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  return (
    <div style={{width:"100%", height:"100%"}} onTouchEnd={() => {handleOpen()}} onMouseUp={() => {handleOpen()}}>
        <h5 onMouseUp={() => {handleOpen()}} onTouchEnd={() => {handleOpen()}}>{props.device.name}</h5>
        {(props.device.power==="on")?"ON":"OFF"}
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div style={{display:"flex", "flexDirection":"row"}}>
              <Button color='secondary'
              onClick={()=>{
                  handleClose()
              }}>CHIUDI</Button>
              <h3 id="spring-modal-title">{props.device.name}</h3>  
            </div>&nbsp;
            
            <Button variant='contained' color='primary'
            onClick={()=>{
              props.device.power="off"
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/0").then(res =>{
                console.log(res)
              })
            }}>SPEGNI</Button>&nbsp;
            <Button variant='contained' color='primary'
            onClick={()=>{
              props.device.power="on"
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/1").then(res =>{
                console.log(res)
              })
            }}>ACCENDI</Button><br></br><br></br>

            Bianco Kelvin
            <Slider onChange={(event, newValue)=>{
              props.device.white = newValue
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/2",{"white":newValue}).then(res =>{
                console.log(res)
              })
            }} />

            Bianco RGB
            <Slider defaultValue={props.device.bright} onChange={(event, newValue)=>{
              let color = [255,255,255]
              for (let index = 0; index < color.length; index++) {
                color[index] = parseInt((color[index]/100)*newValue)
              }
              props.device.rgb = color
              props.device.bright = newValue
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/2",{"rgb":color}).then(res =>{
                console.log(res)
              })
            }} />


            Luminosità
            <Slider defaultValue={props.device.bright} onChange={(event, newValue)=>{
              props.device.bright = newValue
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/2",{"bright":newValue}).then(res =>{
                console.log(res)
              })
            }} />

            <CircularColor size={200} color={(props.device.rgb===undefined)?"#ff0000":rgbToHex(props.device.rgb[0],props.device.rgb[1],props.device.rgb[2])} onChange={(color) => {
              color = hexToRgb(color)
              for (let index = 0; index < color.length; index++) {
                color[index] = parseInt((color[index]/100)*props.device.bright)
              }
              props.device.rgb = color
              axios.post("http://10.0.0.24:5000/api/dev/"+props.device.id+"/2",{"rgb":color}).then(res =>{
                console.log(res)
              })
            }} />
            
            <br></br>

            <div style={{display:"flex", "flexDirection":"row"}}>
              <Button variant='contained' color='secondary'
              onClick={()=>{
                  handleClose()
                  props.onDelete()
              }}>ELIMINA</Button>

              <i><p id="spring-modal-description">ID : {props.device.id}<br></br>IP : {props.device.ip}</p></i>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}