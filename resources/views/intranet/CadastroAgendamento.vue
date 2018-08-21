<template>
	<div class="columns is-centered">
		<div class="column">
			<!-- TÍTULO -->
			<h1 class="title is-clearfix">
				<div class="columns">
					<div class="column is-half is-left">
						<span class="title is-size-3-desktop is-size-4-mobile">
							{{ `Ordem de Serviço #${form.id || ''}` }}
						</span>
					</div>
					<div class="column is-half is-right" v-if="form.id > 0 && form.situacao.id > 0">
						<b-field grouped group-multiline position="is-right">
							<div class="control">
								<span class="title is-size-3-desktop is-size-5-mobile">
									{{ form.situacao.descricao }}
								</span>
							</div>
							<div class="control">
								<dropdown-agendamento-acoes 
									:situacao-atual="form.situacao.id"
									@confirmarAgendamento="onConfirmarAgendamento"
									@cancelarAgendamento="onCancelarAgendamento"
									@iniciarOrdemServico="onIniciarOrdemServico"
									@finalizarOrdemServico="onFinalizarOrdemServico"
									@concluirOrdemServico="onConcluirOrdemServico"
									@cancelarOrdemServico="onCancelarOrdemServico">
								</dropdown-agendamento-acoes>
							</div>
						</b-field>
					</div>
				</div>
			</h1>
			<!-- TABS -->
			<div>
				<div class="tabs is-boxed">
					<ul>
						<li :class="{'is-active': activeTab == 1}">
							<a @click="activeTab = 1">
								<b-icon icon="account"></b-icon>
								<span>Solicitante</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 2}">
							<a @click="activeTab = 2">
								<b-icon icon="calendar-today"></b-icon>
								<span>Agendamento</span>
								<b-icon v-if="form.motivoCancelamento" icon="warning" type="is-danger"></b-icon>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 3}" 
							v-if="form.id > 0 && (isUsuarioMatrizFilial || isUsuarioEmpresa)">
							<a @click="activeTab = 3">
								<b-icon icon="worker"></b-icon>
								<span v-html="'T&eacute;cnico'"></span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 4}" 
							v-if="form.id > 0 && (isSituacaoEmAtendimento || isSituacaoRealizado || isSituacaoConcluido)">
							<a @click="activeTab = 4">
								<b-icon icon="information-outline"></b-icon>
								<span v-html="'Servi&ccedil;o'"></span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 5}"
							v-if="isUsuarioMatrizFilial || isUsuarioCliente">
							<a @click="activeTab = 5">
								<b-icon icon="currency-usd"></b-icon>
								<span>Custos</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 6}"
							v-if="form.id > 0 && (!isUsuarioCliente)">
							<a @click="activeTab = 6">
								<b-icon icon="message-bulleted"></b-icon>
								<span>Obserações</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<b-message :closable="false">
				<form name="cadastroAgendamentoForm" method="post" action="#"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<!-- TAB DADOS SOLICITANTE -->
					<div v-show="activeTab == 1">
						<div class="columns">
							<div class="column is-half-desktop">
								<input-autocomplete name="cliente"
									v-if="isUsuarioMatrizFilial"
									ref="autocompleteCliente"
									size="is-medium"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									:url="urlAutocompleteCliente"
									:init-value="form.cliente ? form.cliente.nome : null"
									field="nome"
									subtitle="cpfcnpj"
									field-label="Nome"
									subtitle-label="CPF/CNPJ"
									placeholder="Cliente"
									:minlength="2"
									@selected="setCliente"
									:error="form.errors.get('cliente')"></input-autocomplete>
								<input-text name="beneficiario" 
									v-model="form.beneficiario" size="is-medium"
									placeholder="Solicitante"
									:maxlength="128"
									:disabled="!(isSituacaoAberto || isSituacaoRemarcado) || !(isUsuarioMatrizFilial || isUsuarioCliente)"
									:has-error="form.errors.has('beneficiario')"
									:error="form.errors.get('beneficiario')"></input-text>
								<div class="content"><!-- SPACE --></div>
								<!-- Contatos -->
								<h2 class="subtitle">Contatos</h2>
								<input-contato name="contato" v-on:add="form.addContato($event)"
									v-if="(isUsuarioMatrizFilial || isUsuarioCliente)
										&& !(isSituacaoConcluido || isSituacaoCancelado)"
									size="is-medium"
									:has-error="form.errors.has('contatos')"
									:error="form.errors.get('contatos')"></input-contato>
								<div></div>
								<lista-contato v-model="form.contatos"
									:showRemoveButton="(isUsuarioMatrizFilial || isUsuarioCliente) 
										&& !(isSituacaoConcluido || isSituacaoCancelado)">
								</lista-contato>
							</div>
							<div class="column is-half-desktop">
								<input-text name="placaVeiculo" 
									v-model="form.placaVeiculo" size="is-medium"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									placeholder="Placa do veículo"
									:mask="'AAA-####'"
									:has-error="form.errors.has('placaVeiculo')"
									:error="form.errors.get('placaVeiculo')"></input-text>
								<input-autocomplete name="marcaVeiculo"
									ref="autocompleteMarcaVeiculo"
									size="is-medium"
									label="Marca do veículo"
									placeholder="Buscar marca do veículo"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									:url="urlAutocompleteMarcaVeiculo"
									:init-value="form.marcaVeiculo ? form.marcaVeiculo.descricao : null"
									field="descricao"
									:minlength="2"
									@selected="setMarcaVeiculo"
									:error="form.errors.get('marcaVeiculo')">
								</input-autocomplete>
								<input-autocomplete name="modeloVeiculo"
									ref="autocompleteModeloVeiculo"
									size="is-medium"
									label="Modelo do veículo"
									placeholder="Buscar modelo do veículo"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									:url="urlAutocompleteModeloVeiculo"
									:init-value="form.modeloVeiculo ? form.modeloVeiculo.descricao : null"
									field="descricao"
									:minlength="2"
									@selected="setModeloVeiculo"
									:error="form.errors.get('modeloVeiculo')">
								</input-autocomplete>
								<select-ajax name="corVeiculo" ref="selectCorVeiculo"
									v-model="form.corVeiculo.id" size="is-medium"
									placeholder="Cor do veículo"
									api-route="/marcaModeloVeiculo/listarCor"
									control-type="is-primary"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									:has-error="form.errors.has('corVeiculo')"
									:error="form.errors.get('corVeiculo')"
									v-on:errorSelectAjax="form.setSelectError('corVeiculo', $event)">
									<option v-if="!isSituacaoAberto && !isSituacaoRemarcado && form.corVeiculo.id" 
										:value="form.corVeiculo.id">
										{{ form.corVeiculo.descricao }}
									</option>
								</select-ajax>
							</div>
						</div>
						<div class="columns" v-if="isUsuarioMatrizFilial || isUsuarioCliente">
							<div class="column is-half-desktop">
								<!-- Localização -->
								<h2 class="subtitle"><span v-html="'Localiza&ccedil;&atilde;o'"></span></h2>
								<!-- FormEndereco -->
								<form-endereco name="endereco"
									size="is-medium"
									:readonly="!isSituacaoAberto && !isSituacaoRemarcado"
									v-model="form.endereco"
									@changed="form.errors.clear($event, 'endereco')"
									:has-error="form.errors.has('endereco')"
									:error="form.errors.get('endereco')"></form-endereco>
							</div>
							<div class="column is-half-desktop" v-if="isSituacaoAberto || isSituacaoRemarcado">
								<!-- Mapa -->
								<here-maps ref="clienteMap" :value="markersSolicitante"
									v-if="(isSituacaoAberto || isSituacaoRemarcado) && activeTab == 1"
									@clickBuscarPosicao="buscarEnderecoPosicao"
									@markerPositioned="atualizaEnderecoPosicao($event)">
								</here-maps>
								<div></div>
							</div>
						</div>
					</div>
					<!-- TAB DADOS AGENDAMENTO -->
					<div v-show="activeTab == 2">
						<div class="columns">
							<div class="column is-half-desktop">
								<select-ajax name="tipoServico" ref="selectTipoServico"
									v-model="form.tipoServico.id" size="is-medium"
									@input="getValorMedioServico($event)"
									placeholder="Tipo de serviço"
									api-route="/tipoServico/listar"
									control-type="is-primary"
									:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
									:has-error="form.errors.has('tipoServico')"
									:error="form.errors.get('tipoServico')"
									v-on:errorSelectAjax="form.setSelectError('tipoServico', $event)">
									<option v-if="!isSituacaoAberto && !isSituacaoRemarcado && form.tipoServico.id" 
										:value="form.tipoServico.id">
										{{ form.tipoServico.descricao }}
									</option>
								</select-ajax>
								<div class="content"><!-- SPACE --></div>
								<b-field>
									<b-message type="is-danger" :has-icon="true" :show-close-button="false"
										v-if="form.motivoCancelamento">
										{{ form.motivoCancelamento }}
									</b-message>
								</b-field>
								<b-field>
									<b-message type="is-info" :has-icon="true" :show-close-button="false"
										v-show="(isSituacaoAberto || isSituacaoRemarcado) && (isUsuarioCliente || isUsuarioMatrizFilial)">
										Esta data e horário estão sujeitos a análise e poderão ser alterados conforme 
										a disponibilidade.
									</b-message>
								</b-field>
								<date-time-picker placeholder="Data preferida"
									v-if="(isSituacaoAberto || isSituacaoRemarcado) && (isUsuarioCliente || isUsuarioMatrizFilial)"
									name="dataPreferida"
									v-model="form.dataPreferida"
									:config="dataPreferidaConfig"
									size="is-medium"
									:has-error="form.errors.has('dataPreferida')"
									:error="form.errors.get('dataPreferida')">
								</date-time-picker>
								<date-time-picker placeholder="Horário preferido"
									v-if="(isSituacaoAberto || isSituacaoRemarcado) && (isUsuarioCliente || isUsuarioMatrizFilial)"
									name="horaPreferida"
									v-model="form.horaPreferida"
									:config="horaPreferidaConfig"
									size="is-medium"
									:has-error="form.errors.has('horaPreferida')"
									:error="form.errors.get('horaPreferida')">
								</date-time-picker>
								<b-field label="Data e hora preferida"
									v-if="((isSituacaoAberto || isSituacaoRemarcado) && !(isUsuarioCliente || isUsuarioMatrizFilial))
									|| (isSituacaoCancelado && this.form.dataPreferida && this.form.horaPreferida)">
									<span class="subtitle">{{ this.form.dataPreferida|date }} às {{ this.form.horaPreferida|time }}</span>
								</b-field>
								<b-field label="Data e hora do agendamento"
									v-else-if="(!isSituacaoAberto && !isSituacaoRemarcado) || isSituacaoCancelado">
									<span class="subtitle">{{ this.form.dataAgendamento|date }} às {{ this.form.horaAgendamento|time }}</span>
								</b-field>
							</div>
							<div class="column is-half-desktop">
								<b-field label="Enviar chip">
									<b-switch name="enviarChip"
										:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
										v-model="form.enviarChip"
										@input="changeEnviarChip">
									</b-switch>
								</b-field>
								<b-field v-show="form.enviarChip">
									<select-ajax name="operadora" ref="selectOperadora"
										v-model="form.operadora.id" size="is-medium"
										placeholder="Operadora do chip"
										api-route="/operadora/listar"
										control-type="is-primary"
										:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
										:has-error="form.errors.has('operadora')"
										:error="form.errors.get('operadora')"
										@errorSelectAjax="form.setSelectError('operadora', $event)">
										<option v-if="!isSituacaoAberto && !isSituacaoRemarcado && form.operadora.id" 
											:value="form.operadora.id">
											{{ form.operadora.descricao }}
										</option>
									</select-ajax>
								</b-field>
								<div class="content"><!-- SPACE --></div>
								<b-field label="Enviar equipamento">
									<b-switch name="enviarEquipamento"
										:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
										v-model="form.enviarEquipamento"
										@input="changeEnviarEquipamento">
									</b-switch>
								</b-field>
								<b-field v-show="form.enviarEquipamento">
									<select-ajax name="marcaEquipamento" ref="selectMarcaEquipamento"
										v-model="form.marcaEquipamento.id" size="is-medium"
										placeholder="Marca do equipamento"
										api-route="/marcaModeloEquipamento/listarMarca"
										control-type="is-primary"
										:changed="marcaEquipamentoChanged"
										:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
										:has-error="form.errors.has('marcaEquipamento')"
										:error="form.errors.get('marcaEquipamento')"
										@errorSelectAjax="form.setSelectError('marcaEquipamento', $event)">
										<option v-if="!isSituacaoAberto && !isSituacaoRemarcado && form.marcaEquipamento.id" 
											:value="form.marcaEquipamento.id">
											{{ form.marcaEquipamento.descricao }}
										</option>
									</select-ajax>
								</b-field>
								<b-field v-show="form.enviarEquipamento">
									<select-ajax name="modeloEquipamento" ref="selectModeloEquipamento"
										v-model="form.modeloEquipamento.id" size="is-medium"
										placeholder="Modelo do equipamento"
										:api-route="'/marcaModeloEquipamento/listarModelo/'"
										:params="marcaEquipamento"
										control-type="is-primary"
										:disabled="!isSituacaoAberto && !isSituacaoRemarcado"
										:has-error="form.errors.has('modeloEquipamento')"
										:error="form.errors.get('modeloEquipamento')"
										@errorSelectAjax="form.setSelectError('modeloEquipamento', $event)">
										<option v-if="!isSituacaoAberto && !isSituacaoRemarcado && form.modeloEquipamento.id" 
											:value="form.modeloEquipamento.id">
											{{ form.modeloEquipamento.descricao }}
										</option>
									</select-ajax>
								</b-field>
								<div class="content"><!-- SPACE --></div>
								<b-field label="Destinatário do envio" expanded
									v-show="form.enviarChip || form.enviarEquipamento">
									<b-field position="is-left">
										<b-radio-button v-model="form.destinatarioEnvio"
											:native-value="'tecnico'"
											:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioTecnico || isUsuarioEmpresa"
											type="is-primary" size="is-medium">
											<b-icon icon="worker"></b-icon>
											<span>Técnico</span>
										</b-radio-button>
										<b-radio-button v-model="form.destinatarioEnvio"
											:native-value="'solicitante'"
											:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioTecnico || isUsuarioEmpresa"
											type="is-primary" size="is-medium">
											<b-icon icon="account"></b-icon>
											<span>Solicitante</span>
										</b-radio-button>
									</b-field>
								</b-field>
								<input-text v-show="isUsuarioMatrizFilial && form.id > 0
									&& (form.enviarChip || form.enviarEquipamento)"
									name="codigoRastreamentoEnvio" 
									v-model="form.codigoRastreamentoEnvio" size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || !isUsuarioMatrizFilial"
									placeholder="Código de rastreio do envio"
									:has-error="form.errors.has('codigoRastreamentoEnvio')"
									:error="form.errors.get('codigoRastreamentoEnvio')"></input-text>
								<div class="content"><!-- LAST CHILD --></div>
							</div>
						</div>
					</div>
					<!-- TAB DADOS TÉCNICO -->
					<div v-show="activeTab == 3" v-if="form.id > 0 && !isUsuarioTecnico">
						<div class="columns">
							<div class="column is-half-desktop">
								<b-field grouped v-if="!form.tecnico && !isSituacaoCancelado">
									<div class="columns">
										<div class="column is-half-desktop">
											<b-field grouped position="is-left">
												<input-text name="raioKmBuscaEmpresa" type="number" min="0"
													v-model="parametros.raioKmBuscaEmpresa"
													placeholder="Raio da busca (km)"></input-text>
											</b-field>
										</div>
										<div class="column is-half-desktop">
											<b-field grouped position="is-right">
												<b-field>
													<button type="button" class="button is-outlined is-medium" 
														@click="buscarEmpresasProximas">
														<b-icon icon="map-marker-plus"></b-icon>
														<span v-html="'Buscar empresas pr&oacute;ximas'"></span>
													</button>
												</b-field>
											</b-field>
										</div>
									</div>
								</b-field>
								<!-- Mapa -->
								<here-maps ref="empresasMap" :value="markersEmpresas"
									:show-buscar-posiicao-button="false"
									v-if="!form.tecnico && activeTab == 3 && !isSituacaoCancelado">
								</here-maps>
								<div v-if="form.valorServico && form.tecnico" class="card">
									<div class="card-content">
										<div class="media">
											<div class="media-content">
												<p class="title is-4">
													Empresa: {{ form.valorServico.empresa.nome }}
												</p>
												<p class="subtitle is-8">
													<star-rating :inline="true" :star-size="20" 
														:read-only="true" :show-rating="true" 
														:rating="form.valorServico.empresa.classificacao">
													</star-rating>
												</p>
												<p class="subtitle is-8">
													Endereço: {{ (form.tecnico.atendeFora
														? form.tecnico.endereco
														: form.valorServico.empresa.endereco) | enderecoStr }}
												</p>
												<p class="subtitle is-8" v-if="isUsuarioCliente || isUsuarioMatrizFilial">
													Técnico: {{ form.tecnico.nome }}
												</p>
												<p class="subtitle is-8">
													Tempo previsto: {{ form.valorServico.tempoPrevisto | horaMinuto }}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="column is-half-desktop">
								<div class="field" v-if="!form.tecnico && !isSituacaoCancelado">
									<lista-empresas :list="empresasEncontradas"
										@selected="selectEmpresa"></lista-empresas>
									<b-modal ref="modalTecnicos"
										:active.sync="modalTecnicosActive" 
										:has-modal-card="true" :canCancel="['escape', 'outside']">
										<modal-tecnicos
											:idAgendamento="form.id"
											:valorServico="this.valorServicoSelected"
											:dataPreferida="this.form.dataPreferida"
											:horaPreferida="this.form.horaPreferida"
											:datePickerConfig="this.dataPreferidaConfig"
											@selected="selectTecnico"></modal-tecnicos>
									</b-modal>
								</div>
								<div class="field" v-if="form.valorServico && form.tecnico">
									<lista-contato v-bind:value="form.valorServico.empresa.contatos"
										:showRemoveButton="false"></lista-contato>
								</div>
							</div>
						</div>
					</div>
					<!-- TAB DADOS SERVIÇO -->
					<div v-show="activeTab == 4" v-if="form.id > 0">
						<div class="columns">
							<div class="column is-half-desktop">
								<input-text name="localInstalacao" 
									v-model="form.localInstalacao" size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									placeholder="Local de instalação do equipamento"
									:has-error="form.errors.has('localInstalacao')"
									:error="form.errors.get('localInstalacao')"></input-text>
								<input-autocomplete name="equipamento"
									ref="autocompleteEquipamento"
									size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									:url="urlAutocompleteEquipamento"
									:init-value="form.equipamento ? form.equipamento.numero : null"
									field="numero"
									subtitle="imei"
									field-label="Número"
									subtitle-label="IMEI"
									placeholder="Equipamento instalado neste serviço"
									:minlength="2"
									@selected="setEquipamento"
									:error="form.errors.get('equipamento')"></input-autocomplete>
								<input-autocomplete name="chip"
									ref="autocompleteChip"
									size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									:url="urlAutocompleteChip"
									:init-value="form.chip ? form.chip.telefone : null"
									field="telefone"
									subtitle="imei"
									field-label="Telefone"
									subtitle-label="IMEI"
									placeholder="Chip instalado neste serviço"
									:minlength="2"
									@selected="setChip"
									:error="form.errors.get('chip')"></input-autocomplete>
								<b-field label="Devolver equipamento ou chip">
									<b-switch name="devolverItens"
										:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
										v-model="form.devolverItens">
									</b-switch>
								</b-field>
								<input-autocomplete v-show="form.devolverItens"
									name="equipamentoRemovido"
									ref="autocompleteEquipamentoRemovido"
									size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									:url="urlAutocompleteEquipamentoRemovido"
									:init-value="form.equipamentoRemovido ? form.equipamentoRemovido.numero : null"
									field="numero"
									subtitle="imei"
									field-label="Número"
									subtitle-label="IMEI"
									placeholder="Equipamento removido neste serviço"
									:minlength="2"
									@selected="setEquipamentoRemovido"
									:error="form.errors.get('equipamentoRemovido')"></input-autocomplete>
								<input-autocomplete v-show="form.devolverItens"
									name="chipRemovido"
									ref="autocompleteChipRemovido"
									size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									:url="urlAutocompleteChipRemovido"
									:init-value="form.chipRemovido ? form.chipRemovido.telefone : null"
									field="telefone"
									subtitle="imei"
									field-label="Telefone"
									subtitle-label="IMEI"
									placeholder="Chip removido neste serviço"
									:minlength="2"
									@selected="setChipRemovido"
									:error="form.errors.get('chipRemovido')"></input-autocomplete>
								<input-text v-show="form.devolverItens"
									name="codigoRastreamentoDevolucao" 
									v-model="form.codigoRastreamentoDevolucao" size="is-medium"
									:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
									placeholder="Código de rastreio da devolução"
									:has-error="form.errors.has('codigoRastreamentoDevolucao')"
									:error="form.errors.get('codigoRastreamentoDevolucao')"></input-text>
								<b-field label="Os testes foram realizados?" expanded>
									<b-field position="is-left">
										<b-radio-button v-model="form.testeRealizado"
											:native-value="false"
											:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
											type="is-danger" size="is-medium">
											<b-icon icon="close"></b-icon>
											<span>Não</span>
										</b-radio-button>
										<b-radio-button v-model="form.testeRealizado"
											:native-value="true"
											:disabled="isSituacaoConcluido || isSituacaoCancelado || isUsuarioCliente"
											type="is-success" size="is-medium">
											<b-icon icon="check"></b-icon>
											<span>Sim</span>
										</b-radio-button>
									</b-field>
								</b-field>
								<input-text name="motivoNaoTestado" type="textarea" maxlength="254"
									v-show="!form.testeRealizado" :has-counter="true"
									v-model="form.motivoNaoTestado" size="is-medium"
									:disabled="isUsuarioCliente"
									placeholder="Motivo de não realização dos testes"
									:has-error="form.errors.has('motivoNaoTestado')"
									:error="form.errors.get('motivoNaoTestado')"></input-text>
							</div>
							<div class="column is-half-desktop">
								<b-field v-if="(isUsuarioMatrizFilial || isUsuarioTecnico || isUsuarioEmpresa) 
									&& !(isSituacaoConcluido || isSituacaoCancelado)"
									position="is-centered">
									<button type="button" class="button is-large"
										@click="showModalTirarFoto">
										<b-icon icon="camera" size="is-medium"></b-icon>
										<span>Tirar foto do serviço</span>
									</button>
									<b-modal ref="modalTirarFoto"
										:active.sync="modalTirarFotoActive">
										<modal-tirar-foto :idAgendamento="form.id"
											@sent="addFoto($event)"></modal-tirar-foto>
									</b-modal>
									<b-modal ref="modalFotoEndereco"
										:active.sync="modalFotoEnderecoActive">
										<modal-foto-endereco :endereco.sync="enderecoFotoTemp"></modal-foto-endereco>
									</b-modal>
								</b-field>
								<!-- FOTO UPLOAD -->
								<b-field v-if="isUsuarioMatrizFilial && !(isSituacaoConcluido || isSituacaoCancelado)"
									has-addons position="is-centered" style="text-align:center;">
									<fotos-upload :idAgendamento="form.id"
										@sent="addFoto($event)"></fotos-upload>
									<div class="control"><!-- SPACE --></div>
								</b-field>
								<h2 class="subtitle">Fotos salvas</h2>
								<b-field v-show="fotos.length > 0">
									<b-field grouped group-multiline position="is-centered">
										<div v-for="(foto, indexFoto) in fotos" :key="indexFoto" 
											class="control card">
											<div class="card-content">
												<div class="content">
													<a title="Clique para visualizar"
														@click="visualizarFoto(foto.id)">
														<figure class="image thumbnail">
															<img :src="getUrlFotoThumbnail(foto.id)">
														</figure>
													</a>
												</div>
											</div>
											<footer class="card-footer" v-if="!isUsuarioCliente && !(isSituacaoConcluido || isSituacaoCancelado)">
												<a class="card-footer-item button is-danger is-outlined"
													@click.prevent="excluirFoto(foto.id)" title="Apagar">
													<b-icon icon="delete"></b-icon>
												</a>
												<a class="card-footer-item button is-info is-outlined"
													:disabled="!foto.endereco"
													@click.prevent="showModalFotoEndereco(foto.endereco)" title="Localização">
													<b-icon icon="map-marker"></b-icon>
												</a>
											</footer>
										</div>
									</b-field>
								</b-field>
							</div>
						</div>
					</div>
					<!-- TAB DADOS CUSTOS -->
					<div v-show="activeTab == 5">
						<div class="columns">
							<div class="column is-half-desktop">
								<input-text name="valorVenda" 
									v-if="form.valorServico && (isUsuarioMatrizFilial || isUsuarioCliente)"
									v-model="form.valorServico.valorVenda" 
									@input="updateCustoServico($event)"
									:disabled="(isSituacaoConcluido || isSituacaoCancelado) || !isUsuarioMatrizFilial"
									size="is-medium"
									placeholder="Valor do serviço para o cliente"
									:is-money="true"
									:has-error="form.errors.has('valorVenda')"
									:error="form.errors.get('valorVenda')"></input-text>
								<input-text name="valorCusto" 
									v-if="form.valorServico && (isUsuarioMatrizFilial)"
									v-model="form.valorServico.valorCusto"
									:disabled="(isSituacaoConcluido || isSituacaoCancelado) || !isUsuarioMatrizFilial"
									size="is-medium"
									placeholder="Valor do serviço para o técnico"
									:is-money="true"
									:has-error="form.errors.has('valorCusto')"
									:error="form.errors.get('valorCusto')"></input-text>
								<label class="label">Custos do serviço</label>
								<lista-custo v-model="custos"
									:show-remove-button="false">
								</lista-custo>
							</div>
							<div class="column is-half-desktop">
								<label class="label">Custos adicionais</label>
								<input-custo name="custoAdicional" 
									v-if="isUsuarioMatrizFilial && !(isSituacaoConcluido || isSituacaoCancelado)"
									v-on:add="addCustoAdicional($event)"
									size="is-medium"
									:has-error="form.errors.has('custoAdicional')"
									:error="form.errors.get('custoAdicional')"></input-custo>
								<lista-custo v-model="form.custosAdicionais"
									:show-remove-button="isUsuarioMatrizFilial && !(isSituacaoConcluido || isSituacaoCancelado)">
								</lista-custo>
							</div>
						</div>
						<!-- Notas fiscais 
						<div v-if="form.valorServico && form.valorServico.empresa">
							<h2 class="subtitle">Notas fiscais</h2>
							<div class="columns">
								<div class="column is-half-desktop"
									v-if="!isUsuarioCliente">
									<input-text name="numeroNfEmpresa" 
										v-model="form.numeroNfEmpresa" size="is-medium" type="tel"
										:placeholder="`Número NF da ${form.valorServico.empresa.nome}`"
										:maxlength="48"
										:disabled="isUsuarioCliente"
										:has-error="form.errors.has('numeroNfEmpresa')"
										:error="form.errors.get('numeroNfEmpresa')"></input-text>
								</div>
								<div class="column is-half-desktop"
									v-if="isUsuarioMatrizFilial || isUsuarioCliente">
									<input-text name="numeroNfMatrizfilial" 
										v-model="form.numeroNfMatrizfilial" size="is-medium" type="tel"
										:placeholder="`Número NF da GTS`"
										:maxlength="48"
										:disabled="!isUsuarioMatrizFilial"
										:has-error="form.errors.has('numeroNfMatrizfilial')"
										:error="form.errors.get('numeroNfMatrizfilial')"></input-text>
								</div>
							</div>
						</div> -->
					</div>
					<!-- TAB OBSERVAÇÕES -->
					<div v-show="activeTab == 6">
						<div class="columns" v-if="!(isSituacaoCancelado || isSituacaoConcluido)">
							<div class="column is-fullwidth">
								<!-- Observacoes -->
								<h2 class="subtitle">Nova observação</h2>
								<input-text name="novaObservacao" type="textarea" 
									maxlength="65536" :has-counter="true"
									v-model.lazy="novaObservacao"
									:disabled="isUsuarioCliente"
									placeholder="" label=""
									:has-error="form.errors.has('novaObservacao')"
									:error="form.errors.get('novaObservacao')"></input-text>
								<b-field grouped position="is-right">
									<button type="button" title="Enviar" :disabled="!novaObservacao"
										class="button is-medium button-round-medium is-success"
										:class="{ 'is-loading': form.isLoading }"
										@click="sendObservacao(null)">
										<b-icon icon="send"></b-icon>
									</button>
								</b-field>
							</div>
						</div>
						<div class="columns">
							<div class="column is-fullwidth">
								<b-field v-for="(obs, indexObs) in observacoes" :key="indexObs"
									class="observacao-message" grouped
									:position="isCurrentUser(obs.usuarioId) ? 'is-right' : 'is-left'">
									<article :class="['message', 'control', getMessageColor(obs.usuarioClasse)]">
										<div class="message-header">
											<p>
												{{ `${obs.usuarioNome} escreveu ${$options.filters.timeAgo(obs.dataHoraCadastro)}:` }}
											</p>
											<p v-html="'&nbsp;'"></p>
											<!-- <button type="button" 
												v-if="isCurrentUser(obs.usuarioId)"
												:class="[getMessageColor(obs.usuarioClasse), 'button', 'button-round-small']">
												<b-icon icon="pencil" type="is-white" size="is-small"></b-icon>
											</button> -->
											<button type="button" class="delete" aria-label="delete"
												v-if="isCurrentUser(obs.usuarioId)"
												@click="deleteObservacao(obs.id)"></button>
										</div>
										<div class="message-body">
											{{ obs.texto }}
										</div>
									</article>
								</b-field>
							</div>
						</div>
					</div>
					<!-- Botões -->
					<div class="content"><!-- SPACE --></div>
					<div class="content"><!-- SPACE --></div>
					<div class="field has-addons has-addons-right"
						v-show="activeTab != 6">
						<div class="control">
							<button type="button" class="button is-primary is-medium"
								:class="{ 'is-loading': form.isLoading }"
								@click="onSubmit"
								@dblclick.prevent>
								Salvar
							</button>
						</div>
					</div>
				</form>
			</b-message>
		</div>
	</div>
</template>

<script>
import GlobalFilters from '../../components/GlobalFilters.js';
import DropdownAgendamentoAcoes from './components-agendamento/DropdownAgendamentoAcoes.vue';
import ListaEmpresas from './components-agendamento/ListaEmpresas.vue';
import ModalTecnicos from './components-agendamento/ModalTecnicos.vue';
import ModalTirarFoto from './components-agendamento/ModalTirarFoto.vue';
import FotosUpload from './components-agendamento/FotosUpload.vue';
import ModalFotoEndereco from './components-agendamento/ModalFotoEndereco.vue';
import InputAutocomplete from '../../components/InputAutocomplete.vue';
import InputContato from '../../components/InputContato.vue';
import ListaContato from '../../components/ListaContato.vue';
import InputCusto from '../../components/InputCusto.vue';
import ListaCusto from '../../components/ListaCusto.vue';
import Endereco from '../../core/Endereco.js';
import FormEndereco from '../../components/FormEndereco.vue';
import HereMaps from '../../components/HereMaps.vue';
import DateTimePicker from '../../components/DateTimePicker.vue';
import StarRating from 'vue-star-rating';
import 'moment/locale/pt-br.js';
import { mapGetters, mapActions } from 'vuex';

let moment = require('moment-business-days');
moment.updateLocale('pt-br', {
	workingWeekdays: [1,2,3,4,5]
});

export default {
	mixins: [ GlobalFilters ],
	components: {
		DateTimePicker, InputAutocomplete, InputContato, ListaContato, HereMaps, FormEndereco,
		InputCusto, ListaCusto, DropdownAgendamentoAcoes, ListaEmpresas, ModalTecnicos, 
		ModalTirarFoto, ModalFotoEndereco, FotosUpload, StarRating
	},
	data() {
		return {
			form: new Form({
				id: null,
				situacao: {id: null, descricao: null},
				tipoServico: {id: null, descricao: null},
				operadora: {id: null, descricao: null},
				marcaEquipamento: {id: null, descricao: null},
				modeloEquipamento: {id: null, descricao: null},
				corVeiculo: {id: null, descricao: null},
				cliente: null,
				tecnico: null,
				empresa: null, 
				beneficiario: '',
				placaVeiculo: '',
				marcaVeiculo: {},
				modeloVeiculo: null,
				enviarChip: false,
				enviarEquipamento: false,
				destinatarioEnvio: 'tecnico',
				chip: null,
				equipamento: null,
				chipRemovido: null,
				equipamentoRemovido: null,
				localInstalacao: '',
				testeRealizado: false,
				motivoCancelamento: '',
				motivoReabertura: '',
				motivoNaoTestado: '',
				devolverItens: false,
				codigoRastreamentoEnvio: '',
				codigoRastreamentoDevolucao: '',
				// numeroNfEmpresa: '',
				// numeroNfMatrizfilial: '',
				dataHoraCadastro: '',
				dataPreferida: '',
				horaPreferida: '',
				dataAgendamento: '',
				horaAgendamento: '',
				dataHoraConclusao: '',
				contatos: [],
				custosAdicionais: [],
				endereco: {},
				valorServico: {}
			}),
			activeTab: 1,
			custos: [],
			empresas: [],
			fotos: [],
			empresasEncontradas: [],
			modalTecnicosActive: false,
			modalTirarFotoActive: false,
			modalFotoEnderecoActive: false,
			enderecoFotoTemp: null,
			valorServicoSelected: null,
			dataPreferidaDatepickerDisabled: {},
			markersSolicitante: [],
			markersEmpresas: [],
			novaObservacao: '',
			observacoes: [],
			parametros: {}
		}
	},
	computed: {
		...mapGetters([
			'dadosUsuario',
			'isUsuarioMatrizFilial',
			'isUsuarioCliente',
			'isUsuarioEmpresa',
			'isUsuarioTecnico',
			'situacaoAgendamento'
		]),
		
		marcaEquipamento() {
			return this.form.marcaEquipamento ? this.form.marcaEquipamento.id : null;
		},

		modeloEquipamento() {
			return this.form.modeloEquipamento ? this.form.modeloEquipamento.id : null;
		},
		
		operadora() {
			return this.form.operadora ? this.form.operadora.id : null;
		},

		dataDisabledParameters() {
			return this.dataPreferidaDatepickerDisabled;
		},

		dataPreferida() {
			return moment(this.form.dataPreferida).format('YYYY-MM-DD');
		},

		dataPreferidaConfig() {
			return {
				wrap: true,
				dateFormat: 'Y-m-d', 
				altInput: true,
				altFormat: 'l, j F, Y',
				disable: [ this.dataDisabledParameters ]
			}
		},

		horaPreferidaConfig() {
			return {
				wrap: true,
				dateFormat: 'H:i:S', 
				altInput: true,
				altFormat: 'H:i',
				noCalendar: true, 
				enableTime: true, 
				enableSeconds: false,
				time_24hr: true
			}
		},

		isSituacaoAberto() {
			return this.situacaoAgendamento.ABERTO == this.form.situacao.id || this.form.situacao.id == null;
		},

		isSituacaoAguardandoAgendamento() {
			return this.situacaoAgendamento.AGUARDANDO_CONFIRMACAO == this.form.situacao.id;
		},

		isSituacaoAgendado() {
			return this.situacaoAgendamento.AGENDADO == this.form.situacao.id;
		},

		isSituacaoEmAtendimento() {
			return this.situacaoAgendamento.EM_ATENDIMENTO == this.form.situacao.id;
		},

		isSituacaoCancelado() {
			return this.situacaoAgendamento.CANCELADO == this.form.situacao.id;
		},

		isSituacaoRemarcado() {
			return this.situacaoAgendamento.REMARCADO == this.form.situacao.id;
		},

		isSituacaoRealizado() {
			return this.situacaoAgendamento.REALIZADO == this.form.situacao.id;
		},

		isSituacaoConcluido() {
			return this.situacaoAgendamento.CONCLUIDO == this.form.situacao.id;
		},

		urlAutocompleteCliente() {
			return '/cliente/findLike';
		},
		
		urlAutocompleteMarcaVeiculo() {
			return '/marcaModeloVeiculo/findLikeMarca';
		},
		
		urlAutocompleteModeloVeiculo() {
			return `/marcaModeloVeiculo/findLikeModelo/${(this.form.marcaVeiculo ? this.form.marcaVeiculo.id : '0') || ''}`;
		},

		urlAutocompleteChip() {
			return `/estoque/findLike/chip/${this.operadora || 0}/disponivel`;
		},

		urlAutocompleteEquipamento() {
			return `/estoque/findLike/equipamento/${this.modeloEquipamento || 0}/disponivel`;
		},
		
		urlAutocompleteChipRemovido() {
			return `/estoque/findLike/chip/${this.operadora || 0}/vinculado`;
		},

		urlAutocompleteEquipamentoRemovido() {
			return `/estoque/findLike/equipamento/${this.modeloEquipamento || 0}/vinculado`;
		}
	},

	methods: {
		...mapActions([
			'salvarObservacao',
			'excluirObservacao'
		]),

		addCustoAdicional(custo) {
			this.form.custosAdicionais.push(custo);
			this.form.errors.clear('custoAdicional');
		},
		
		atualizaEnderecoPosicao(posicao) {
			this.form.endereco.posicao = { latitude: posicao.lat, longitude: posicao.lng };
		},

		buscarEnderecoPosicao() {
			this.$emit('change', 'posicao', 'endereco');

			// busca a posição para o endereço
			if (this.form.endereco.toMapString() != '') {
				this.$refs.clienteMap.searchPositionForAddress(this.form.endereco.toMapString())
				.then(response => {
					// adiciona o marcador
					let marker = {
						position: {
							lat: response.Latitude,
							lng: response.Longitude
						},
						draggable: true
					};
					this.$refs.clienteMap.addUniqueMarker(null, marker);
					this.markersSolicitante = [];
					this.markersSolicitante.push(marker);
					this.$emit('change', 'posicao', 'endereco');
				})
				.catch(response => {
				});
			}
		},

		buscarEmpresasProximas() {
			if (this.form.endereco && this.form.endereco.posicao) {
				let posicao = this.form.endereco.posicao;
				let raio = this.parametros.raioKmBuscaEmpresa;
				this.axios.get('/empresa/buscarProximas/' + 
					`${this.form.tipoServico.id}/` +
					`${posicao.latitude}/${posicao.longitude}/${raio}`)
				.then(response => {
					this.empresasEncontradas = response.data;
					let count = 1;
					// Percorre cada empresa para adicionar seu ponto no mapa
					for (let valorServico of response.data) {
						this.addEmpresaMarker(valorServico, count);
						count++;
					}	
				})
				.catch(error => {
					this.$toast.open({
						message: error.message ? error.message : 'Erro ao buscar empresas próximas.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				});
			}
		},

		addEmpresaMarker(valorServico, count) {
			// Obtém a classificação na base 10
			let classificacao = Math.round(valorServico.empresa.classificacao) * 2;
			// Cria os dados do marcador
			let marker = {
				position: {
					lat: valorServico.empresa.endereco.posicao.latitude,
					lng: valorServico.empresa.endereco.posicao.longitude
				},
				draggable: false,
				icon: this.$refs.empresasMap.getMarkerIcon(`classificacao${classificacao}/number_${count}`)
			};
			// Adiciona o marcador ao mapa
			this.$refs.empresasMap.addMarker(null, marker);
			// Remove todos os elementos exceto o primeiro, que é o marcador do solicitante
			this.markersEmpresas.splice(1, this.markersEmpresas.length-1);
			// Salva os dados do marcador num array
			this.markersEmpresas.push(marker);
		},

		changeEnviarChip() {
			if (!this.form.enviarChip) {
				this.form.operadora = {id: null, descricao: null};
			}
			this.dataPreferidaDisableByParametros();
		},

		changeEnviarEquipamento() {
			if (!this.form.enviarEquipamento) {
				this.form.marcaEquipamento = {id: null, descricao: null};
				this.form.modeloEquipamento = {id: null, descricao: null};
			}
			this.dataPreferidaDisableByParametros();
		},
		
		/**
		 * Verifica os parâmetros do sistema e calcula a data até onde o calendário ficará desabilitado.
		 */
		dataPreferidaDisableByParametros() {
			if (!this.isUsuarioMatrizFilial) {
				let start = moment();
				if (this.form.enviarChip || this.form.enviarEquipamento) {
					let diasAntecedencia = this.parametros.diasAntecedenciaAgendamentoComEnvio;
					switch (this.parametros.tipoAntecedenciaAgendamentoComEnvio) {
						case 'DIAS_UTEIS': 
							start = start.businessAdd(diasAntecedencia);
							break;
						case 'DIAS_CORRIDOS':
							start = start.add(diasAntecedencia, 'days');
							break;
					}
				}
				else {
					let diasAntecedencia = this.parametros.diasAntecedenciaAgendamentoSemEnvio;
					switch (this.parametros.tipoAntecedenciaAgendamentoSemEnvio) {
						case 'DIAS_UTEIS': 
							start = start.businessAdd(diasAntecedencia);
							break;
						case 'DIAS_CORRIDOS':
							start = start.add(diasAntecedencia, 'days');
							break;
					}
				}
				this.$set(this.dataPreferidaDatepickerDisabled, 'from', '1970-01-01');
				this.$set(this.dataPreferidaDatepickerDisabled, 'to', start.format('YYYY-MM-DD'));
			}
		},

		/**
		 * Obtém a cor da mensagem-observação de acordo com a classe do usuário.
		 */
		getMessageColor(usuarioClasse) {
			return usuarioClasse == 'tbmatrizfilial' ? 'is-dark'
				: usuarioClasse == 'tbcliente' ? 'is-blue'
				: usuarioClasse == 'tbempresa' ? 'is-green'
				: usuarioClasse == 'tbtecnico' ? 'is-turquoise'
				: 'is-light';
		},

		/**
		 * Verifica se o usuarioId passado como parâmetro é igual ao id do usuário logado.
		 */
		isCurrentUser(usuarioId) {
			return this.dadosUsuario && this.dadosUsuario.id == usuarioId;
		},

		/**
		 * Ao selecionar uma valorServico da lista de empresas encontradas próximas
		 * busca e exibe os seu técnicos numa modal.
		 */
		selectEmpresa(valorServico) {
			if (typeof(valorServico) === 'object') {
				this.valorServicoSelected = valorServico;
				this.modalTecnicosActive = true;
				// Move o elemento da modal para a raiz do DOM
				this.$nextTick(function () {
					document.body.appendChild(this.$refs.modalTecnicos.$el);
				});
			}
		},

		/**
		 * Ao selecionar o técnico na modal-tecnico volta para a tela de listagem.
		 */
		selectTecnico() {
			this.modalTecnicosActive = false;
			this.$nextTick(function () {
				this.$router.push('/lista-agendamento');
			});
		},

		/**
		 * Exibe a modal de tirar foto e move seu elemento para a raiz do body.
		 */
		showModalTirarFoto() {
			this.modalTirarFotoActive = true;
			this.$nextTick(function () {
				document.body.appendChild(this.$refs.modalTirarFoto.$el);
			});
		},
		showModalFotoEndereco(endereco) {
			if (endereco != null) {
				this.modalFotoEnderecoActive = true;
				this.enderecoFotoTemp = endereco;
				this.$nextTick(function () {
					document.body.appendChild(this.$refs.modalFotoEndereco.$el);
				});
			}
		},
		
		// Atualiza o valor do serviço na tabela Custos a partir do campo valorVenda
		updateCustoServico(val) {
			let i = _.findIndex(this.custos, function(c) { return c.tipo == 'servico'; });
			if (i >= 0) {
				this.custos[i].valor = val;
			}
		},

		getValorMedioServico(idTipoServico) {
			if (idTipoServico > 0 && this.isSituacaoAberto) {
				this.axios.get(`/agendamento/obterMediaValorServico/${idTipoServico}`)
				.then(response => {
					// Adiciona o valor médio do serviço à tabela de custos
					let custo = {
						id: 0,
						descricao: 'Serviço (valor médio)',
						valor: parseFloat(response.data.mediaValorVenda),
						tipo: 'servico'
					};
					let i = _.findIndex(this.custos, function(c) { return c.tipo == 'servico'; });
					if (i >= 0) {
						this.custos.splice(i, 1);
						this.custos[i] = custo;
					} else {
						this.custos.push(custo);
					}
				})
				.catch(error => {
					let i = _.findIndex(this.custos, function(c) { return c.tipo == 'servico'; });
					if (i >= 0) {
						this.custos.splice(i, 1);
					}
					if (error.response.data) {
						this.$toast.open({
							message: error.response.data.message ? error.response.data.message : 'Erro ao obter valor médio do servico.',
							type: 'is-warning',
							position: 'is-top',
							duration: 5000
						});
					}
				})
			}
		},

		getEstoqueValorVenda(classe, idSubtipo) {
			return new Promise((resolve, reject) => {
				this.axios.get(`/agendamento/obterEstoqueValorVenda/${classe}/${idSubtipo}`)
				.then(response => {
					resolve(response.data);
				})
				.catch(error => {
					if (error.response.data) {
						this.$toast.open({
							message: error.response.data.message ? error.response.data.message : 'Erro ao procurar por item no estoque.',
							type: 'is-warning',
							position: 'is-top',
							duration: 5000
						});
					}
					reject(null);
				});
			});
		},

		marcaEquipamentoChanged() {
			this.form.modeloEquipamento = {id: null, descricao: null};
		},

		// Define o objeto do cliente recebido ou selecionado
		setCliente(obj) {
			if (obj && obj.id > 0) {
				this.form.cliente = obj;
			}
		},

		// Define o objeto do marcaVeiculo recebido ou selecionado
		setMarcaVeiculo(obj) {
			if (obj && obj.id > 0) {
				this.form.marcaVeiculo = obj;
				this.form.modeloVeiculo = null;
			}
		},

		// Define o objeto do modeloVeiculo recebido ou selecionado
		setModeloVeiculo(obj) {
			if (obj && obj.id > 0) {
				this.form.modeloVeiculo = obj;
			}
		},

		// Define o objeto do chip recebido ou selecionado
		setChip(obj) {
			if (obj && obj.id > 0) {
				this.form.chip = obj;

				let custo = {
					id: obj.id,
					descricao: 'Chip: ' + `${obj.operadora.descricao || ''}`,
					valor: obj.valorVenda,
					tipo: 'chip'
				};
				let i = _.findIndex(this.custos, function(c) { return c.tipo == 'chip'; });
				if (i >= 0) {
					this.custos.splice(i, 1);
					this.custos[i] = custo;
				} else {
					this.custos.push(custo);
				}
			}
		},

		// Define o objeto do equipamento recebido ou selecionado
		setEquipamento(obj) {
			if (obj && obj.id > 0) {
				this.form.equipamento = obj;

				let custo = {
					id: obj.id,
					descricao: 'Equipamento: ' + `${obj.marcaEquipamento.descricao || ''}`,
					valor: obj.valorVenda,
					tipo: 'equipamento'
				};
				let i = _.findIndex(this.custos, function(c) { return c.tipo == 'equipamento'; });
				if (i >= 0) {
					this.custos.splice(i, 1);
					this.custos[i] = custo;
				} else {
					this.custos.push(custo);
				}
			}
		},

		// Define o objeto do chipRemovido recebido ou selecionado
		setChipRemovido(obj) {
			if (obj && obj.id > 0) {
				this.form.chipRemovido = obj;
			}
		},

		// Define o objeto do equipamentoRemovido recebido ou selecionado
		setEquipamentoRemovido(obj) {
			if (obj && obj.id > 0) {
				this.form.equipamentoRemovido = obj;
			}
		},

		addFoto(foto) {
			this.fotos.push(foto);
		},
		getUrlFoto(idFoto) {
			return `${this.axios.defaults.baseURL}/foto/${idFoto}`;
		},
		getUrlFotoThumbnail(idFoto) {
			return `${this.axios.defaults.baseURL}/foto/thumbnail/${idFoto}`;
		},
		visualizarFoto(idFoto) {
			let vm = this;
			this.$modal.open(
				`<figure class="image">
					<img src="${vm.getUrlFoto(idFoto)}" alt="Aguarde o carregamento...">
				</figure>`
			);
		},
		excluirFoto(idFoto) {
			this.$dialog.confirm({
				message: 'Deseja apagar a foto?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-danger',
				onConfirm: () => {
					let vm = this;
					this.form.isLoading = true;
					this.axios.post('/agendamento/excluirFoto', {
						id: vm.form.id,
						idFoto: idFoto
					})
					.then(response => {
						vm.form.isLoading = false;
						if (response.data) {
							vm.$toast.open({
								message: response.data.message ? response.data.message : 'Foto apagada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
						}
						let i = _.findIndex(vm.fotos, function(c) { return c.id == response.data.idFoto; });
						if (i >= 0) {
							vm.fotos.splice(i, 1);
						}
						vm.$emit('update:fotos', vm.fotos);
					})
					.catch(error => {
						vm.form.isLoading = false;
						if (error.response && error.response.data) {
							vm.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao apagar a foto.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onConfirmarAgendamento() {
			this.$dialog.confirm({
				message: 'Deseja confirmar o agendamento?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-success',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/confirmarAgendamento', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Agendamento confirmado com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
						}
						this.$router.push('/lista-agendamento');
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao confirmar o agendamento.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onCancelarAgendamento() {
			this.$dialog.prompt({
				message: 'Deseja cancelar o agendamento? Informe o motivo: ',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-danger',
				inputAttrs: {
					placeholder: '',
					maxlength: 254
				},
				onConfirm: (value) => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/cancelarAgendamento', {
						id: this.form.id,
						motivoCancelamento: value
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Agendamento cancelado com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});

							// Reverte os dados para voltar o agendamento para ABERTO
							this.form.tecnico = null;
							this.form.empresa = null;
							this.form.situacao = response.data.situacao;
							this.form.dataPreferida = this.form.dataAgendamento;
							this.form.horaPreferida = this.form.horaAgendamento;
							this.form.dataAgendamento = null;
							this.form.horaAgendamento = null;
						}
						// Redireciona para intranet dependendo do usuário
						if (this.isUsuarioTecnico || this.isUsuarioEmpresa)
							this.$router.push('/intranet');
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao cancelar agendamento.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onIniciarOrdemServico() {
			this.$dialog.confirm({
				message: 'Deseja iniciar a ordem de serviço?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/iniciarOrdemServico', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Ordem de serviço iniciada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.form.situacao = response.data.situacao;
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao iniciar ordem de serviço.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onFinalizarOrdemServico() {
			this.$dialog.confirm({
				message: 'Deseja finalizar a ordem de serviço?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/finalizarOrdemServico', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Ordem de serviço finalizada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.form.situacao = response.data.situacao;
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao finalizar ordem de serviço.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onConcluirOrdemServico() {
			this.$dialog.confirm({
				message: 'Deseja concluir a ordem de serviço?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/concluir', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Ordem de serviço concluída com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.$router.push('/lista-agendamento');
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao concluir ordem de serviço.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onCancelarOrdemServico() {
			this.$dialog.confirm({
				message: 'Deseja cancelar o agendamento/ordem de serviço?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/agendamento/cancelar', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Ordem de serviço cancelada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.$router.push('/lista-agendamento');
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao cancelar ordem de serviço.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		sendObservacao(idObservacao = null) {
			this.form.isLoading = true;
			this.salvarObservacao({
				id: idObservacao,
				idAgendamento: this.form.id,
				texto: this.novaObservacao
			})
			.then(data => {
				this.form.isLoading = false;
				if (data) {
					this.novaObservacao = '';
					this.observacoes.unshift(data.observacao);
				}
			})
			.catch(error => {
				this.form.isLoading = false;
			});
		},

		deleteObservacao(idObservacao = null) {
			this.$dialog.confirm({
				message: 'Deseja excluir essa observação?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-danger',
				onConfirm: () => {
					this.form.isLoading = true;
					this.excluirObservacao({
						id: idObservacao,
						idAgendamento: this.form.id
					})
					.then(data => {
						this.form.isLoading = false;
						let i = _.findIndex(this.observacoes, function(o) { return o.id == idObservacao; });
						if (i >= 0) {
							this.observacoes.splice(i, 1);
						}
					})
					.catch(error => {
						this.form.isLoading = false;
					})
				}
			});
		},

		onSubmit() {
			this.form.post('/agendamento/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message : 'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.$router.push('/lista-agendamento');
				}
			})
			.catch(error => {
				if (error.message) {
					this.$toast.open({
						message: error.message ? error.message : 'Erro ao salvar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 10000
					});
				}
			});
		},

		setFormData(response, error) {
			if (error) {
				if (error.response.data){
					this.$toast.open({
						message: error.response.data.message ? error.response.data.message : 'Erro ao consultar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				}
			}
			else {
				this.activeTab = 0;
				this.form.reset();

				this.form.situacao = response.data.situacao;

				// Preenche os campos do this.form
				for (let field in _.omit(this.form.data(), 
					[ 'situacao','chip','equipamento','contatos','endereco','cliente','marcaVeiculo','modeloVeiculo'])) {
					// Corrige dados de id, descricao que ficam null
					if (field == 'tipoServico' && !response.data[field]) 
						this.form.tipoServico = {id: null, descricao: null};
					else if (field == 'operadora' && !response.data[field]) 
						this.form.operadora = {id: null, descricao: null};
					else if (field == 'marcaEquipamento' && !response.data[field]) 
						this.form.marcaEquipamento = {id: null, descricao: null};
					else if (field == 'modeloEquipamento' && !response.data[field]) 
						this.form.modeloEquipamento = {id: null, descricao: null};
					else if (field == 'corVeiculo' && !response.data[field]) 
						this.form.corVeiculo = {id: null, descricao: null};
					else
						this.form[field] = response.data[field];
				}

				// Formata os objetos contato
				this.form.contatos = this.form.loadContatos(response.data['contatos']);
				// Formata os objeto endereco
				this.form.endereco = this.form.loadEndereco(response.data['endereco']);
				// Recebe as observações
				this.observacoes = response.data.observacoes;

				// Marca o ponto do endereço no mapa
				if (response.data.endereco && response.data.endereco.posicao) {
					// adiciona o marcador
					let marker = {
						position: {
							lat: response.data.endereco.posicao.latitude,
							lng: response.data.endereco.posicao.longitude
						},
						draggable: true
					};
					this.markersSolicitante = [];
					this.markersSolicitante.push(marker);
					
					if (this.$refs.clienteMap 
					&& _.includes([this.situacaoAgendamento.ABERTO, this.situacaoAgendamento.REMARCADO],
						response.data.situacao.id)) {
						this.$refs.clienteMap.addUniqueMarker(null, marker);
					}
				}

				// Adiciona o valor do serviço a tabela de custos
				if (response.data.valorServico) {
					// Adiciona o valorServico a lista de empresas encontradas
					let custo = {
						id: response.data.valorServico.id,
						descricao: 'Serviço: ' + response.data.tipoServico.descricao,
						valor: response.data.valorServico.valorVenda,
						tipo: 'servico'
					};
					let i = _.findIndex(this.custos, function(c) { return c.tipo == 'servico'; });
					if (i >= 0) {
						this.custos.splice(i, 1);
						this.custos[i] = custo;
					} else {
						this.custos.push(custo);
					}
				}
				
				// Obtém as fotos do agendamento
				this.fotos = response.data.fotos || [];

				// Corrige o campo de horaPreferida
				if (!response.data.horaAgendamento) {
					this.form.horaPreferida = moment(response.data.horaPreferida).format('HH:mm:ss');
				}
				
				// Coloca no input autocomplete as descrições de marca e modelo do veículo
				this.setCliente(response.data.cliente);
				this.setMarcaVeiculo(response.data.marcaVeiculo);
				this.setModeloVeiculo(response.data.modeloVeiculo);
				this.setChip(response.data.chip);
				this.setEquipamento(response.data.equipamento);

				this.activeTab = 1;
			}
		}
	},

	filters: {
		date(str) {
			try {
				if (moment(str).isValid())
					return moment(str).format('ddd, D MMMM, YYYY');
				else 
					return str;
			}
			catch (Exception) {
				return str;
			}
		},
		time(str) {
			try {
				if (str.length == 8)
					return str.substr(0,5);
				else
					return moment(str).format('HH:mm');
			}
			catch (Exception) {
				return str;
			}
		},
		timeAgo(str) {
			try {
				return moment(str).calendar(moment());
			}
			catch (Exception) {
				return str;
			}
		}
	},

	watch: {
		// Verifica a aba atual e carrega o componente here-maps da aba 3 
		// com o marcador do endereço do solicitante
		activeTab: function(tab) {
			if (tab == 3) {
				if (Boolean(this.form.endereco.posicao) && this.markersEmpresas.length == 0) {
					// Adiciona o marcador do solicitante
					let marker = {
						position: {
							lat: this.form.endereco.posicao.latitude,
							lng: this.form.endereco.posicao.longitude
						},
						draggable: false
					};
					//this.markersSolicitante.push(marker);
					this.markersEmpresas.push(marker);
				}
			}
		},

		// Verifica se o modelo do equipamento foi alterado
		modeloEquipamento: function(val) {
			if (!Boolean(this.form.equipamento)) {
				if (val > 0) {
					this.getEstoqueValorVenda('equipamento', val)
					.then(response => {
						if (response.valorVenda) {
							let custo = {
								id: response.id,
								descricao: 'Equipamento: ' +
									`${response.marcaEquipamento.descricao || ''} ` +
									`${response.modeloEquipamento.descricao || ''}`,
								valor: response.valorVenda,
								tipo: 'equipamento'
							};
							let i = _.findIndex(this.custos, function(c) { return c.tipo == 'equipamento'; });
							if (i >= 0) {
								this.custos.splice(i, 1);
								this.custos[i] = custo;
							} else {
								this.custos.push(custo);
							}
						}
					})
					.catch(error => {
						this.form.modeloEquipamento = {id: null, descricao: null};
					});
				}
				else {
					let i = _.findIndex(this.custos, function(c) { return c.tipo == 'equipamento'; });
					if (i >= 0) {
						this.custos.splice(i, 1);
					}
				}
			}
		},

		// Verifica se a operadora do chip foi alterada
		operadora: function(val) {
			if (!Boolean(this.form.chip)) {
				if (val > 0) {
					this.getEstoqueValorVenda('chip', val)
					.then(response => {
						if (response.valorVenda) {
							let custo = {
								id: response.id,
								descricao: 'Chip: ' + `${response.operadora.descricao || ''}`,
								valor: response.valorVenda,
								tipo: 'chip'
							};
							let i = _.findIndex(this.custos, function(c) { return c.tipo == 'chip'; });
							if (i >= 0) {
								this.custos.splice(i, 1);
								this.custos[i] = custo;
							} else {
								this.custos.push(custo);
							}
						}
					})
					.catch(error => {
						this.form.operadora = {id: null, descricao: null};
					});
				}
				else {
					let i = _.findIndex(this.custos, function(c) { return c.tipo == 'chip'; });
					if (i >= 0) {
						this.custos.splice(i, 1);
					}
				}
			}
		}
	},

	created() {
		// Busca os parâmetros
		this.axios.get('/parametros/buscar')
		.then(response => {
			this.parametros = response.data;
			this.dataPreferidaDisableByParametros();
		})
		.catch(error => {
			if (error.response && error.response.data){
				this.$toast.open({
					message: error.response.data.message ? error.response.data.message : 'Erro ao carregar os parâmtros do sistema.',
					type: 'is-danger',
					position: 'is-top',
					duration: 5000
				});
			}
		});
	},

	beforeRouteEnter (to, from, next) {
		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			Vue.axios.get('/agendamento/findId/' + id)
			.then(response => {
				next(vm => { vm.setFormData(response, null) } );
			})
			.catch(error => {
				next(vm => { vm.setFormData(null, error) } );
			});
		} else {
			next(vm => { 
				vm.activeTab = 1;
				vm.form.reset();
				
				// Verifica se e usuário de técnico ou empresa e redireciona para intranet
				if (vm.isUsuarioTecnico || vm.isUsuarioEmpresa) {
					vm.$router.push('/lista-agendamento');
				}

				if (vm.$refs.clienteMap)
					vm.$refs.clienteMap.clearMarkers(); 

				// Verifica se o agendamento está sendo iniciado por um cliente
				if (vm.isUsuarioCliente) {
					vm.form.cliente = { id: vm.dadosUsuario.idObjeto };
				}
			});
		}
	},

	// Quando a route muda e este componente já está renderizado, a lógica é diferente
	beforeRouteUpdate (to, from, next) {
		this.activeTab = 1;
		this.form.reset();
		if (this.$refs.clienteMap)
			this.$refs.clienteMap.clearMarkers();
		
		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			this.axios.get('/agendamento/findId/' + id)
			.then(response => {
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.setFormData(null, error);
				next();
			});
		} else {
			// Verifica se e usuário de técnico ou empresa e redireciona para intranet
			if (this.isUsuarioTecnico || this.isUsuarioEmpresa) {
				this.$router.push('/lista-agendamento');
			}

			// Verifica se o agendamento está sendo iniciado por um cliente
			if (this.isUsuarioCliente) {
				this.form.cliente = { id: this.dadosUsuario.idObjeto };
			}
			// Recarrega os select-ajax após uma consulta
			this.$refs.selectCorVeiculo.loadList();
			this.$refs.selectTipoServico.loadList();
			this.$refs.selectMarcaEquipamento.loadList();
			this.$refs.selectModeloEquipamento.loadList();
			this.$refs.selectOperadora.loadList();
			next();
		}
	}
}
</script>

<style type="scss" scoped>
.thumbnail {
	width: 120px;
	height: auto;
}

.title {
	word-break: break-word !important;
}
</style>