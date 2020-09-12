const tipos = [
  { value: 'telefone', text: 'Telefone' },
  { value: 'email', text: 'E-mail' },
];

/**
 * Classe para o cadastro de contato, que pode ser telefone ou e-mail.
 *
 * @author Evandro Abu Kamel
 */
export default class Contato {
  /**
   * Cria uma instancia de contato
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
   * Fetch all relevant data for the contato.
   */
  data() {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    data.tipoText = this.tipoText();

    return data;
  }

  /**
   * Retorna um array com os possíveis tipos de contato.
   */
  get tipos() {
    return tipos;
  }

  /**
   * Retorna a descrição do tipo do contato.
   */
  tipoText() {
    for (let i = 0; i < tipos.length; i++) {
      if (tipos[i].value == this.tipo) {
        return tipos[i].text;
      }
    }
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
        email: '',
        telefone: '',
        tipo: 'telefone',
      };
      this.email = this.telefone = '';
      this.id = null;
    }
  }
}
