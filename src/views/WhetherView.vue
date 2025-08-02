<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        >
        <button @click="searchByCity" class="search-button">
          Search
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="status-message">Loading weather data...</div>
      
      <!-- 错误信息 -->
      <div v-if="errorMessage && !isLoading" class="status-message error">
        {{ errorMessage }}
      </div>
      
      <!-- 天气数据展示 -->
      <div v-if="weatherData && !isLoading && !errorMessage" class="weather-card">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        
        <div class="weather-info">
          <img 
            :src="iconUrl" 
            alt="Weather condition icon" 
            class="weather-icon"
          >
          <div class="temperature-info">
            <p class="temperature">{{ temperature }} °C</p>
            <p class="description">
              {{ weatherData.weather[0].description | capitalize }}
            </p>
          </div>
        </div>
        
        <div class="details-grid">
          <p>Feels like: {{ weatherData.main.feels_like }} °C</p>
          <p>Humidity: {{ weatherData.main.humidity }}%</p>
          <p>Wind: {{ weatherData.wind.speed }} m/s</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

// 替换为你的有效API密钥
const API_KEY = '0ead7435ee38a499cfec242c3261702b';

export default {
  name: 'WeatherApp',
  data() {
    return {
      city: '',
      weatherData: null,
      isLoading: false,
      errorMessage: ''
    };
  },
  filters: {
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  computed: {
    // 计算温度（已在API请求中指定metric单位）
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null;
    },
    // 天气图标URL
    iconUrl() {
      if (!this.weatherData) return '';
      const iconCode = this.weatherData.weather[0].icon;
      return `https://api.openweathermap.org/img/w/${iconCode}.png`;
    }
  },
  mounted() {
    // 初始化时尝试获取当前位置天气
    this.fetchCurrentLocationWeather();
  },
  methods: {
    // 通过当前位置获取天气
    fetchCurrentLocationWeather() {
      if (!navigator.geolocation) {
        this.errorMessage = 'Geolocation is not supported by your browser';
        return;
      }

      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          await this.fetchWeatherData(url);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Could not get your location. Please search manually.';
          console.error('Geolocation error:', error);
        }
      );
    },

    // 通过城市名搜索天气
    async searchByCity() {
      if (!this.city.trim()) {
        this.errorMessage = 'Please enter a city name';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const encodedCity = encodeURIComponent(this.city.trim());
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`;
        await this.fetchWeatherData(url);
      } catch (err) {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch weather data. Please try again.';
        console.error('Search error:', err);
      }
    },

    // 通用API请求方法
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.errorMessage = '';
      } catch (err) {
        console.error('API request error:', err);
        this.weatherData = null;
        
        if (err.response && err.response.status === 404) {
          this.errorMessage = 'City not found. Please check the name.';
        } else if (err.response && err.response.status === 401) {
          this.errorMessage = 'API key error. Please check your key.';
        } else {
          this.errorMessage = 'Failed to load weather data. Please try again later.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

