const apiKey = "7712f82116eb2cc797fe8fb66b017e55";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
        const searchBox = document.querySelector(".search input")
        const searchBtn = document.querySelector(".search button")
        const weatherIcon = document.querySelector(".weather-icon")


        async function checkWeather(city) {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
            if (response.status == 404) {
                document.querySelector(".error").style.display = "block"
                document.querySelector(".weather").style.display = "none"
            } else {
                var data = await response.json();

                document.querySelector(".city").innerHTML = data.name
                document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C"
                document.querySelector(".humidity").innerHTML = data.main.humidity + "%"
                document.querySelector(".wind").innerHTML = data.wind.speed + "km/h"
                updateWeatherIcon(data.weather[0].main)

                document.querySelector(".error").style.display = "none"
                document.querySelector(".weather").style.display = "block"


            }

        }

        // Function to update weather icon based on weather condition
        function updateWeatherIcon(weatherCondition) {
            switch (weatherCondition) {
                case "Clouds":
                    weatherIcon.src = "assets/images/clouds.png";
                    break;
                case "Clear":
                    weatherIcon.src = "assets/images/clear.png";
                    break;
                case "Drizzle":
                    weatherIcon.src = "assets/images/drizzle.png";
                    break;
                case "Mist":
                    weatherIcon.src = "assets/images/mist.png";
                    break;
                case "Rain":
                    weatherIcon.src = "assets/images/rain.png";
                    break;
                case "Snow":
                    weatherIcon.src = "assets/images/snow.png";
                    break;
                default:
                    weatherIcon.src = "assets/images/default.png"; // Add a default icon if necessary
                    break;
            }
        }


        searchBtn.addEventListener("click", () => {

            checkWeather(searchBox.value)
            suggestionBox.style.display = "none"
        })




        const suggestionBox = document.querySelector(".suggestions");
        let currentIndex = -1; // To keep track of the currently selected suggestion

        // Function to display suggestions
        async function getSuggestions(query) {
            const response = await fetch(`https://secure.geonames.org/searchJSON?name_startsWith=${query}&maxRows=5&username=pavithrani`);
            const data = await response.json();
            console.log(data)

            if (data.geonames.length > 0) {
                suggestionBox.innerHTML = ''; // Clear old suggestions
                data.geonames.forEach((city, index) => {
                    const suggestion = document.createElement("p");
                    suggestion.textContent = city.name + ", " + city.countryName;
                    suggestion.dataset.index = index; // Add index to each suggestion
                    suggestion.addEventListener("click", () => {
                        searchBox.value = city.name;
                        suggestionBox.style.display = "none"; // Hide suggestions after selection
                    });
                    suggestionBox.appendChild(suggestion);
                });
                suggestionBox.style.display = "block"; // Show suggestion box
                currentIndex = -1; // Reset the current index
            } else {
                suggestionBox.style.display = "none"; // Hide if no results
            }
        }

        // Event listener for input
        searchBox.addEventListener("input", () => {
            const query = searchBox.value;
            if (query.length > 0) {
                getSuggestions(query);
            } else {
                suggestionBox.style.display = "none"; // Hide if query is too short
            }
        });
        const testInput = document.querySelector(".search input");



        // Function to navigate through suggestions using arrow keys
        function navigateSuggestions(event) {
            const suggestions = Array.from(suggestionBox.children);
            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (currentIndex < suggestions.length - 1) {
                    currentIndex++;
                    updateSuggestionSelection(suggestions);
                }
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSuggestionSelection(suggestions);
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (currentIndex >= 0 && currentIndex < suggestions.length) {
                    searchBox.value = suggestions[currentIndex].textContent.split(",")[0].trim(); // Extract city name
                    suggestionBox.style.display = "none"; // Hide suggestions after selection
                    checkWeather(searchBox.value); // Call weather check function

                }
            }
        }

        // Function to update the selection style of suggestions
        function updateSuggestionSelection(suggestions) {
            suggestions.forEach((suggestion, index) => {
                suggestion.style.backgroundColor = index === currentIndex ? "#ddd" : "white"; // Highlight selected
                suggestion.style.fontWeight = index === currentIndex ? "bold" : "normal"; // Bold selected
            });
        }

        // Search button click event
        searchBtn.addEventListener("click", () => {
            checkWeather(searchBox.value);
        });

        // Enter key press event for search input
        testInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default form submission
                checkWeather(searchBox.value); // Trigger the search
                suggestionBox.style.display = "none";
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                navigateSuggestions(event); // Handle arrow key navigation
            }
        });

