import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {getIcon} from './icons';


class Detail extends Component{
    render(){
        return (
            <View style={styles.detail}>
                <Image  style={styles.detailImage} source={getIcon(this.props.logo)} />
                <Text style={styles.detailFont}>{this.props.info}</Text>
                <Text style={styles.detailFont2}>{this.props.logo}</Text>
            </View>
        )
    }
}


export default class Details extends Component{
    render(){
        return (
        <View style={styles.details}>
        <Detail info={this.props.feels_like} logo="feels_like"/>
        <Detail info={this.props.humidity} logo="humidity"/>
        <Detail info={this.props.visibility} logo="visibility"/>
        <Detail info={this.props.pressure} logo="pressure"/>
        <Detail info={this.props.wind_deg} logo="wind_deg"/>
        <Detail info={this.props.wind_speed} logo="wind_speed"/>
        </View>
        )}
}

var styles= StyleSheet.create({
    detail:{
        width:90,
        height:120,
        backgroundColor:'#rgba(255, 215, 64,1.2)',
        borderRadius:10,
        margin:10,
        paddingTop:10,
        flexGrow:1,
        alignItems:'center',
    },
    detailFont:{
        fontSize:15,
        color:'#4A148C',
       
    },
    detailFont2:{
        fontSize:12,
        color:'#49148a',
       
    },
    detailImage:{
        width:50,
        height:50,
        marginBottom:10,
    },
    details:{
        flexWrap:'wrap',
        alignContent:'center',
        flexDirection:'row',
        justifyContent:'center',
        margin:10,
        backgroundColor:'#9575CD',
        borderRadius:8,
        paddingLeft:10,
        paddingRight:10,
    }
})