<template>
  <div class="columns">
    <div class="column is-half-tablet is-one-third-desktop">
      <h1 class="title is-clearfix">Alterar senha</h1>
      <b-message :closable="false">
        <form name="trocarSenhaForm" method="post" action="#">
          <div class="columns">
            <div class="column is-centered">
              <input-text
                type="password"
                v-model="form.senhaAtual"
                name="senhaAtual"
                placeholder="Senha atual"
                size="is-medium"
                :password-reveal="true"
                :error="form.errors.get('senhaAtual')"
              ></input-text>
              <input-text
                type="password"
                v-model="form.novaSenha"
                name="novaSenha"
                placeholder="Nova senha"
                size="is-medium"
                :password-reveal="true"
                :error="form.errors.get('novaSenha')"
              ></input-text>
            </div>
          </div>
          <!-- Botões -->
          <div class="field has-addons has-addons-right">
            <div class="control">
              <button
                type="button"
                class="button is-primary is-medium"
                :class="{ 'is-loading': form.isLoading }"
                @click="onSubmit"
                @dblclick.prevent
              >
                Salvar
              </button>
            </div>
          </div>
          <div class="content"><!-- SPACE --></div>
        </form>
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
        senhaAtual: '',
        novaSenha: '',
      }),
      successMessage: null,
      errorMessage: null,
    };
  },

  methods: {
    onSubmit() {
      this.clearMessages();

      this.$store
        .dispatch('changePassword', this.form)
        .then((response) => {
          if (response && response.message) {
            this.successMessage = response.message;
          }
        })
        .catch((error) => {
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
