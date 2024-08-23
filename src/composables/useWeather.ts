
interface WeatherData {
    weather: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level: number;
      grnd_level: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    misc: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  }

function convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin - 273.15) * 9/5 + 32;
}
function capitalizeFirstLetters(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function getWeather(city: string): Promise<{ temp: number; min_temp: number, max_temp: number, humidity: number, feels_like: number, icon: string, name: string }> {
    const url = `${import.meta.env.VITE_WEATHER_API_URL}?city=${city}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    const data: WeatherData = await response.json();
    return {
        temp: Math.round(convertKelvinToFahrenheit(data.weather.temp)),
        min_temp: Math.round(convertKelvinToFahrenheit(data.weather.temp_min)),
        max_temp: Math.round(convertKelvinToFahrenheit(data.weather.temp_max)),
        humidity: data.weather.humidity,
        feels_like: Math.round(convertKelvinToFahrenheit(data.weather.feels_like)),
        icon: data.misc[0].icon,
        name: capitalizeFirstLetters(city)
    };
}
