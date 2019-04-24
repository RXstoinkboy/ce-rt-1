// set up the map
const osm = L.map('osm').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicnhzdG9pbmtib3kiLCJhIjoiY2p1dWFubnhqMDdobDRlcG1pejRnYmcxeCJ9.d0RC5G69QxdjhmkO8aJP9Q'
}).addTo(osm);

// markers list
const markersList = []

// add custom marker on the map
const addMarker = coords => {
    const mark = L.marker(
            [coords.lat.toFixed(3), coords.lng.toFixed(3)],
            {
                draggable: 'true',
                riseOnHover: 'true'
            }
        )
        .on('drag', updateData) // add event listener - will be needed to update data in table and popup when marker is dragged
        .addTo(osm);

    // store marker in the array
    markersList.push(mark);
}

// add popups to markers
const updatePopups =() => {
    markersList.forEach(el => {
        const popup = L.popup()
            .setLatLng([el._latlng.lat, el._latlng.lng])
            .setContent(`
                    <strong>ID: ${el._leaflet_id}</strong>
                    <p>lat: ${el._latlng.lat.toFixed(3)}</p>
                    <p>lng: ${el._latlng.lng.toFixed(3)}</p>
                `)
    
        el.bindPopup(popup);
    })
}

let content = document.getElementById('content-2');
const tResults = document.querySelector('tResults');

// update data in table
const drawTable = () => {
    // define row with data for each marker
    let res = '';

    if(markersList.length > 0){
        markersList.forEach((el, idx) => {
            res = res.concat(`
                <tr>
                    <td scope='row'>${idx}</td>
                    <td>${el._leaflet_id}</td>
                    <td>${el._latlng.lng.toFixed(3)}</td>
                    <td>${el._latlng.lat.toFixed(3)}</td>
                </tr>
            `)
        }
    )};
    
    // draw table with data for each marker
    let table = `
        <table class='table'>
            <thead class='tHeader'>
                <tr>
                    <th scope='col text-uppercase text-center'>#</th>
                    <th scope='col text-uppercase text-center'>index</th>
                    <th scope='col text-uppercase text-center'>lng</th>
                    <th scope='col text-uppercase text-center'>lat</th>
                </tr>
            </thead>
            <tbody>
                ${res}
            </tbody>
        </table>`;

    content.innerHTML = table;
}

// updating all the data (both popups and table) on click on the map
const mapClick = e => {
    addMarker(e.latlng);
    updatePopups();
    drawTable();
};

// update popup and table while dragging markers
const updateData = e => {
    updatePopups();
    drawTable();
}

osm.on('click', mapClick);