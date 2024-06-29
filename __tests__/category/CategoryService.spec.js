const CategoryService = require("../../src/modules/category/app/CategoryService");
const CategoryRepository = require("../../src/modules/category/domain/repositories/CategoryRepository");

jest.mock("../../src/modules/category/domain/repositories/CategoryRepository");

describe("CategoryService", () => {
  let categoryService;
  let mockCategoryRepository;

  beforeEach(() => {
    mockCategoryRepository = new CategoryRepository();
    categoryService = new CategoryService();
    categoryService.categoryRepository = mockCategoryRepository;
  });

  test("getCategoryById should return the category if it exists", async () => {
    const categoryId = "categoryId";
    const mockCategory = { id: categoryId, name: "TestCategory" };
    mockCategoryRepository.getById.mockResolvedValue(mockCategory);

    const result = await categoryService.getCategoryById(categoryId);

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith(categoryId);
    expect(result).toEqual(mockCategory);
  });

  test("getCategoryById should throw an error if category does not exist", async () => {
    const categoryId = "categoryId";
    mockCategoryRepository.getById.mockResolvedValue(null);

    await expect(categoryService.getCategoryById(categoryId)).rejects.toThrow(
      "Category not found"
    );

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith(categoryId);
  });

  test("getCategoryList should return the list of categories", async () => {
    const mockCategoryList = [
      { id: "1", name: "Category1" },
      { id: "2", name: "Category2" },
    ];
    mockCategoryRepository.list.mockResolvedValue(mockCategoryList);

    const result = await categoryService.getCategoryList();

    expect(result).toEqual(mockCategoryList);
  });

  test("getCategoryList should throw an error if no categories are found", async () => {
    mockCategoryRepository.list.mockResolvedValue(null);

    await expect(categoryService.getCategoryList()).rejects.toThrow(
      "Category not found"
    );
  });
});
