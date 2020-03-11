import React, {Component} from 'react';
import {ScrollView,StyleSheet, Text, View, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import CurrentCard from './component/CurrentCard';
import Details from './component/Details';
import Daily from './component/Daily'
const API_KEY = '11a5a6884d85163ea381a1c5ae546cfb';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Get location permission',
        message:'Get location permission to fetch weather info.',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Got location permission');
    } else {
      console.log('Denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      isLoading:true,
      latitude: null,
      longitude: null,
      temperature: null,
      description: null,
      weather: null,
      icon: null,
      location:null,
      feels_like:null,
      humidity:null,
      visibility:null,
      pressure:null,
      wind_deg:null,
      wind_speed:null,
      weekday:null,
      forecast:[],
    };
  }

  TemTransfer(fah){
    var fahnum = parseFloat(fah);
    return (fahnum - 273.15).toFixed(0);
  }

  async componentDidMount() {
    await requestCameraPermission();
    if (true) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.fetchWeather(this.state.latitude, this.state.longitude);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});
    }
  }


  WindDirection(degree){
    if (degree>337.5) return 'Northerly';
    if (degree>292.5) return 'North Westerly';
    if(degree>247.5) return 'Westerly';
    if(degree>202.5) return 'South Westerly';
    if(degree>157.5) return 'Southerly';
    if(degree>122.5) return 'South Easterly';
    if(degree>67.5) return 'Easterly';
    if(degree>22.5){return 'North Easterly';}
    return 'Northerly';
}

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`,
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          temperature: this.TemTransfer(json.main.temp),
          description: json.weather[0].description,
          weather: json.weather[0].main,
          icon: json.weather[0].icon,
          location:json.sys.country+' '+json.name,
          feels_like:this.TemTransfer(json.main.feels_like) + '°',
          humidity:json.main.humidity + '%',
          visibility:json.visibility +' m',
          pressure:json.main.pressure + ' Pa',
          wind_deg:this.WindDirection(json.wind.deg),
          wind_speed:json.wind.speed+' m/s',
          weekday:(new Date(json.dt*1000)).getDay(),
        });
        console.log("星期",this.state.weekday);
      });
      fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}`,
      )
        .then(res => res.json())
        .then(json => {
          console.log(json);
          this.setState({
            forecast:json.list,
            isLoading:false,
          });
        });

  }


  render() {
    return (
      this.state.isLoading?
      <View><Text>加载中....</Text></View>:
      <ScrollView style={styles.view}>
        <CurrentCard
          temperature={this.state.temperature + '°'}
          description={this.state.description}
          weather={this.state.weather}
          icon={this.state.icon}
          location={this.state.location}
        />
        <Daily 
        style={styles.daily}
        forecast={this.state.forecast}
        weekday={this.state.weekday}
        />
        <Details 
              style={styles.details}
              feels_like={this.state.feels_like}
              humidity={this.state.humidity}
              visibility={this.state.visibility}
              pressure={this.state.pressure}
              wind_deg={this.state.wind_deg}
              wind_speed={this.state.wind_speed}

        />
        
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  view:{
    backgroundColor:'#7E57C2',
    flexDirection:'column',
    padding:5,
    flex: 1,
  },

});
