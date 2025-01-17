let meteo = {
    ville: "Lannion",
    fetchMeteo: function (ville) {
        fetch(
            "https://api-adresse.data.gouv.fr/search/?q=" + ville
        )
            .then(response => response.json())
            .then(data => {
                const longitude = data.features[0].geometry.coordinates[0];
                const latitude = data.features[0].geometry.coordinates[1];
                return { longitude, latitude };
            })
            .then(coords => {
                return fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=" + coords.latitude +
                    "&longitude=" + coords.longitude +
                    "&current=weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,rain,snowfall,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin"
                );
            })
            .then(response => response.json())
            .then(data => {
                this.afficherMeteo(data);
                this.afficherGraph(data.hourly);
                this.updateIcon(data.current.weather_code, ".temp-icone .icone");
                this.updateSmallCardIcons(data.daily.weather_code);
                this.updateBackground(data.current.weather_code);
            })
            .catch(error => console.error('Error:', error));
    },
    description: function (data) {
        const { weather_code } = data.current;
        switch (weather_code) {
            case 0:
                return "Ciel dégagé";
            case 1:
                return "Peu nuageux";
            case 2:
                return "Ciel voilé";
            case 3:
                return "Nuageux";
            case 45:
                return "Brouillard";
            case 48:
                return "Brouillard givrant";
            case 51:
                return "Bruine";
            case 53:
                return "Bruine modérée";
            case 55:
                return "Bruine forte";
            case 56:
                return "Bruine glaciale faible";
            case 57:
                return "Bruine glaciale forte";
            case 61:
                return "Pluie faible";
            case 63:
                return "Pluie modérée";
            case 65:
                return "Pluie forte";
            case 66:
                return "Pluie verglaçante faible";
            case 67:
                return "Pluie verglaçante forte";
            case 71:
                return "Neige faible";
            case 73:
                return "Neige modérée";
            case 75:
                return "Neige forte";
            case 77:
                return "Grains de neige";
            case 80:
                return "Averses de pluie faibles";
            case 81:
                return "Averses de pluie modérées";
            case 82:
                return "Averses de pluie fortes";
            case 85:
                return "Averses de neige faibles";
            case 86:
                return "Averses de neige fortes";
            case 95:
                return "Orage";
            case 96:
                return "Orage avec grêle faible";
            case 99:
                return "Orage avec grêle forte";
            default:
                return "Météo inconnue";
        }
    },
    jour: function (isoDate) {
        const date = new Date(isoDate);
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return jours[date.getUTCDay()];
    },
    afficherMeteo: function (data) {
        const { temperature_2m, relative_humidity_2m, apparent_temperature } = data.current;
        const { is_day, rain, snowfall, wind_speed_10m } = data.current;
        const { time, temperature_2m_max, temperature_2m_min } = data.daily;

        document.querySelector(".ville").innerText = "Météo à " + this.ville;
        document.querySelector(".temp").innerText = temperature_2m + "°C";
        document.querySelector(".humidite-txt").innerText = "Humidité : " + relative_humidity_2m + "%";
        document.querySelector(".description").innerText = this.description(data);
        document.querySelector(".vent-txt").innerText = "Vitesse du vent: " + wind_speed_10m + "km/h";

        document.querySelector(".jour1").innerText = this.jour(time[1]);
        document.querySelector(".jour2").innerText = this.jour(time[2]);
        document.querySelector(".jour3").innerText = this.jour(time[3]);
        document.querySelector(".jour4").innerText = this.jour(time[4]);
        document.querySelector(".jour5").innerText = this.jour(time[5]);
        document.querySelector(".jour6").innerText = this.jour(time[6]);

        document.querySelector(".temp-min1").innerText = "Min: " + temperature_2m_min[1] + "°C";
        document.querySelector(".temp-min2").innerText = "Min: " + temperature_2m_min[2] + "°C";
        document.querySelector(".temp-min3").innerText = "Min: " + temperature_2m_min[3] + "°C";
        document.querySelector(".temp-min4").innerText = "Min: " + temperature_2m_min[4] + "°C";
        document.querySelector(".temp-min5").innerText = "Min: " + temperature_2m_min[5] + "°C";
        document.querySelector(".temp-min6").innerText = "Min: " + temperature_2m_min[6] + "°C";
        
        document.querySelector(".temp-max1").innerText = "Max: " + temperature_2m_max[1] + "°C";
        document.querySelector(".temp-max2").innerText = "Max: " + temperature_2m_max[2] + "°C";
        document.querySelector(".temp-max3").innerText = "Max: " + temperature_2m_max[3] + "°C";
        document.querySelector(".temp-max4").innerText = "Max: " + temperature_2m_max[4] + "°C";
        document.querySelector(".temp-max5").innerText = "Max: " + temperature_2m_max[5] + "°C";
        document.querySelector(".temp-max6").innerText = "Max: " + temperature_2m_max[6] + "°C";

    },
    updateIcon: function (weather_code, selector) {
        let icon;
        if (weather_code === 0) {
            icon = "clear.png";
        } else if (weather_code >= 1 && weather_code <= 3) {
            icon = "cloud.png";
        } else if (weather_code >= 51 && weather_code <= 67) {
            icon = "rain.png";
        } else if (weather_code >= 71 && weather_code <= 86) {
            icon = "snow.png";
        } else if (weather_code >= 95 && weather_code <= 99) {
            icon = "thunder.png";
        } else {
            icon = "cloud.png";
        }
        const iconPath = "./Images/icones/" + icon;
        document.querySelector(selector).src = iconPath;
    },
    updateSmallCardIcons: function (weather_codes) {
        for (let i = 1; i <= 6; i++) {
            this.updateIcon(weather_codes[i], `.icone-small${i}`);
        }
    },
    updateBackground: function (weather_code) {
        let background;
        if (weather_code === 0) {
            background = "url('./Images/backgrounds/clear.jpg')";
        } else if (weather_code >= 1 && weather_code <= 3) {
            background = "url('./Images/backgrounds/cloudy.jpg')";
        } else if (weather_code >= 51 && weather_code <= 67) {
            background = "url('./Images/backgrounds/rainy.jpg')";
        } else if (weather_code >= 71 && weather_code <= 86) {
            background = "url('./Images/backgrounds/snowy.jpg')";
        } else if (weather_code >= 95 && weather_code <= 99) {
            background = "url('./Images/backgrounds/thunder.jpg')";
        } else {
            background = "url('./Images/backgrounds/default.jpg')";
        }
        document.body.style.backgroundImage = background;
    },
    afficherGraph: function (hourlyData) {
        const ctx = document.getElementById('temperatureGraph').getContext('2d');
        const temperatureGraph = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hourlyData.time.map(time => new Date(time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })),
                datasets: [{
                    label: 'Température (°C)',
                    data: hourlyData.temperature_2m,
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderWidth: 1,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: 'black' 
                        }
                    },
                    x: {
                        ticks: {
                            color: 'black' 
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'black' 
                        }
                    }
                }
            }
        });
    },
};



meteo.fetchMeteo('Lannion');

document.querySelector('.input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        meteo.ville = e.target.value;
        meteo.fetchMeteo(meteo.ville);
    }
});