# Instalações Front-end

Este pacote contém todo o código de front-end do sistema de agendamento de instalação e manutenção de equipamentos.

> ## Por todos os deuses, evite a gambiarra aqui e no back-end.

> ## Configure seus editores e IDEs para utilizar a codificação UTF-8.

Este projeto utiliza o framework VueJS 2, empacotado com Webpack 2 utilizando Node.js.

Para o CSS &eacute; utilizado o framework Bulma, que possui apenas CSS, nada de JavaScript.

## Instru&ccedil;&otilde;es de instala&ccedil;&atilde;o

```bash
# instala dependencias de acordo com o package.json
npm install

# roda a aplicacao no http://localhost:8080
npm run dev

# compila para producao com minificacao; copie a pasta 'public' para o servidor de producao e copie o conteúdo da index.html para a index.php.
npm run build

# caso a pasta 'static' tenha sido alterada, copie ela também, já que seus arquivos são estáticos, ou seja, o desenvolvedor coloca os arquinos lá.
```

Para explica&ccedil;&otilde;es detalhadas de como tudo funciona, consulte a [documenta&ccedil;&atilde;o do vue-loader](http://vuejs.github.io/vue-loader).

## Links &uacute;teis

Aprenda Vue.js em vídeos:
> https://laracasts.com/series/learn-vue-2-step-by-step

Usando o Vuex para gerenciar a sessão do usuário:
> https://medium.com/front-end-hacking/persisting-user-authentication-with-vuex-in-vue-b1514d5d3278

Conheça o Bulma para a biblioteca CSS utilizada:
> http://bulma.io

Conheça o Buefy para vários componentes Vue que utilizam o Bulma:
> https://buefy.github.io

Máscaras de inputs com The Mask:
> https://vuejs-tips.github.io/vue-the-mask/
> https://github.com/vuejs-tips/v-money

Lodash (Lo_) e suas funções úteis: 
> https://lodash.com/docs/4.17.4

MomentJS para funções com data e hora:
> https://momentjs.com/

Veja a lista dos pacotes utilizados no arquivo `package.json` na seção `dependencies`. Procure por eles no [npmjs.com](https://www.npmjs.com/) para mais detalhes.

