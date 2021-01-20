

mapboxgl.accessToken = mapToken ;
          const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
          center: campground.geometry.coordinates, // starting position [lng, lat]
          zoom: 12 // starting zoom
        });
        const marker = new mapboxgl.Marker()
        .setLngLat(campground.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h3 class = "forDark">${campground.title}</h3><p class="forDark">${campground.location}</p>`
            )
        )
        .addTo(map);
const nav = new mapboxgl.NavigationControl({visualizePitch:true});
map.addControl(nav, 'top-right');