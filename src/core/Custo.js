/**
 * Classe para o cadastro de custo.
 *
 * @author Evandro Abu Kamel
 */
export default class Custo {
  /**
   * Cria uma instancia de custo
   *
   * @param {object} data
   */
  constructor(data) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }
  }

  /**
   * Fetch all relevant data for the custo.
   */
  data() {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    return data;
  }

  /**
   * Clear one or all fields.
   *
   * @param {string|null} field
   */
  clear(field) {
    if (field) {
      delete this.originalData[field];
    } else {
      this.originalData = {
        id: null,
        descricao: '',
        valor: '',
      };
      this.id = null;
      this.descricao = '';
      this.valor = '';
    }
  }
}
