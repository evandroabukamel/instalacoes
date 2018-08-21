/**
 * Classe para o cadastro de usuario, que pode ser telefone ou e-mail.
 * 
 * @author Evandro Abu Kamel
 */
export default class Usuario {

	/**
     * Cria uma instancia de usuario
     * @param {object} data - Data structure
     */
    constructor(data) {
		this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }
	}

    /**
     * Fetch all relevant data for the usuario.
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
				nome: '',
				usuario: '',
				senha: '',
				email: '',
				telefone: '',
				diasAcesso: [ true, true, true, true, true, true, true ],
				horarioInicial: '00:00:00',
				horarioFinal: '23:59:59',
				contatos: []
			};

			for (let property in this.originalData) {
				this[property] = this.originalData[property];
			}
		}
    }
}