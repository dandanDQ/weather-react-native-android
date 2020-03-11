import React,{Component} from 'react';
import {StyleSheet,View,Text,Image} from 'react-native';
import {getIcon} from './icons';

class Day  extends Component{
  constructor(props){
    super(props);
    this.state={
      _min:'',
      _max:'',
    }
  }
  componentDidMount(){
    this.findMaxMin();
  }
    GetWeekDay(day){
        switch(day){   
          case 1:
            return 'MON';
          case 2:
            return 'TUE';
          case 3:
            return 'WED';
          case 4:
            return 'THUR';
          case 5:
            return 'FRI';
          case 6:
            return 'SAT';
          case 7:
            return 'SUN';
          default:
            return 'ERR';
        }
      }
      findMaxMin(){
        var i=parseInt(this.props.start);
        var end=8+i;
        var min=500,max=-500;
        for(;i<end;i++){
            if(this.props.forecast[i].main.temp_min<min)
            {
              min=this.props.forecast[i].main.temp_min
            }
            if(this.props.forecast[i].main.temp_max<min)
            {
              min=this.props.forecast[i].main.temp_max
            }
            if(this.props.forecast[i].main.temp_min>max)
            {
              max=this.props.forecast[i].main.temp_min
            }
            if(this.props.forecast[i].main.temp_max>max)
            {
              max=this.props.forecast[i].main.temp_max
            }
        }
        this.setState({
          _min:min,
          _max:max,
        })
      }
      TemTransfer(fah){
        var fahnum = parseFloat(fah);
        return (fahnum - 273.15).toFixed(0);
      }
    render(){
        return (
            <View style={styles.day}>
                <Text style={styles.dayFont}>{this.GetWeekDay(this.props.weekday)}</Text>
                <Image style={styles.icon} source={getIcon(this.props.icon)}/>
                <Text style={styles.dayFont}>{this.TemTransfer(this.state._max) + '°' }</Text>
               <Text style={styles.dayFont}>{this.TemTransfer(this.state._min) + '°'}</Text>
            </View>
        )
    }
}

export default class Daily extends Component{

    

render(){
    if(this.props.forecast){
        return (
        <View style={styles.days}>
        <View>
        <Day 
        weekday={this.props.weekday}
        start='0'
        icon={this.props.forecast[0].weather[0].icon}
        forecast={this.props.forecast}
        />
        </View>
        <View>
        <Day 
        weekday={this.props.weekday+1}
        start='8'
        icon={this.props.forecast[8].weather[0].icon}
        forecast={this.props.forecast}
        />
        </View>
        <View>
        <Day 
        weekday={this.props.weekday+2}
        start='16'
        icon={this.props.forecast[16].weather[0].icon}
        forecast={this.props.forecast}
        />
        </View>
        <View>
        <Day 
        weekday={this.props.weekday+3}
        start='24'
        icon={this.props.forecast[24].weather[0].icon}
        forecast={this.props.forecast}
        />
        </View>
        <View>
        <Day 
        weekday={this.props.weekday+4}
        start='32'
        icon={this.props.forecast[32].weather[0].icon}
        forecast={this.props.forecast}
        />
        </View>
        </View>
        );
    }else{
        return(
            <View>
                <Text>加载中...</Text>
            </View>
        )
    }
    
}

    
    
}

var styles= StyleSheet.create({
    day:{
        width:60,
        backgroundColor:'rgba(243, 229, 245,0.5)',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:5,
        paddingBottom:5,
        height:100,
        borderRadius:5,
    },
    dayFont:{
        fontSize:14,
        color:'#512DA8',
    },
    icon:{
        width:60,
        height:60,
        flexShrink:1,
    },
    days:{
        backgroundColor:'#9575CD',
        flexWrap:'nowrap',
        justifyContent:'space-around',
        flexDirection:'row',
        padding:10,
        height:120,
        alignItems:'center',
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        borderRadius:10,
    }
})