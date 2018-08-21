const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Classe para o cadastro de agenda, que pode ser telefone ou e-mail.
 * 
 * @author Evandro Abu Kamel
 */
export default class Agenda {
	/**
     * Cria uma instancia de agenda
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
     * Fetch all relevant data for the agenda.
     */
    data() {
        let data = {};

        for (let property in this.originalData) {
            data[property] = this[property];
        }

		data.diaSemanaText = this.diaSemanaText();

        return data;
    }
	
	/**
	 * Retorna um array com os possíveis dias da semana.
	 */
	get diasSemana() {
		return diasSemana;
	}

	/**
	 * Retorna a descrição do dia da semana.
	 */
	diaSemanaText() {
		for (let i = 0; i < diasSemana.length; i++) {
			if (i == this.diaSemana)
				return diasSemana[i]
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
        }
		else {
        	this.originalData = {
				id: null,
				diaSemana: this.diaSemana,
				horarioInicial: '',
				horarioFinal: ''
			};
			this.id = null;
			this.horarioInicial = this.horarioFinal = '';
		}
    }
}
