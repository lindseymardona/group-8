let mapData;
let respondents;


function countTestimonies(statesCount){
    // stateNames is an array of state names
    console.log(Object.keys(statesCount))
    let stateNames = Object.keys(statesCount);
    statesData.features.forEach(state => addTestimonyCounts(stateNames, statesCount, state));
}

function addTestimonyCounts(stateNames, statesCount, state)
{
    if (stateNames.includes(state.properties.name)){
        state.properties['testimonyCount'] = statesCount[state.properties.name];
    }
    else{
        state.properties['testimonyCount'] = 0;
    }
}

function filterData(){   
    let filteredData = statesData.features.filter(mapdata => mapdata.properties.testimonyCount > 0);
    return filteredData
}

function filterSurveyData(state2filter){   
    let filteredSurveyData;

    if(state2filter == undefined){
        filteredSurveyData = surveyData.filter(respondents => !(respondents.state));
    }
    else{
        filteredSurveyData = surveyData.filter(respondents => respondents.state == state2filter);
    }
    console.log(filteredSurveyData);
    return filteredSurveyData;
}


// get color depending on respondent count value
function getColor(d) {
    return d > 6  ? '#01aea5' :
        d > 4  ? '#01e3d8' :
        d > 2   ? '#8cdbf2' :
        d > 0   ? '#bcfffb' : '#d7fffd';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.testimonyCount)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


function focusFeature(e) {
    map.fitBounds(e.target.getBounds());
    let clickedName = e.target.feature.properties.name;
    console.log(e.target.feature.properties.name)

    if (sidebarStatus == false){
        sidebarStatus = true;
        populatePanel(clickedName);
        // populatePanel(clickedName)
        sidebar.open('dietakoyaki');
    }
    else{
        sidebarStatus = false;
        sidebar.close();
        populatePanel(undefined);
        // sidebar.open('whatsup')
        // console.log('in undefined')
        map.fitBounds(geojson.getBounds());
    }
}




function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: focusFeature
    });
}


function addLegend(){
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 2, 4, 6];
        var labels = [];
        var from, to;
        // labels.push(`<i style="background:'#49e8df'"></i>) < 1`);
        // labels.push(`<i style="background:'#8cdbf2'"></i>) 1-5`);
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
    
            labels.push(
                '<i style="padding:5px;background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);
}

