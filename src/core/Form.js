import Errors from './Errors.js';
import Endereco from './Endereco.js';

/**
 * Classe que gerencia um formulário gerérico.
 *
 * IMPORTANTE: Uma instância dessa classe não pode ter uma propriedade com o mesmo nome
 * que os métodos dessa classe.
 *
 * @author Evandro Abu Kamel
 * @example https://laracasts.com/series/learn-vue-2-step-by-step/episodes/20
 */
export default class Form {
  /**
   * Create a new Form instance.
   *
   * @param {object} data
   */
  constructor(data) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }

    this.errors = new Errors();
    this.isLoading = false;
  }

  /**
   * Fetch all relevant data for the form.
   */
  data() {
    let data = {};

    for (let field in this.originalData) {
      if (typeof this[field] === 'object') {
        if (
          this[field] != null &&
          _.includes(['Endereco', 'Usuario'], this[field].constructor.name)
        ) {
          data[field] = this[field].data();
        } else {
          data[field] = this[field];
        }
      } else {
        data[field] = this[field];
      }
    }

    return data;
  }

  /**
   * Reset the form fields and clear the errors.
   */
  reset() {
    // Reseta o ID antes de tudo
    if (typeof this.id !== 'undefined') {
      this.id = null;
    }

    for (let field in this.originalData) {
      if (typeof this[field] === 'string') {
        this[field] = '';
        if (this.originalData[field] != '')
          this[field] = this.originalData[field];
      } else if (typeof this[field] === 'number') {
        this[field] = 0;
        if (this.originalData[field] != 0)
          this[field] = this.originalData[field];
      } else if (typeof this[field] === 'object') {
        if (
          this[field] != null &&
          _.includes(['Endereco', 'Usuario'], this[field].constructor.name)
        ) {
          this[field].clear();
        }

        this[field] = {};
        if (this.originalData[field] != {})
          this[field] = this.originalData[field];
      } else if (typeof this[field] === 'array') {
        this[field] = [];
        if (this.originalData[field] != [])
          this[field] = this.originalData[field];
      } else if (typeof this[field] === 'boolean') {
        this[field] = false;
        if (this.originalData[field] != false)
          this[field] = this.originalData[field];
      } else {
        this[field] = null;
        if (this.originalData[field] != null)
          this[field] = this.originalData[field];
      }
    }

    this.errors.clear();
  }

  /**
   * Send a GET request to the given URL.
   * .
   * @param {string} url
   */
  get(url, options = null) {
    return this.submit('get', url, options);
  }

  /**
   * Send a POST request to the given URL.
   * .
   * @param {string} url
   */
  post(url, options = null) {
    return this.submit('post', url, options);
  }

  /**
   * Send a PUT request to the given URL.
   * .
   * @param {string} url
   */
  put(url, options = null) {
    return this.submit('put', url, options);
  }

  /**
   * Send a PATCH request to the given URL.
   * .
   * @param {string} url
   */
  patch(url, options = null) {
    return this.submit('patch', url, options);
  }

  /**
   * Send a DELETE request to the given URL.
   * .
   * @param {string} url
   */
  delete(url) {
    return this.submit('delete', url, undefined);
  }

  /**
   * Submit the form.
   *
   * @param {string} requestType
   * @param {string} url
   * @param {object} options
   */
  submit(requestType, url, options = null) {
    this.isLoading = true;
    this.errors.clear();
    return new Promise((resolve, reject) => {
      Vue.axios[requestType](url, this.data(), options)
        .then((response) => {
          this.isLoading = false;
          if (response) {
            if (response.status >= 200 && response.status < 300) {
              this.onSuccess(response.data);
            }
            resolve(response.data);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          // Erros 401 e 500 são tratados no main.js.
          if (
            error.response &&
            !_.includes([401, 500], error.response.status)
          ) {
            // Omite o atributo Message de ir para a lista de erros
            this.onFail(_.omit(error.response.data, ['message', 'status']));
            reject(error.response.data);
          }
        });
    });
  }

  /**
   * Handle a successful form submission.
   *
   * @param {object} data
   */
  onSuccess(data) {
    this.reset();
  }

  /**
   * Handle a failed form submission.
   *
   * @param {object} errors
   */
  onFail(errors) {
    this.errors.record(errors);
  }

  /**
   * Carrega contatos vindos da API para dentro de um objeto,
   * formatando os nomes dos campos.
   *
   * @param {object} source
   */
  loadContatos(source) {
    let contatos = [];
    for (let a in source) {
      let contato = source[a];

      contato.tipoText =
        contato.tipo == 'telefone'
          ? 'Telefone'
          : contato.tipo == 'email'
          ? 'E-mail'
          : '';
      contatos.push(contato);
    }
    return contatos;
  }

  /**
   * Carrega o endereço vindo da API para dentro de um objeto,
   * formatando os nomes dos campos.
   *
   * @param {object} source
   */
  loadEndereco(source) {
    let endereco = new Endereco({
      id: null,
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: null,
      pais: '',
      cep: '',
      posicao: {},
    });

    for (let a in source) {
      if (typeof source[a] !== 'object') {
        endereco[a] = source[a];
      } else {
        for (let b in source[a]) {
          endereco[a][b] = source[a][b];
        }
      }
    }
    return endereco;
  }

  /**
   * Carrega o usuário vindo da API para dentro de um objeto,
   * formatando os nomes dos campos.
   *
   * @param {object} source
   */
  loadUsuario(source) {
    let usuario = {
      id: null,
      nome: '',
      usuario: '',
      senha: null,
      email: '',
      telefone: '',
      diasAcesso: [true, true, true, true, true, true, true],
      horarioInicial: '00:00:00',
      horarioFinal: '23:59:59',
      contatos: [],
    };

    for (let a in _.omit(source, ['contatos'])) {
      if (typeof source[a] !== 'object') {
        usuario[a] = source[a];
      } else {
        for (let b in source[a]) {
          usuario[a][b] = source[a][b];
        }
      }
    }

    usuario.contatos = this.loadContatos(source['contatos']);

    return usuario;
  }

  /**
   * Add a contato to the contatos list and clear its errors.
   *
   * @param {object} contato
   */
  addContato(contato) {
    this.contatos.push(contato);
    this.errors.clear('contatos');
  }

  /**
   * Set the error message for a select field.
   *
   * @param {string} field
   * @param {object} event
   */
  setSelectError(field, event) {
    if (event) {
      this.errors.add(field, event);
    } else {
      this.errors.clear('field');
    }
  }
}
