import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_URL = 'https://api.hgbrasil.com/weather?key=9bbaf76d&city_name=Recife,PE';

const weatherIcons = {
  storm: require('./assets/storm.png'),
  snow: require('./assets/snow.png'),
  hail: require('./assets/hail.png'),
  rain: require('./assets/rain.png'),
  fog: require('./assets/fog.png'),
  clear_day: require('./assets/clear_day.png'),
  clear_night: require('./assets/clear_night.png'),
  cloud: require('./assets/cloud.png'),
  cloudly_day: require('./assets/cloudly_day.png'),
  cloudly_night: require('./assets/cloudly_night.png'),
  none_day: require('./assets/none_day.png'),
  none_night: require('./assets/none_night.png'),
};

const WeatherComponent = ({ weather }) => {
  const weatherIcon = weatherIcons[weather.condition_slug] || weatherIcons.none_day;

  return (
    <View style={{ alignItems: 'center', marginBottom: 30 }}>
      {/* Header */}
      <View style={styles.locationContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="location-sharp" size={15} color="#ffffff" />
          <Text style={styles.city}>{weather.city}</Text>
        </View>
        <Ionicons name="notifications" size={20} color="#ffffff" />
      </View>

      <Image source={weatherIcon} style={styles.weatherIcon} resizeMode="contain" />
      <Text style={styles.temp}>{weather.temp}º</Text>
      <Text style={{ color: '#fff', fontSize: 18 }}>Precipitações</Text>
      <Text style={styles.range}>
        Max: {weather.forecast[0].max}º Min: {weather.forecast[0].min}º
      </Text>

      {/* Info blocos */}
      <View style={{ backgroundColor: '#0d3989', marginTop: 15, flexDirection: 'row', borderRadius: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          <Ionicons name="water" size={25} color="#ffffff" />
          <Text style={{ color: 'white', marginLeft: 5 }}>{weather.rain}%</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          <Ionicons name="thermometer" size={25} color="#ffffff" />
          <Text style={{ color: 'white', marginLeft: 5 }}>{weather.temp} °C</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="cloud-outline" size={25} color="#ffffff" />
          <Text style={{ color: 'white', marginLeft: 5 }}>{weather.wind_speedy}</Text>
        </View>
      </View>

      {/* Sol e Lua */}
      <View style={{ backgroundColor: '#0d3989', marginTop: 20, padding: 10, borderRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Text style={{ color: 'white' }}>Today</Text>
          <Text style={{ color: 'white' }}>{weather.date}</Text>
        </View>
        <Text style={{ color: 'white', marginTop: 10 }}>Pôr do sol: {weather.sunset}</Text>
        <Text style={{ color: 'white', marginTop: 5 }}>Nascer do sol: {weather.sunrise}</Text>
      </View>

      {/* Previsões dos 3 próximos dias */}
      <View style={{ backgroundColor: '#0d3989', marginTop: 20, padding: 10, borderRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
          {/* ✅ Título atualizado */}
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Previsão para os próximos dias</Text>
          <Ionicons name="calendar" size={18} color="#ffffff" />
        </View>

        {/* Dia 1 */}
        <DayForecast forecast={weather.forecast?.[1]} />
        {/* Dia 2 */}
        <DayForecast forecast={weather.forecast?.[2]} />
        {/* Dia 3 */}
        <DayForecast forecast={weather.forecast?.[3]} />
      </View>
    </View>
  );
};

// Componente auxiliar para evitar repetição
const DayForecast = ({ forecast }) => {
  if (!forecast) return null;
  const icon = weatherIcons[forecast.condition] || weatherIcons.none_day;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Image source={icon} style={{ width: 40, height: 40, marginRight: 10 }} />
      <View>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
          {forecast.weekday} - {forecast.date}
        </Text>
        <Text style={{ color: 'white', fontSize: 14 }}>
          Max: {forecast.max}º Min: {forecast.min}º | {forecast.description}
        </Text>
      </View>
    </View>
  );
};

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setWeather(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  return <View style={styles.container}>{weather && <WeatherComponent weather={weather} />}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2d64',
    padding: 20,
    paddingTop: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  city: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  temp: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  range: {
    color: '#ccc',
    marginTop: 5,
  },
  loading: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
