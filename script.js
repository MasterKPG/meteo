const ville = "Lannion";
const longitude = 0;
const latitude = 0;

let meteo = {
    fetchVille: function (ville) {
        fetch(
            "https://api-adresse.data.gouv.fr/search/?q=" + ville
        )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const longitude = data.features[0].geometry.coordinates[0];
                const latitude = data.features[0].geometry.coordinates[1];
                console.log(longitude, latitude);
            })
            return [longitude, latitude];
    },
    fetchMeteo: function (longitude, latitude) {
        fetch(
            "https://api.open-meteo.com/v1/forecast?latitude="+ latitude +
            "&longitude=" + longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,rain,snowfall,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin"
        )
            .then((response) => response.json())
        return data

    }
};

longitude = meteo.fetchVille(ville)[0];
latitude = meteo.fetchVille(ville)[1];

data = meteo.fetchMeteo(longitude, latitude);
console.log(data);

/*
function getTemp() {
  // This function should return the current temperature
    return 22;
}

function UpdateBackground() {
    // This function should update the background color based on the temperature
    let temp = getTemp();
    const body = document.body;
    const tempDiv = document.getElementById("temp");

    tempDiv.textContent = "Temperature: " + temp + "°C";
    body.className = "";

    if (temp < 0) {
        body.classList.add("freezing");
    } else if (temp < 15) { 
        body.classList.add("cold");
    } else if (temp < 25) {
        body.classList.add("mild");
    } else if (temp < 35) {
        body.classList.add("warm");
    } else {
        body.classList.add("hot");
    }
}

updateBackground();
*/