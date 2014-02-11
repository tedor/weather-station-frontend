$(document).ready(function() {
    showTemperatureChart = function(animation) {
        // Temperature block
        var dataTemperature = {
            labels : ["January","February","March","April"],
            datasets : [
                {
                    fillColor : "rgba(217, 83, 79, 0.5)",
                    strokeColor : "rgba(217, 83, 79, 1)",
                    pointColor : "rgba(217, 83, 79, 1)",
                    pointStrokeColor : "#fff",
                    data : [20,22,17,7,0,-2,-4]
                }
            ]
        }
        var optionsTemperature = {scaleLabel: '<%=value%>°C', animation: animation};
        var ctxTemperature = document.getElementById("weatherTemperaturChart").getContext("2d");
        new Chart(ctxTemperature).Line(dataTemperature, optionsTemperature);
    }

    showHumidityChart = function(animation) {
        // Humidity block
        var dataHumidity = {
            labels : ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00"],
            datasets : [
                {
                    fillColor : "rgba(66, 139, 202, 0.5)",
                    strokeColor : "rgba(66, 139, 202, 1)",
                    pointColor : "rgba(66, 139, 202, 1)",
                    pointStrokeColor : "#fff",
                    data : [65,59,90,81,56,55,40]
                }
            ]
        }
        var optionsHumidity = {scaleLabel: '<%=value%>°C', animation: animation};
        var ctxHumidity = document.getElementById("weatherHumidityChart").getContext("2d");
        new Chart(ctxHumidity).Line(dataHumidity, optionsHumidity);
    }

    showPressureChart = function(animation) {
        // Pressure block
        var dataPressure = {
            labels : ["January","February","March","April","May","June","July"],
            datasets : [
                {
                    fillColor : "rgba(92, 184, 92, 0.5)",
                    strokeColor : "rgba(92, 184, 92, 1)",
                    pointColor : "rgba(92, 184, 92, 1)",
                    pointStrokeColor : "#fff",
                    data : [28,48,40,19,96,27,100]
                }
            ]
        }
        var optionsPressure = {scaleLabel: '<%=value%>°C', animation: animation};
        var ctxPressure = document.getElementById("weatherPressureChart").getContext("2d");
        var pressureChart = new Chart(ctxPressure).Line(dataPressure, optionsPressure);
    }

    setChartsWidth = function() {
        $('#weatherTemperaturChart').attr('width', $('#weatherTemperaturChart').closest('div').width());
        $('#weatherHumidityChart').attr('width', $('#weatherHumidityChart').closest('div').width());
        $('#weatherPressureChart').attr('width', $('#weatherPressureChart').closest('div').width());
    }

    initCharts = function(animation) {
        showTemperatureChart(animation);
        showHumidityChart(animation);
        showPressureChart(animation);
    }

    setChartsWidth();
    initCharts(true);

    $( window ).resize(function() {
        setChartsWidth();
        initCharts(false);
    });
});