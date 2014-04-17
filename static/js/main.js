$.Weather = {
    labels: [],
    dataTemperature: [],
    dataPressure: [],
    dataHumidity: [],
    timeZoneOffsetHours: 0,

    init: function() {
        this.getTimeOffset();
        this.getSummary();
        this.getSummaryBy12Hours();

        $( window ).resize($.proxy(function() {
            this.renderData(false);
        }, this));
    },

    getTimeOffset: function() {
        var date = new Date()
        this.timeZoneOffsetHours = (date.getTimezoneOffset()*-1)/60;
    },

    getSummary: function() {
        $.get('/api/get_summary', function(response) {
            data = $.parseJSON(response);
            if(data.content != "") {
                content = $.parseJSON(data.content);

                $('#temperature').text(Math.round(content.temperature) + '°C');
                $('#humidity').text(Math.round(content.humidity) + '%');
                $('#pressure').text(content.pressure + ' мм рт. ст.');
            }
        });
    },

    getSummaryBy12Hours: function() {
        $.get('/api/get_summary_by_12hours', $.proxy(function(response) {
            data = $.parseJSON(response);
            if(data.content != "") {
                content = $.parseJSON(data.content);

                if(content.length > 0) {
                    for(var key in content) {
                        sensor = content[key];
                        console.log(sensor.created_at);
                        var hour = parseInt(sensor.created_at.substring(11,13));
                        hour += this.timeZoneOffsetHours;
                        if(hour >= 24) {
                            hour -= 24;
                        }
                        this.labels.push(hour + ":00");
                        this.dataTemperature.push(sensor.temperature);
                        this.dataPressure.push(sensor.pressure);
                        this.dataHumidity.push(sensor.humidity);
                    }
                    this.renderData(true);
                }
            }
        }, this));
    },

    renderData: function(animation) {
        this.renderGraph('weatherTemperaturChart', 'Температура', this.labels, this.dataTemperature, animation);
        this.renderGraph('weatherHumidityChart', 'Влажность', this.labels, this.dataHumidity, animation);
        this.renderGraph('weatherPressureChart', 'Давление', this.labels, this.dataPressure, animation);
    },

    renderGraph: function(id, labelText, labels, content, animation) {
        $areaspline =  {
            fillOpacity: 0.3,
            color: '#D9534F',
            negativeColor: '#428BCA'
        };
        $labelSymbol = '';
        $yAxis = {
            gridLineColor: '#E6E6E6',
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                    return this.value + $labelSymbol
                }
            }
        };

        if(id == 'weatherTemperaturChart') {
            $areaspline =  {
                fillOpacity: 0.5,
                color: '#D9534F',
                negativeColor: '#33CCFF'
            };
            $labelSymbol = '°C';
            $yAxis.tickPixelInterval = 35;
        } else if(id == 'weatherHumidityChart') {
            $areaspline =  {
                fillOpacity: 0.5,
                color: '#428BCA'
            };
            $labelSymbol = '%';
            $yAxis.tickInterval = 20;
            $yAxis.min = 0;
            $yAxis.max = 100;
        } else if(id == 'weatherPressureChart') {
            $areaspline =  {
                fillOpacity: 0.5,
                color: '#5CB85C'
            };
            $steps = this.wholeNumberAxis(content);
            $yAxis.min = $steps.min-5;
            $yAxis.max = $steps.max+5;

        }

        $('#' + id).highcharts({
            chart: {
                type: 'areaspline',
                height: 175
            },
            plotOptions: {
                areaspline: $areaspline,
                series: {
                    animation: animation
                }
            },
            tooltip: {
                crosshairs: {
                    width: 1,
                    color: '#E6E6E6'
                },
                shared: true,
                headerFormat: 'Время: {point.key}<br />',
                pointFormat: '{series.name}: {point.y}' + $labelSymbol
            },
            legend: {
                enabled: false
            },
            title: {
                text: null
            },
            xAxis: {
                min: 0.5,
                max: labels.length - 1.5,
                labels: {
                    y: 20
                },
                tickmarkPlacement: 'on',
                gridLineColor: '#f3f3f3',
                categories: labels
            },
            yAxis: $yAxis,
            credits: {
                enabled: false
            },
            series: [{
                name: labelText,
                data: content
            }]
        });


    },

    wholeNumberAxis: function(data) {
        var maxValue = null;
        var minValue = null;
       for (i = 0; i < data.length; ++i) {
           if(maxValue == null) {
               maxValue = data[i];
           }
           if(minValue == null) {
               minValue = data[i];
           }
           if(data[i] > maxValue) {
               maxValue = data[i];
           }
           if(data[i] < minValue) {
               minValue = data[i];
           }
       }

        return {min: minValue, max: maxValue};
    }
};

$(document).ready(function() {
    $.Weather.init();
});