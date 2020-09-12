<template>
  <div class="columns is-centered">
    <div class="column is-half-tablet is-one-third-desktop">
      <b-message
        title="Esqueci minha senha"
        type="is-primary"
        size="is-medium"
        :closable="false"
      >
        <form
          name="lembrarSenhaForm"
          method="post"
          action="#"
          @submit.prevent="onSubmit"
        >
          <div
            class="field"
            v-html="
              'Informe o usu&aacute;rio e o e-mail principal cadastrado.' +
              ' Uma nova senha ser&aacute; gerada e enviada para esse e-mail.'
            "
          ></div>
          <input-text
            type="text"
            v-model="form.usuario"
            name="login"
            placeholder="Usuário"
            size="is-medium"
            :error="form.errors.get('usuario')"
          >
          </input-text>
          <input-text
            type="text"
            v-model="form.email"
            name="email"
            placeholder="E-mail"
            size="is-medium"
            :error="form.errors.get('email')"
          >
          </input-text>
          <div class="field">
            <div class="control level">
              <div class="level-left">
                <button
                  type="submit"
                  class="button is-primary level-item is-medium"
                  :class="{ 'is-loading': form.isLoading }"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </form>
        <div class="content"><!-- SPACE --></div>
        <b-field v-if="Boolean(successMessage)">
          <b-message
            type="is-success"
            :active="Boolean(successMessage)"
            :closable="false"
            :has-icon="false"
          >
            {{ successMessage }}
          </b-message>
        </b-field>
        <b-field v-if="Boolean(errorMessage)">
          <b-message
            type="is-danger"
            :active="Boolean(errorMessage)"
            :closable="false"
            :has-icon="false"
          >
            {{ errorMessage }}
          </b-message>
        </b-field>
      </b-message>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: new Form({
        usuario: '',
        email: '',
      }),
      successMessage: null,
      errorMessage: null,
    };
  },

  methods: {
    onSubmit() {
      this.form.isLoading = true;
      this.clearMessages();
      this.$store
        .dispatch('rememberPassword', this.form.data())
        .then((response) => {
          this.form.isLoading = false;
          if (response && response.message) {
            this.successMessage = response.message;
          }
        })
        .catch((error) => {
          this.form.isLoading = false;
          if (error && error.message) {
            this.errorMessage = error.message;
          }
        });
    },

    clearMessages() {
      this.successMessage = null;
      this.errorMessage = null;
    },
  },
};
</script>
