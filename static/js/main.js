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
        this.setChartsWidth();

        $( window ).resize($.proxy(function() {
            this.setChartsWidth();
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
        this.renderGraph('weatherTemperaturChart', '<%=value%>°C', this.labels, this.dataTemperature, animation);
        this.renderGraph('weatherHumidityChart', '<%=value%>%', this.labels, this.dataHumidity, animation);
        this.renderGraph('weatherPressureChart', '<%=value%>', this.labels, this.dataPressure, animation);
    },

    renderGraph: function(id, labelText, labels, content, animation) {
        var color = 'rgba(66, 139, 202, %alpha%)';
        if(id == 'weatherTemperaturChart') {
            color = 'rgba(217, 83, 79, %alpha%)';
        } else if(id == 'weatherHumidityChart') {
            color = 'rgba(66, 139, 202, %alpha%)';
        } else if(id == 'weatherPressureChart') {
            color = 'rgba(92, 184, 92, %alpha%)';
        }

        var data = {
            labels : labels,
            datasets : [
                {
                    fillColor : color.replace('%alpha%', '0.5'),
                    strokeColor : color.replace('%alpha%', '1'),
                    pointColor : color.replace('%alpha%', '1'),
                    pointStrokeColor : "#fff",
                    data : content
                }
            ]
        }

        var options = {
            scaleLabel: labelText,
            animation: animation
        };
        var axisFix = this.wholeNumberAxisFix(data);
//        $.extend(options, axisFix);
        var ctx = document.getElementById(id).getContext("2d");
        new Chart(ctx).Line(data, options);
    },

    setChartsWidth: function() {
        $('#weatherTemperaturChart').attr('width', $('#weatherTemperaturChart').closest('div').width()).attr('height', 200);
        $('#weatherHumidityChart').attr('width', $('#weatherHumidityChart').closest('div').width()).attr('height', 200);
        $('#weatherPressureChart').attr('width', $('#weatherPressureChart').closest('div').width()).attr('height', 200);
    },

    wholeNumberAxisFix: function(data) {
       var maxValue = false;
       for (datasetIndex = 0; datasetIndex < data.datasets.length; ++datasetIndex) {
           var setMax = Math.max.apply(null, data.datasets[datasetIndex].data);
           if (maxValue === false || setMax > maxValue) maxValue = setMax;
       }

       var steps = new Number(maxValue);
       var stepWidth = new Number(1);
       if (maxValue > 10) {
           stepWidth = Math.floor(maxValue / 10);
           steps = Math.ceil(maxValue / stepWidth);
       }
       return { scaleOverride: true, scaleSteps: steps, scaleStepWidth: stepWidth, scaleStartValue: 0 };
    }
};

$(document).ready(function() {
    $.Weather.init();
});