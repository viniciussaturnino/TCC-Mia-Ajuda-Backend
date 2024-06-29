const {
  deg2rad,
  calculateDistance,
} = require("../../src/modules/main/utils/distance");

describe("deg2rad function", () => {
  test("should convert degrees to radians correctly", () => {
    const degrees = 45;
    const radians = deg2rad(degrees);
    const expectedRadians = degrees * (Math.PI / 180);
    expect(radians).toBeCloseTo(expectedRadians);
  });

  test("should handle negative degrees correctly", () => {
    const degrees = -30;
    const radians = deg2rad(degrees);
    const expectedRadians = degrees * (Math.PI / 180);
    expect(radians).toBeCloseTo(expectedRadians);
  });
});

describe("calculateDistance function", () => {
  test("should calculate distance between two points correctly", () => {
    const centerCoordinates = { latitude: 40.73061, longitude: -73.935242 };
    const pointCoordinates = { latitude: 34.052235, longitude: -118.243683 };

    const expectedDistance = 3941.566;

    const distance = calculateDistance(centerCoordinates, pointCoordinates);

    expect(distance).toBeCloseTo(expectedDistance, 1);
  });

  test("should return 0 if both coordinates are the same", () => {
    const centerCoordinates = { latitude: 40.73061, longitude: -73.935242 };
    const pointCoordinates = { latitude: 40.73061, longitude: -73.935242 };

    const distance = calculateDistance(centerCoordinates, pointCoordinates);

    expect(distance).toBe(0);
  });
});
