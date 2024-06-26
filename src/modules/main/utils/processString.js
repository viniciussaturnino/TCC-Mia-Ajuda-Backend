const formatCpf = (cpf) => {
  return cpf.replace(/[-.]/g, "");
};

const formatCnpj = (cnpj) => {
  return cnpj.replace(/([^0-9])+/g, "");
};

module.exports = {
  formatCpf,
  formatCnpj,
};
