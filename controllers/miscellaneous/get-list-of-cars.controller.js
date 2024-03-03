const loc = require("list-of-cars");

async function getListOfCars(req, res) {
  try {
    let cars = await loc.getListSync();
    cars = cars.map((car) => {
      delete car.Category;
      return car;
    });

    // group by make
    cars = cars.reduce((acc, car) => {
      if (!acc[car.Make]) {
        acc[car.Make] = [];
      }
      acc[car.Make].push(car);
      return acc;
    }, {});

    return res.status(200).json({
      message: "🎉 List of cars fetched successfully!!",
      data: cars,
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
  route: "/miscellaneous/list_of_cars",
  controller: [getListOfCars],
};
