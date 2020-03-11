import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {getIcon} from './icons';

export default class CurrentCard extends Component{

  render(){
    return (
      <View style={styles.view}>
        <View style={styles.position}>
          <Image style={styles.positionImage} source={require('../icons/position.png')}/>
          <Text style={styles.positionText}>{this.props.location}</Text>
        </View>
        <View style={styles.TempLogo}> 
        <Image style={styles.image} source={getIcon(this.props.icon)} />
        <Text style={styles.temperature}>{this.props.temperature}</Text>
        </View>
        <Text style={styles.description}>{this.props.description}</Text>

      </View>

    );
  }
}

var styles = StyleSheet.create({
  view:{
    alignItems:'center',
    flexDirection:'column',
    backgroundColor:'#rgba(179, 136, 255,0.5)',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    borderRadius:8,

  },
  position:{
    marginTop:20,
    flexDirection:'row',
  },
  positionImage:{
    marginTop:5,
    width:20,
    height:20,
  },
  positionText:{
    fontSize:20,
    color:'#EDE7F6',
  },
  TempLogo:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    width:120,
    height:120,
    marginLeft:90,
    flexShrink:1,
  },
  temperature:{
    fontSize:65,
    color:'#EDE7F6',
    marginRight:90,
  },
  description:{
    fontSize:20,
    color:'#EDE7F6',
    fontFamily: 'monospace',
    marginBottom:30,
  },
})