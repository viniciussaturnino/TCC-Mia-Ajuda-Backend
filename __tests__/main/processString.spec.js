const {
  formatCpf,
  formatCnpj,
} = require("../../src/modules/main/utils/processString");

describe("formatCpf", () => {
  test("should remove formatting characters from CPF", () => {
    const cpfWithFormatting = "123.456.789-00";
    const expectedCpf = "12345678900";

    const formattedCpf = formatCpf(cpfWithFormatting);

    expect(formattedCpf).toBe(expectedCpf);
  });

  test("should handle CPF without formatting", () => {
    const cpfWithoutFormatting = "12345678900";

    const formattedCpf = formatCpf(cpfWithoutFormatting);

    expect(formattedCpf).toBe(cpfWithoutFormatting);
  });
});

describe("formatCnpj", () => {
  test("should remove formatting characters from CNPJ", () => {
    const cnpjWithFormatting = "12.345.678/0001-95";
    const expectedCnpj = "12345678000195";

    const formattedCnpj = formatCnpj(cnpjWithFormatting);

    expect(formattedCnpj).toBe(expectedCnpj);
  });

  test("should handle CNPJ without formatting", () => {
    const cnpjWithoutFormatting = "12345678000195";

    const formattedCnpj = formatCnpj(cnpjWithoutFormatting);

    expect(formattedCnpj).toBe(cnpjWithoutFormatting);
  });
});
