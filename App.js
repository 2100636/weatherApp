import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Loading from './Loading';
import Weather from './Weather';

// ``

// const API_KEY = 'e4f9f923bee8da88aed663062b783b78';
const API_KEY = '2002e58b1b63a441b83a6b24a53cf29a';

// export default function App() {
export default class extends React.Component{

  state = {
    isLoading: true,
    coords: null,
    temp: '',
  }


  getWeather = async (latitude, longitude) => {
    const {data:{main:{temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    this.setState({
      isLoading: false, 
      temp: temp, 
      condition: weather[0].main,
    });
  }



  getLocation = async () => {
    try{
      const response = await Location.requestForegroundPermissionsAsync();
      console.log('response:');
      console.log(response);
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.setState({coords: latitude+' '+longitude});
      this.getWeather(latitude, longitude);
    }catch (error){
      Alert.alert('Не могу определеить местоположение', "Очень грустно :(");
    }
  }

  componentDidMount(){
    this.getLocation();
  }

  render() {
    const {isLoading, temp, condition} = this.state;
    return (
      isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition}/>
    );
  }
}
