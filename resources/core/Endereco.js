/**
 * Classe para o cadastro de endereco, que pode ser telefone ou e-mail.
 * 
 * @author Evandro Abu Kamel
 */
export default class Endereco {

	/**
     * Cria uma instancia de endereco
     * @param {object} data - Data structure
     */
    constructor(data) {
		this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }
	}

    /**
     * Fetch all relevant data for the endereco.
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
     * @param {string|null} field - Field name
     */
    clear(field) {
        if (field) {
            delete this.originalData[field];
        }
		else {
        	this.originalData = {
				id: null,
				logradouro: '',
				numero: '',
				complemento: '',
				bairro: '',
				cidade: '',
				estado: null,
				pais: '',
				cep: '',
				posicao: {}
			};

			for (let property in this.originalData) {
				this[property] = this.originalData[property];
			}
		}
    }

    /**
     * Transforma os atributos do endereço numa string.
     */
    toMapString() {
        let str = '';
        if (this.logradouro && this.logradouro != '') {
            str += this.logradouro;
        }
        if (this.numero && this.numero != '' && str != '') {
            str += ', ' + this.numero;
        }
        if (this.bairro && this.bairro != '') {
            if (str != '') str += ', ';
            str += this.bairro;
        }
        if (this.cidade && this.cidade != '') {
            if (str != '') str += ', ';
            str += this.cidade;
        }
        if (this.estado && this.estado != '') {
            if (str != '') str += ' - ';
            str += this.estado;
        }
        if (this.pais && this.pais != '') {
            if (str != '') str += ', ';
            str += this.pais;
        }
        return str;
    }
}