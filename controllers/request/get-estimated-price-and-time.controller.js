const verifyUser = require("../../middleware/verifyUser.module");

async function getEstimatedPriceAndTime(req, res) {
  try {
    const { user } = req;

    if (!user) {
      return res.status(400).json({ message: "😒 Invalid request!!" });
    }

    const { startLat, startLng, endLat, endLng } = req.params;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ message: "😒 Invalid request!!" });
    }

    // Login to Uber API
    const loginResponse = await fetch("https://login.uber.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${process.env.UBER_CLIENT_ID}&client_secret=${process.env.UBER_CLIENT_SECRET}&grant_type=client_credentials`,
    });

    const loginData = await loginResponse.json();
    
    console.log(loginData);
    
    // Get estimated price and time from Uber API
    const response = await fetch(
      `https://api.uber.com/v1.2/estimates/price?start_latitude=${startLat}&start_longitude=${startLng}&end_latitude=${endLat}&end_longitude=${endLng}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const estimatedPrice = data.prices[0].estimate;
    const estimatedTime = data.prices[0].duration;

    if (!estimatedPrice || !estimatedTime) {
      return res.status(400).json({ message: "😒 Invalid request!!" });
    }

    // Send response to client
    return res.status(200).json({
      message: "🎉 Estimated price and time retrieved successfully!!",
      data: { estimatedPrice, estimatedTime },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = {
  method: "get",
  route:
    "/requests/estimated-price-and-time/:startLat/:startLng/:endLat/:endLng",
  controller: [verifyUser, getEstimatedPriceAndTime],
};
