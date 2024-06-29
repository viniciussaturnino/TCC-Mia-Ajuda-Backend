const HelpService = require("../../src/modules/help/app/HelpService");
const HelpRepository = require("../../src/modules/help/domain/repositories/HelpRepository");
const helpStatusEnum = require("../../src/modules/help/infra/enums/helpStatusEnum");
jest.mock("../../src/modules/user/domain/User");
jest.mock("../../src/modules/help/domain/repositories/HelpRepository");

describe("HelpService", () => {
  let helpService;
  let mockHelpRepository;
  let mockUserRepository;

  beforeEach(() => {
    const MockUser = require("../../src/modules/user/domain/User");

    mockUserRepository = {
      getById: jest.fn(),
    };

    MockUser.mockImplementation(() => ({ userRepository: mockUserRepository }));

    helpService = new HelpService();
    mockHelpRepository = new HelpRepository();
    helpService.helpRepository = mockHelpRepository;
  });

  test("createHelp should create a help request if user has not exceeded the limit", async () => {
    mockHelpRepository.countDocuments.mockResolvedValue(10);
    mockHelpRepository.create.mockResolvedValue({
      id: "123",
      ownerId: "ownerId",
    });

    const data = { ownerId: "ownerId" };
    const result = await helpService.createHelp(data);

    expect(mockHelpRepository.countDocuments).toHaveBeenCalledWith("ownerId");
    expect(mockHelpRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: "123", ownerId: "ownerId" });
  });

  test("createHelp should throw an error if user has exceeded the limit", async () => {
    mockHelpRepository.countDocuments.mockResolvedValue(16);

    const data = { ownerId: "ownerId" };

    await expect(helpService.createHelp(data)).rejects.toThrow(
      `User has reached the maximum number of help requests: 15`
    );

    expect(mockHelpRepository.countDocuments).toHaveBeenCalledWith("ownerId");
  });

  test("getHelpById should return the help if it exists", async () => {
    mockHelpRepository.getById.mockResolvedValue({ id: "123" });

    const result = await helpService.getHelpById("123");

    expect(mockHelpRepository.getById).toHaveBeenCalledWith("123");
    expect(result).toEqual({ id: "123" });
  });

  test("getHelpById should throw an error if help does not exist", async () => {
    mockHelpRepository.getById.mockResolvedValue(null);

    await expect(helpService.getHelpById("123")).rejects.toThrow(
      "Help request not found"
    );
    expect(mockHelpRepository.getById).toHaveBeenCalledWith("123");
  });

  test("getUserHelps should return the user helps if they exist", async () => {
    mockHelpRepository.getByUserId.mockResolvedValue([
      { id: "123" },
      { id: "456" },
    ]);

    const result = await helpService.getUserHelps("userId");

    expect(mockHelpRepository.getByUserId).toHaveBeenCalledWith("userId");
    expect(result).toEqual([{ id: "123" }, { id: "456" }]);
  });

  test("getUserHelps should throw an error if user has no helps", async () => {
    mockHelpRepository.getByUserId.mockResolvedValue(null);

    await expect(helpService.getUserHelps("userId")).rejects.toThrow(
      "User doesn't have any help requests"
    );
    expect(mockHelpRepository.getByUserId).toHaveBeenCalledWith("userId");
  });

  test("getHelpWithAggregationById should return the help with aggregation if it exists", async () => {
    mockHelpRepository.getByIdWithAggregation.mockResolvedValue({ id: "123" });

    const result = await helpService.getHelpWithAggregationById("123");

    expect(mockHelpRepository.getByIdWithAggregation).toHaveBeenCalledWith(
      "123"
    );
    expect(result).toEqual({ id: "123" });
  });

  test("getHelpWithAggregationById should throw an error if help does not exist", async () => {
    mockHelpRepository.getByIdWithAggregation.mockResolvedValue(null);

    await expect(helpService.getHelpWithAggregationById("123")).rejects.toThrow(
      "Help request not found"
    );
    expect(mockHelpRepository.getByIdWithAggregation).toHaveBeenCalledWith(
      "123"
    );
  });

  test("getWaitingList should return waiting list of helps if they exist", async () => {
    const helplist = [{ id: "123" }, { id: "456" }];
    mockHelpRepository.getWaitingList.mockResolvedValue(helplist);

    const result = await helpService.getWaitingList([0, 0], "ownerId", [
      "category1",
    ]);

    expect(mockHelpRepository.getWaitingList).toHaveBeenCalledWith(
      [0, 0],
      "ownerId",
      ["category1"]
    );
    expect(result).toEqual(helplist);
  });

  test("getWaitingList should throw an error if no helps are found", async () => {
    mockHelpRepository.getWaitingList.mockResolvedValue([]);

    await expect(
      helpService.getWaitingList([0, 0], "ownerId", ["category1"])
    ).rejects.toThrow("Help requests not found in your distance range");

    expect(mockHelpRepository.getWaitingList).toHaveBeenCalledWith(
      [0, 0],
      "ownerId",
      ["category1"]
    );
  });

  test("deactivateHelp should deactivate the help", async () => {
    const help = { id: "123", active: true };
    mockHelpRepository.getById.mockResolvedValue(help);

    const result = await helpService.deactivateHelp("123");

    expect(mockHelpRepository.getById).toHaveBeenCalledWith("123");
    expect(mockHelpRepository.update).toHaveBeenCalledWith({
      ...help,
      active: false,
    });
    expect(result).toEqual({ ...help, active: false });
  });

  test("getHelpListByStatus should return helps with the specified statuses", async () => {
    const helps = [{ id: "123" }, { id: "456" }];
    mockHelpRepository.getHelpListByStatus.mockResolvedValue(helps);

    const statusList = [
      helpStatusEnum.HELPER_FINISHED,
      helpStatusEnum.FINISHED,
    ];
    const result = await helpService.getHelpListByStatus({
      userId: "userId",
      statusList,
    });

    expect(mockHelpRepository.getHelpListByStatus).toHaveBeenCalledWith(
      "userId",
      statusList
    );
    expect(result).toEqual(helps);
  });

  test("getHelpListByStatus should throw an error if an invalid status is provided", async () => {
    const statusList = ["invalid_status"];

    await expect(
      helpService.getHelpListByStatus({ userId: "userId", statusList })
    ).rejects.toThrow("Invalid status");
  });
});
