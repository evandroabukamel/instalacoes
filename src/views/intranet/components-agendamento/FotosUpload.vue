<template>
  <form
    name="formAgendamentoFotoUpload"
    enctype="multipart/form-data"
    novalidate
  >
    <b-upload
      v-model="dropFiles"
      :name="inputName"
      accept="image/*"
      multiple
      drag-drop
      :loading="loading"
      type="is-black"
      @input="onFilesChange"
    >
      <section class="section">
        <div class="content has-text-centered">
          <p>
            <b-icon icon="upload" size="is-large"> </b-icon>
          </p>
          <p>Arraste para cá suas fotos ou clique aqui para enviar</p>
        </div>
      </section>
    </b-upload>
  </form>
</template>

<script>
export default {
  data() {
    return {
      dropFiles: [],
      inputName: 'agendamentoFotos[]',
      loading: false,
      uploadedFiles: [],
      uploadError: null,
    };
  },

  props: {
    idAgendamento: null,
  },

  methods: {
    onFilesChange(fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(this.inputName, fileList[x], fileList[x].name);
      });
      formData.append('id', this.idAgendamento);

      // save it
      this.dropFiles = [];
      this.save(formData);
    },

    save(formData) {
      let vm = this;

      // upload data to the server
      this.loading = true;
      this.upload(formData)
        .then((response) => {
          if (response) {
            vm.$toast.open({
              message: response.message
                ? response.message
                : 'Foto(s) salva(s) com sucesso.',
              type: 'is-success',
              position: 'is-top',
              duration: 5000,
            });
          }

          if (response.idFoto) {
            _.forEach(response.idFoto, function (idFoto) {
              vm.$emit('sent', { id: idFoto, endereco: null });
            });
          }
        })
        .catch((error) => {
          if (error) {
            vm.$toast.open({
              message: error.message ? error.message : 'Erro ao salvar foto.',
              type: 'is-danger',
              position: 'is-top',
              duration: 5000,
            });
          }
        });
    },

    upload(formData) {
      return new Promise((resolve, reject) => {
        this.axios
          .post('/agendamento/enviarFoto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            this.loading = false;
            resolve(response.data);
          })
          .catch((error) => {
            this.loading = false;
            reject(error.response.data);
          });
      });
    },
  },
};
</script>
