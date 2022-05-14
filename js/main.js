
mapboxgl.accessToken='pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wxMTlrNDh6MThmbzNxbzBoMjhtNjlubCJ9.EMR9N5vvQAEuDHRa38ADvQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID from the div
    style: 'mapbox://styles/geohouse/cl3519a0d000414oi9vytp125/draft', // my custom style url from Mapbox studio
    center: [-93.934, 46.535],
    zoom: 6
});

