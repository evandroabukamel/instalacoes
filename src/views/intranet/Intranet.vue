<template>
  <div class="heror">
    <h1 class="title">Intranet</h1>
    <b-message :closable="false">
      <span
        v-html="
          'Esta &eacute; a p&aacute;gina de Intranet. Futuramente haverá mais coisas aqui.'
        "
      ></span>
    </b-message>
  </div>
</template>

<script>
export default {
  name: 'intranet',
};
</script>
