async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const city = cityInput.value.trim();

    if (!city) return;

    try {
        const response = await fetch(`/weather/${city}`);
        const data = await response.json();

        if (response.ok) {
            weatherInfo.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${Math.round(data.main.temp)}°C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
        } else {
            weatherInfo.innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = '<p class="error">Failed to fetch weather data</p>';
    }
}
