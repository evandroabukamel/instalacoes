<template>
  <div class="columns is-centered">
    <div class="column is-half-tablet is-one-third-desktop">
      <b-message
        title="Acesso ao sistema"
        type="is-primary"
        size="is-medium"
        :closable="false"
      >
        <form
          name="loginForm"
          method="post"
          action="#"
          @submit.prevent="onSubmit"
          @keydown="form.errors.clear($event.target.name)"
        >
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
            type="password"
            v-model="form.senha"
            name="password"
            placeholder="Senha"
            size="is-medium"
            :password-reveal="passwordReveal"
            :error="form.errors.get('senha')"
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
                  Entrar
                </button>
              </div>
              <div class="level-right">
                <router-link
                  to="/esqueci-minha-senha"
                  tag="button"
                  class="button is-danger is-outlined level-item is-medium"
                >
                  Esqueci minha senha
                </router-link>
              </div>
            </div>
          </div>
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
        </form>
      </b-message>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: new Form({
        usuario: '',
        senha: '',
      }),
      passwordReveal: true,
      errorMessage: null,
    };
  },
  methods: {
    onSubmit() {
      this.form.isLoading = true;
      this.clearMessages();
      this.$store
        .dispatch('login', this.form.data())
        .then((response) => {
          this.form.isLoading = false;
        })
        .catch((error) => {
          this.form.isLoading = false;
          if (error && error.message) {
            this.errorMessage = error.message;
          }
        });
    },
    clearMessages() {
      this.errorMessage = null;
    },
  },
  computed: {
    senha() {
      return this.form.senha;
    },
  },
  watch: {
    senha: function (val, oldVal) {
      if (val == '') {
        this.passwordReveal = true;
      }
    },
  },
  mounted() {
    if (this.form.senha != '') {
      this.passwordReveal = false;
    }
  },
};
</script>
