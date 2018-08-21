/**
 * Esse arquivo possui filters e métodos que pode ser usados em qualquer componente Vue através de mixins.
 * 
 * @author Evandro Abu Kamel
 */
export default {
	filters: {
		/**
		 * Coloca o primeiro caracter da string em maiúsculo e o resto em minúsculo.
		 * 
		 * @param {string} str 
		 */
		capitalize(str){
			return _.capitalize(str);
		},

		upperCase(str){
			return _.upperCase(str);
		},

		lowerCase(str){
			return _.lowerCase(str);
		},
			
		/**
		 * Transforma os atributos do endereço numa string.
		 * 
		 * @param {object} endereco
		 */
		enderecoStr(endereco) {
			let str = '';
			if (endereco.logradouro && endereco.logradouro != '') {
				str += endereco.logradouro;
			}
			if (endereco.numero && endereco.numero != '' && str != '') {
				str += ', ' + endereco.numero;
			}
			if (endereco.complemento && endereco.complemento != '' && str != '') {
				str += ' ' + endereco.complemento;
			}
			if (endereco.bairro && endereco.bairro != '') {
				if (str != '') str += ', ';
				str += endereco.bairro;
			}
			if (endereco.cidade && endereco.cidade != '') {
				if (str != '') str += ', ';
				str += endereco.cidade;
			}
			if (endereco.estado && endereco.estado != '') {
				if (str != '') str += ' - ';
				str += endereco.estado;
			}
			/*if (endereco.pais && endereco.pais != '') {
				if (str != '') str += ', ';
				str += this.pais;
			}*/
			return str;
		},

		/**
		 * Retorna a primeira palavra de uma string.
		 * 
		 * @param {string} str
		 */
		firstName(str) {
			return _.head(_.split(str, ' '));
		},

		/**
		 * Coloca as devidas pontuações numa string de CPF ou CNPJ sem pontuações.
		 * 
		 * @param {string} c 
		 */
		formatCpfCnpj(c) {
			if (c.length == 11) {
				return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
			} else if (c.length == 14) {
				return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
			} else {
				return c;
			}
		},

		/**
		 * Coloca as devidas pontuações numa string de IMEI (######-##-######-#).
		 * 
		 * @param {string} c 
		 */
		formatImei(c) {
			if (c.length == 15) {
				return c.replace(/(\d{6})(\d{2})(\d{6})(\d{1})/g, "\$1\-\$2\-\$3\-\$4");
			} else {
				return c;
			}
		},

		/**
		 * Coloca as devidas pontuações numa string de ICCID (#### #### #### #### ## #).
		 * 
		 * @param {string} c 
		 */
		formatIccid(c) {
			if (c.length == 19) {
				return c.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{2})(\d{1})/g, "\$1 \$2 \$3 \$4 \$5 \$6");
			} else {
				return c;
			}
		},

		/**
		 * Converte um número float para formato de moeda.
		 * 
		 * @param {number|string} n 
		 */
		formatMoney(n) {
			return "R$ " + n.toFixed(2).replace(".",",");
		},

		/**
		 * Recebe um número sem formatação e retorna um telefone no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.
		 * 
		 * @param {string} v
		 */ 
		formatTelefone(v) {
			v = v.replace(/\D/g,""); // Remove tudo o que não é dígito
			v = v.replace(/^(\d{2})(\d)/g,"($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
			v = v.replace(/(\d)(\d{4})$/,"$1-$2"); // Coloca hífen entre o quarto e o quinto dígitos
			return v; 
		},

		/**
		 * Recebe uma string no formata HH:MM:SS e retorna somente HH:MM.
		 * 
		 * @param {string} str
		 */
		horaMinuto(str) {
			return str.slice(0, 5);
		},

		/**
		 * Executa o unescape numa string.
		 * 
		 * @param {string} str 
		 */
		unescape(str) {
			return unescape(str);
		}
	},

	methods: {
		/**
		 * Transformas os caracteres \n e/ou \r numa tag <br>.
		 * 
		 * @param {string} str 
		 */
		nl2br(str) {
			let breakTag = '<br>';
  			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
		}
	}
}