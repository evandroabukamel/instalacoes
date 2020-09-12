/**
 * Esse arquivo define os props e métodos padrões dos componentes InputText, SelectAjax, Switch e outros inputs.
 *
 * @author Evandro Abu Kamel
 */
export default {
  props: {
    value: {
      type: Number | String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    fieldType: String,
    controlType: String,
    label: {
      type: String,
      required: false,
    },
    classes: {
      type: String,
      required: false,
    },
    sizeClass: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    icon: {
      type: String,
      default: '',
    },
    iconPack: {
      type: String,
      default: 'mdi',
    },
    minlength: null,
    maxlength: null,
    hasCounter: {
      type: Boolean,
      default: false,
    },
    min: null,
    max: null,
    rows: null,
    cols: null,
    size: String,
    required: null,
    disabled: false,
    readonly: false,
    expanded: false,
    hasError: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
    },
  },

  methods: {
    // Instead of updating the value directly, this
    // method is used to format and place constraints
    // on the input's value
    updateValue(value) {
      // Emit the number value through the input event
      this.$emit('input', value);
    },

    /**
     * Emite um evento que retorna o atributo name do campo que herda esse mixin.
     */
    getName(name) {
      // Emit the number value through the input event
      this.$emit('get-name', name);
    },

    /**
     * Valida uma string de s-mail.
     */
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },
};
