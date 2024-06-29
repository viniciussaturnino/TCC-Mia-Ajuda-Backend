const { getLocation } = require("../../src/modules/main/utils/location");

describe("getLocation", () => {
  test("should get coordinates from object with location", () => {
    const objWithLocation = {
      location: {
        coordinates: [1.2345, -3.4567],
      },
    };

    const coordinates = getLocation(objWithLocation);

    expect(coordinates).toEqual([1.2345, -3.4567]);
  });

  test("should get coordinates from object with user's location", () => {
    const objWithUserLocation = {
      user: {
        location: {
          coordinates: [10.9876, -7.6543],
        },
      },
    };

    const coordinates = getLocation(objWithUserLocation);

    expect(coordinates).toEqual([10.9876, -7.6543]);
  });

  test("should return undefined if neither location nor user's location exists", () => {
    const objWithoutLocation = {};

    const coordinates = getLocation(objWithoutLocation);

    expect(coordinates).toBeUndefined();
  });
});
