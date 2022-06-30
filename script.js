// Weather object with apiKey property and functions:
// fetchWeatherByCity(): search and show results
// fetchWeatherByLocation(): search and show results
// displayWeather(): populates and displayed the weather
let weather = {
  // The API KEY to access the OpenWeatherMap data
  apiKey: "ADD YOUR API KEY",

  // Function to launch query and get weather data for the typed city.
  fetchWeatherByCity: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      this.apiKey + "&units=metric"
    ).then((response) => {
      // Case no results, display an alert and tell the user.
      if (!response.ok) {
        alert("No weather found, please type another city");
        throw new Error("No weather found.");
      }
      // Otherwhise display the results
      return response.json();
    }).then((data) => {
      stopLoading();
      this.displayWeather(data);
    });
  },

  // Function to launch query and get weather data for the detected location.
  fetchWeatherByLocation: function (lat, lon) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat + "&lon=" + lon +
      "&appid=" +
      this.apiKey + "&units=metric"
    ).then((response) => {
      // Case no results, display an alert and tell the user.
      if (!response.ok) {
        alert("No weather found, please type another city");
        throw new Error("No weather found.");
      }
      // Otherwhise display the results
      return response.json();
    }).then((data) => {
      stopLoading();
      this.displayWeather(data);
    });
  },

  // Populate the weather card with the results from the API
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    // Update HTML element with data
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temperature").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";

    // Change the background image to much the city
    document.body.style.transition = "transform 0.3s ease;";
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  }
};

// Add keyup event listener 
const input = document.querySelector("#input");
input.addEventListener("keyup", keyupEventHandler);

// Handle the click event on search button
function clickEventHandler() {
  const inputValue = document.querySelector("#input").value;
  weather.fetchWeatherByCity(inputValue);
}

// Handle the keydown event on input element (user is typing state)
function keydownEventHandler() {
  showLoading();
}

// Handle the keyup event on input element (user finished typing state)
function keyupEventHandler(event) {
  console.log("Event: ", event);
  const city = document.querySelector("#input").value;

  // if no city typed
  if (city === "") {
    stopLoading();
    hideCard();
  }

  // If the user pressed on enter keyboard (number 13 is the "Enter" key on the keyboard)
  if (event.key === 'Enter' || event.keyCode === 13) {
    // Cancel the default action
    event.preventDefault();
    // Trigger the button element's click event
    document.querySelector("#search").click();
  }
}

// Show the loading aniamtion (loading state)
function showLoading() {
  // display card on loading mode
  const card = document.querySelector('.card');
  card.style.display = "block";
  const loading = document.querySelector('.loading');
  loading.style.display = "block";
  const results = document.querySelector('.weather');
  results.style.display = "none";
}

// Show the weather results  (results state)
function stopLoading() {
  // display card on results results
  const card = document.querySelector('.card');
  card.style.display = "block";
  const loading = document.querySelector('.loading');
  loading.style.display = "none";
  const results = document.querySelector('.weather');
  results.style.display = "block";
}

// Hide the card, no laoding animation no results (initial state)
function hideCard() {
  const card = document.querySelector('.card');
  card.style.display = "none";
}


// Display weather based on the user's location
function getLocationWeather() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  // If `getCurrentPosition` succeded this function will be triggered
  function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    weather.fetchWeatherByLocation(crd.latitude, crd.longitude);
  }

  // If `getCurrentPosition` failed this function will be triggered
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  // Get current position thanks to the Geolocation API
  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Search by geolocalization
if('geolocation' in navigator) {
  /* geolocation is available */
  getLocationWeather();
} else {
  /* geolocation IS NOT available */
  alert("Geolocalization not available on your browser");
}
