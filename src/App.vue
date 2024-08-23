<script setup lang="ts">
  import { getWeather } from './composables/useWeather';
  const isDarkMode = ref(false);
  const c = ref('');
  const city = ref('');
  const temp = ref(0);
  const high = ref(0);
  const low = ref(0);
  const humidity = ref(0);
  const feels_like = ref(0);
  const icon = ref('');
  const error_message = ref(false);
  const error_message_content = ref('');
  function toggleDarkMode() {
    const element: any = document.querySelector('html');
    element.classList.toggle('my-app-dark');
    isDarkMode.value = !isDarkMode.value;
  }
  const iconClass = computed(() => isDarkMode.value ? 'pi pi-sun' : 'pi pi-moon');
  async function weather() {
    const spinner = document.getElementById('pSpinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
    if (!city.value) {
        error_message_content.value = 'City field is required';
        error_message.value = true;
        if (spinner) {
            spinner.style.display = 'none';
        }
        return;
    }
    try {
        error_message.value = false;
        icon.value = '';
        const { temp:temp_data, min_temp, feels_like: fl, humidity: h, max_temp, icon: i, name: n} = await getWeather(city.value);
        c.value =  n;
        temp.value = temp_data;
        low.value = min_temp;
        high.value = max_temp;
        feels_like.value = fl;
        humidity.value = h;
        icon.value = i;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        error_message_content.value = 'City Does Not Exist';
        error_message.value = true;
        icon.value = '';
    } finally {
        city.value = '';  
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
  }
</script>

<template>
  <div class="container flex flex-column justify-content-start align-items-center">
    <div class="w-full px-5 py-3 flex flex-row justify-content-end align-items-center">
      <Button @click="toggleDarkMode()"><i :class="iconClass" style="font-size: 1.5rem"></i></Button>
    </div>
    <div class="flex flex-column justify-content-center align-items-center p-10 mb-5 w-11 h-full">
      <div :class="{'app_content_dark': isDarkMode}" class="w-30rem h-auto app_content_light pb-8">
        <div class="w-full flex justify-content-center"><h1 class="mt-5 mb-3">Weather</h1></div>
          <div class="w-full flex justify-content-center" id="feedback-message"><Message severity="error" class="flex justify-content-center w-8">Message Content</Message></div>
          <div class="w-full flex flex-column justify-content-start align-items-center">
            <p>Enter any city name to get the current weather there.</p>
            <Message severity="error" :class="{'error_message': !error_message}" class="w-10 flex justify-content-center mb-3">{{error_message_content}}</Message>
            <div class="flex justify-content-center align-items-center">
              <FloatLabel class="m-3">
                <InputText id="city" v-model="city" @keydown.enter="weather"/>
                <label for="city">City</label>
              </FloatLabel>
              <Button @click="weather">Search</Button>
            </div>
              <ProgressSpinner id="pSpinner"/>
              <div :class="{ 'weather-data': icon === '' }" class="w-full flex flex-column justify-content-center align-items-center">
                <div class="flex w-full justify-content-center"><h2 class="my-2">{{ c }}</h2></div>
                <img :src="`https://openweathermap.org/img/wn/${icon}@2x.png`" alt="Weather Icon"/>
                <h2 class="m-0 mb-3"><b>{{ temp }}°F</b></h2>
                <div class="w-full flex flex-row justify-content-evenly align-items-center">
                  <div class="flex flex-column justify-content-start align-items-center">
                    <h3 class="my-3"><b>High: </b>{{ high }}°F</h3>
                    <h3 class="my-3"><b>Humidity: </b>{{ humidity }}%</h3>
                  </div>
                  <div class="flex flex-column justify-content-start align-items-center">
                    <h3 class="my-3"><b>Low: </b>{{ low }}°F</h3>
                    <h3 class="my-3"><b>Feels Like: </b>{{ feels_like }}°F</h3>
                  </div>
                </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
  #pSpinner {
    display: none;
  }
  .error_message {
    display: none !important;
  }
  .app_content_light {
    background-color: var(--p-slate-300);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
  .app_content_dark {
    background-color: var(--p-slate-800);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
  .container {
    margin: 0%;
    padding: 0%;
    width: 100%;
    height: 100vh;
    background-color: var(--p-slate-600);
  }
  #feedback-message {
    display: none !important;
  }
  h1{
    font-size: 3.5rem;
    font-weight: 500;
  }
  h2 {
    font-size: 2.5rem;
    font-weight: 400;
  }
  h3 {
    font-size: 1.7rem;
    font-weight: 300;
  }
  h3 b{
    font-weight: 500;
  }
  .weather-data {
    display: none !important;
  }
</style>
