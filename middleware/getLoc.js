const axios = require("axios");

const getLoc = async function (source) {
  if (source.address) {
    const loc = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${source.address}.json?access_token=${process.env.MAPBOX_SECRET}`
    );

    source.location = {
      type: "Point",
      coordinates: loc.data.features[0].center,
      formattedAddress: loc.data.features[0].place_name,
      city: loc.data.features[0].context[1].text,
      postalCode: loc.data.features[0].context[0].text,
      streetName: loc.data.features[0].text,
      streetNumber: loc.data.features[0].address,
      country: loc.data.features[0].context[3].text,
    };

    //do not save user inputed address in db
    source.address = "see location";
  }
};

module.exports = getLoc;
