// GeoJSON data for NY, WY, and CA states
export const statesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "California",
        "state": "CA"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-124.4096, 32.5343],
          [-114.1312, 32.5343],
          [-114.1312, 42.0095],
          [-124.4096, 42.0095],
          [-124.4096, 32.5343]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "New York",
        "state": "NY"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-79.7622, 40.4961],
          [-73.7004, 40.4961],
          [-73.7004, 45.0159],
          [-79.7622, 45.0159],
          [-79.7622, 40.4961]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Wyoming",
        "state": "WY"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-111.0569, 40.9984],
          [-104.0522, 40.9984],
          [-104.0522, 45.0011],
          [-111.0569, 45.0011],
          [-111.0569, 40.9984]
        ]]
      }
    }
  ]
};

// More detailed GeoJSON with proper state boundaries
export const detailedStatesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "California",
        "state": "CA",
        "population": 39538223
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-124.4096, 32.5343],
          [-120.0064, 32.5343],
          [-114.1312, 32.5343],
          [-114.1312, 35.0017],
          [-114.1312, 37.0003],
          [-114.1312, 39.0003],
          [-114.1312, 42.0095],
          [-120.0064, 42.0095],
          [-124.4096, 42.0095],
          [-124.4096, 39.0003],
          [-124.4096, 37.0003],
          [-124.4096, 35.0017],
          [-124.4096, 32.5343]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "New York",
        "state": "NY",
        "population": 19453561
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-79.7622, 40.4961],
          [-74.0007, 40.4961],
          [-73.7004, 40.4961],
          [-73.7004, 42.0003],
          [-73.7004, 44.0003],
          [-73.7004, 45.0159],
          [-79.7622, 45.0159],
          [-79.7622, 44.0003],
          [-79.7622, 42.0003],
          [-79.7622, 40.4961]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Wyoming",
        "state": "WY",
        "population": 576851
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-111.0569, 40.9984],
          [-104.0522, 40.9984],
          [-104.0522, 42.0003],
          [-104.0522, 44.0003],
          [-104.0522, 45.0011],
          [-111.0569, 45.0011],
          [-111.0569, 44.0003],
          [-111.0569, 42.0003],
          [-111.0569, 40.9984]
        ]]
      }
    }
  ]
};
