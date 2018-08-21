/**
 * Classe que gerencia as mensagens de erro dos forms.
 *
 * @author Evandro Abu Kamel
 * @example https://laracasts.com/series/learn-vue-2-step-by-step/episodes/20
 */
export default class Errors {
	/**
	 * Create a new Errors instance.
	 */
	constructor() {
		this.errors = {};
	}

	/**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    /**
     * Determine if we have any errors.
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }

    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get(field) {
        if (this.errors[field]) {
            return this.errors[field];
        }
    }

    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors) {
        this.errors = errors;
    }

    /**
     * Add a new error.
     *
     * @param {string} key
     * @param {string} error
     */
    add(key, text) {
        let temp = this.errors;
        this.errors = {};
        this.errors = temp;
        this.errors[key] = text;
    }

    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear(field, subform) {
        if (field || subform) {
            if (subform) {
				if (this.errors[subform] && field){
                    //console.log(subform + ' > ' + field);
                	delete this.errors[subform][field];
                    if (Object.keys(this.errors[subform]).length == 0) {
                	    delete this.errors[subform];
                    }
				}
                else if (this.errors[subform] && !field){
                    //console.log(subform + ' > ' + field);
                    this.errors[subform] = {};
                	delete this.errors[subform];
				}
            }
            else if (field) {
				if (typeof this.errors[field] === 'string') {
                    //console.log(subform + ' > ' + field);
                	delete this.errors[field];
				}
            }
        }
		else {
        	this.errors = {};
		}
    }
}