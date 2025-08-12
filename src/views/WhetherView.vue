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

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.search-input {
  padding: 8px 12px;
  width: 280px;
  border: 2px solid #3498db;
  border-radius: 4px;
  font-size: 16px;
}

.search-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #2980b9;
}

.main-content {
  text-align: center;
}

.status-message {
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  font-size: 18px;
}

.status-message.error {
  background-color: #ffebee;
  color: #e74c3c;
}

.weather-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

.temperature {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.description {
  font-size: 20px;
  color: #555;
  text-transform: capitalize;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.details-grid p {
  background-color: #e9ecef;
  padding: 8px;
  border-radius: 4px;
  margin: 0;
}
</style>
