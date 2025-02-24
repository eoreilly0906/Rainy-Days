import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  if (!window.fetch) {
    console.error('Fetch API is not supported in this browser');
    return;
  }

  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  // http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

  const response = await fetch('/api/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: cityName }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const weatherData = await response.json();
  console.log('weatherData: ', weatherData);

  // Check if weatherData has the expected structure
  if (weatherData && weatherData.currentWeather) {
    renderCurrentWeather(weatherData.currentWeather);
    if (weatherData.forecast) {
      renderForecast(weatherData.forecast);
    }
  } else {
    throw new Error('Invalid weather data format');
  }
};

const fetchSearchHistory = async () => {
    const history = await fetch('http://localhost:3001/api/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history;
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`http://localhost:3001/api/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  const {
    city,
    temperature,
    description,
    icon,
  } = currentWeather || {};

  heading.textContent = `${city}`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${temperature}°C`;
  windEl.textContent = `Description: ${description}`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl);
  }
};

const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  for (let i = 0; i < forecast.length; i++) {
    renderForecastCard(forecast[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { temperature, description, icon } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl } =
    createForecastCard();

  cardTitle.textContent = new Date().toLocaleDateString();
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  tempEl.textContent = `Temp: ${temperature}°C`;
  windEl.textContent = `Description: ${description}`;
  
  const descEl = document.createElement('p');
  descEl.textContent = description;
  descEl.classList.add('card-text');
  col.querySelector('.card-body')?.appendChild(descEl);

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: any) => {
  const historyList = await searchHistory.json();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = historyList.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(historyList[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();

// Add this function to show errors to users
function showError(message: string) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff5252;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
  `;
  errorDiv.textContent = message;

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    position: absolute;
    right: 5px;
    top: 5px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
  `;
  closeButton.onclick = () => errorDiv.remove();
  errorDiv.appendChild(closeButton);

  document.body.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => errorDiv.remove(), 5000);
}

// Single declaration of checkWeatherAPI
export const checkWeatherAPI = () => {
  const apiUrl = '/api/weather';
  console.log('Fetching from:', apiUrl);

  fetch(apiUrl)
    .then(response => {
      // Log the response headers and type
      console.log('Response headers:', response.headers);
      console.log('Content type:', response.headers.get('content-type'));

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      if (!data) {
        throw new Error('No data received');
      }
      try {
        const { 
          city: {
            name,
            coord: { lat, lon },
            country,
            population,
            sunrise,
            sunset
          }
        } = data;

        // Log the extracted values
        console.log('Extracted values:', { name, lat, lon, country, population, sunrise, sunset });

        // Check if elements exist before updating
        const cityNameEl = document.getElementById('cityName');
        const coordinatesEl = document.getElementById('coordinates');
        const populationEl = document.getElementById('population');
        const sunTimesEl = document.getElementById('sunTimes');

        if (!cityNameEl || !coordinatesEl || !populationEl || !sunTimesEl) {
          throw new Error('Required DOM elements not found');
        }

        cityNameEl.textContent = `${name}, ${country}`;
        coordinatesEl.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        populationEl.textContent = `Population: ${population.toLocaleString()}`;
        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();
        sunTimesEl.textContent = `Sunrise: ${sunriseTime} | Sunset: ${sunsetTime}`;
      } catch (err) {
        throw new Error('Invalid data format');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      showError(`Failed to fetch data: ${error.message}`);
    });
};

// Add polyfill check at initialization
if (!window.fetch) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js';
  document.head.appendChild(script);
}
