/**
 * ============================================================================
 * AGENTE INTELIGENTE "BRY" — LYZBRI LEGAL (V1)
 * Motor conversacional en el navegador para TEA y Discapacidad.
 * Protocolo 3, Nivel U3 (Interacción).
 * Cumple con Ley 1581 de 2012 (sin datos a terceros antes de pago)
 * y Ley 1123 de 2007 (orientación jurídica sin promesas de resultado).
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. CONFIGURACIÓN E INTERRUPTOR GENERAL (KILL-SWITCH)
  var AGENTE_BRY_CONFIG = {
    activo: true, // Kill-switch: cambiar a false desactiva Bry inmediatamente
    nombre: 'Bry',
    titulo: 'Bry',
    subtitulo: 'Tu asistente Legal Virtual',
    logoUrl: 'logo lyzbri.jpeg',
    avatarAgenteUrl: 'logo lyzbri.jpeg',
    tiempoRespuestaMs: 500, // Simulación de escritura empática
    servicioSoportado: 'tea', // V1: TEA y Discapacidad
  };

  // Verificación del interruptor (permite apagar por URL con ?bry=0 o config global)
  if (typeof window !== 'undefined') {
    if (window.LYZBRI_DESACTIVAR_BRY === true) AGENTE_BRY_CONFIG.activo = false;
    var params = new URLSearchParams(window.location.search);
    if (params.get('bry') === '0') AGENTE_BRY_CONFIG.activo = false;
  }

  if (!AGENTE_BRY_CONFIG.activo) {
    console.info('[Bry] Agente desactivado por interruptor (kill-switch). El wizard clásico permanece activo.');
    return;
  }

  // 2. CATÁLOGO DE TEXTOS Y EMPATÍA PARAMETRIZADA (MENSAJES_BRY)
  // Verbatim del documento: MAPA-PREGUNTAS-Y-GUION-BRY-tea-discapacidad-2026-10-07.md
  var MENSAJES_BRY = {
    saludo: 'Hola, soy **Bry**, tu asistente legal virtual. Estoy aquí para acompañarte con calma y sin complicaciones. Cuéntame, ¿en qué puedo ayudarte hoy?',
    intro_tea: 'Gracias por confiarme esto. Vamos paso a paso; son solo unas preguntas y, al final, te muestro una orientación inicial gratuita.',
    q_condicion: 'Para orientarte bien, cuéntame: ¿cuál es la condición o discapacidad de la persona? Lo que me compartas es confidencial.',
    q_subtipo_nv: 'Gracias por la confianza. Las discapacidades no visibles tienen la misma protección que cualquier otra. ¿Dirías que es más bien…?',
    q_area: 'Entiendo. ¿En qué área se está presentando la dificultad ahora mismo?',
    q_estado: '¿Y qué ha pasado hasta ahora con esta situación? Dime lo que más se parezca.',
    q_tutela_previa: 'Una pregunta importante para cuidarte jurídicamente: ¿ya habías presentado antes una acción de tutela por estos mismos hechos?',
    q_modalidad: 'Ya casi. ¿Cómo prefieres avanzar con el incidente de desacato?',
    contacto: 'Ya casi terminamos. Para mostrarte tu resultado y poder acompañarte, ¿me compartes tu nombre y tu WhatsApp? El correo es opcional.',
    consentimiento: 'Para continuar necesito tu autorización para tratar tus datos conforme a la Política de Tratamiento de Datos de Lyzbri. ¿Me la das?',
    resultado_intro: 'Con lo que me contaste, esto es lo que identifico para tu caso:',
    pago: 'Hemos guardado la información para tu caso. Cuando estés listo, podemos avanzar al pago seguro. ¿Deseas continuar?',
    fallback: 'Perdón, creo que no te estoy entendiendo bien y no quiero hacerte perder tiempo. ¿Prefieres que te muestre las opciones en el formulario de siempre, o que una persona del equipo te contacte?',
    alerta_temeridad: 'Gracias por decírmelo. Presentar otra tutela por los mismos hechos puede considerarse "temeridad" y traer consecuencias; por eso tu caso lo revisa una abogada antes de avanzar. Te acompañamos en ese paso.',

    ack_condicion: {
      tea: 'Gracias por contarme. El autismo está protegido por la Ley 2628 de 2026 (Ley TEA); nos apoyamos en ella.',
      neuro: 'Gracias. Los trastornos del neurodesarrollo también están cubiertos; cuidamos cada detalle de tu caso.',
      intelectual: 'Gracias por confiarme esto. El Síndrome de Down y la discapacidad intelectual tienen protección reforzada; seguimos.',
      fisica: 'Entiendo. La discapacidad física o motora está protegida por la Ley 361 de 1997 y la Ley 1618 de 2013.',
      visual: 'Gracias. Para la discapacidad visual la ley exige información accesible y ajustes según tu necesidad.',
      sordera: 'Gracias por contarme. La sordera y la sordoceguera tienen derecho a accesibilidad y ajustes, incluida la lengua de señas.',
      mudez: 'Gracias. Las barreras de comunicación están protegidas; el documento pedirá los apoyos que necesites.',
      no_visible: 'Gracias por la confianza. Las discapacidades no visibles tienen la misma protección que cualquier otra.'
    },

    ack_subtipo_nv: {
      psicosocial: 'Gracias por contarlo. Lo tendré en cuenta para citar la protección adecuada.',
      organica_sistemica: 'Gracias. Lo tendré en cuenta para citar la protección adecuada.'
    },

    ack_area: {
      salud: 'Vamos con el área de salud (EPS/IPS).',
      educacion: 'Vamos con el ámbito educativo.',
      deporte: 'Hablemos de lo que pasa en el deporte o el espacio público.',
      cuidado: 'Hablemos del derecho al cuidado.',
      otro: 'Entiendo, puede ser otra área o varias a la vez.'
    },

    ack_estado: {
      sin_gestion: 'Gracias. Como aún no hay una solicitud formal, el primer paso suele ser un derecho de petición; te lo explico en el resultado.',
      peticion_sin_respuesta: 'Entiendo lo frustrante que es no recibir respuesta. Eso abre la puerta a una acción de tutela.',
      tutela_incumplida: 'Lamento que no estén cumpliendo un fallo a tu favor. Para eso existe el incidente de desacato.',
      exclusion_directa: 'Gracias por contarlo. Antes de aceptar un cambio de colegio o actividad, tienes derecho a conocer el fundamento y qué ajustes se evaluaron.',
      acoso_no_investigado: 'Siento mucho que esté pasando por eso. Es importante dejar los hechos por escrito y pedir expresamente que se investiguen.',
      varias_areas: 'Entiendo. Cuando son varias áreas, conviene documentar cada frente por separado; te oriento en el resultado.'
    },

    ack_tutela_previa: {
      no: 'Perfecto, gracias.',
      si: 'Comprendido. Tomamos en cuenta la tutela previa para orientarte de forma segura.'
    },

    ack_modalidad: {
      autogestion: 'Listo: recibirás el documento listo para radicar, con instrucciones paso a paso.',
      acompanamiento: 'Listo: además, una abogada revisa y te acompaña en el proceso.'
    }
  };

  // 3. OPCIONES Y MAPAS EXACTOS DEL WIZARD (Garantiza Control C2 y C5)
  var OPCIONES_CONDICION = [
    { value: 'tea', label: 'Trastorno del espectro autista (TEA)', keys: ['tea', 'autismo', 'autista', 'asperger'] },
    { value: 'neuro', label: 'Otro trastorno del neurodesarrollo (TDAH, aprendizaje, Rett u otro)', keys: ['neuro', 'tdah', 'aprendizaje', 'rett'] },
    { value: 'intelectual', label: 'Síndrome de Down o discapacidad intelectual', keys: ['down', 'intelectual', 'sindrome'] },
    { value: 'fisica', label: 'Discapacidad física o motora', keys: ['fisica', 'motora', 'movilidad', 'silla'] },
    { value: 'visual', label: 'Discapacidad visual (ceguera o baja visión)', keys: ['visual', 'ciego', 'ceguera', 'vision'] },
    { value: 'sordera', label: 'Sordera o sordoceguera', keys: ['sordera', 'sordo', 'sordoceguera', 'auditiva'] },
    { value: 'mudez', label: 'Mudez', keys: ['mudez', 'mudo', 'habla'] },
    { value: 'no_visible', label: 'Discapacidad no visible (psicosocial, orgánica o crónica)', keys: ['no visible', 'invisible', 'psicosocial', 'cronica', 'organica'] }
  ];

  var OPCIONES_SUBTIPO_NV = [
    { value: 'psicosocial', label: 'Psicosocial (condición de salud mental con impacto funcional)', keys: ['psicosocial', 'mental', 'ansiedad', 'depresion'] },
    { value: 'organica_sistemica', label: 'Orgánica o sistémica (enfermedad crónica con impacto funcional)', keys: ['organica', 'sistemica', 'cronica', 'enfermedad'] }
  ];

  var OPCIONES_AREA = [
    { value: 'salud', label: 'Salud (EPS / IPS)', keys: ['salud', 'eps', 'ips', 'medico', 'cita', 'medicamento', 'terapia'] },
    { value: 'educacion', label: 'Educación (colegio)', keys: ['educacion', 'colegio', 'escuela', 'piar', 'profesor', 'estudio'] },
    { value: 'deporte', label: 'Deporte o espacio público', keys: ['deporte', 'parque', 'espacio publico', 'natacion', 'club'] },
    { value: 'cuidado', label: 'Derecho al cuidado (cuidador o asistencia personal)', keys: ['cuidado', 'cuidador', 'asistencia', 'enfermera'] },
    { value: 'otro', label: 'Otra área, o varias a la vez', keys: ['otro', 'otra', 'varias'] }
  ];

  var OPCIONES_ESTADO_POR_AREA = {
    salud: [
      { value: 'sin_gestion', label: 'Aún no he presentado ninguna solicitud formal', keys: ['no he presentado', 'nada formal', 'primera vez', 'sin gestion'] },
      { value: 'peticion_sin_respuesta', label: 'Ya presenté un derecho de petición, sin respuesta o con respuesta negativa/incompleta', keys: ['peticion', 'no me respondieron', 'sin respuesta', 'negaron'] },
      { value: 'tutela_incumplida', label: 'Ya tengo una tutela a mi favor y no la están cumpliendo', keys: ['tutela', 'incumplida', 'no cumplen', 'desacato', 'ya tengo tutela'] }
    ],
    educacion: [
      { value: 'sin_gestion', label: 'Aún no he presentado ninguna solicitud formal', keys: ['no he presentado', 'nada formal', 'sin gestion'] },
      { value: 'peticion_sin_respuesta', label: 'Ya presenté una solicitud o derecho de petición, sin respuesta o con respuesta negativa/incompleta', keys: ['peticion', 'sin respuesta', 'no contestan'] },
      { value: 'tutela_incumplida', label: 'Ya tengo una tutela a mi favor y el colegio no la está cumpliendo', keys: ['tutela', 'no cumplen', 'incumplida'] },
      { value: 'exclusion_directa', label: 'Han sugerido que mi hijo/a cambie de colegio o actividad', keys: ['cambio de colegio', 'excluir', 'exclusion', 'no lo reciben', 'echaron'] }
    ],
    deporte: [
      { value: 'sin_gestion', label: 'Aún no he presentado ninguna solicitud formal', keys: ['no he presentado', 'sin gestion'] },
      { value: 'peticion_sin_respuesta', label: 'Ya presenté una queja o PQRS, sin respuesta o con respuesta negativa/incompleta', keys: ['queja', 'pqrs', 'sin respuesta'] },
      { value: 'tutela_incumplida', label: 'Ya tengo una tutela a mi favor y no la están cumpliendo', keys: ['tutela', 'incumplida', 'no cumplen'] },
      { value: 'acoso_no_investigado', label: 'Mi hijo/a ha sido objeto de burlas o exclusión, y no se ha investigado', keys: ['burlas', 'acoso', 'bullying', 'exclusion', 'no investigan'] }
    ],
    cuidado: [
      { value: 'sin_gestion', label: 'Aún no he presentado ninguna solicitud formal', keys: ['no he presentado', 'sin gestion'] },
      { value: 'peticion_sin_respuesta', label: 'Ya presenté un derecho de petición, sin respuesta o con respuesta negativa/incompleta', keys: ['peticion', 'sin respuesta'] },
      { value: 'tutela_incumplida', label: 'Ya tengo una tutela a mi favor y no la están cumpliendo', keys: ['tutela', 'incumplida', 'no cumplen'] }
    ],
    otro: [
      { value: 'sin_gestion', label: 'No estoy segura de qué mecanismo legal aplica', keys: ['no estoy segura', 'no se', 'sin gestion'] },
      { value: 'peticion_sin_respuesta', label: 'Ya presenté una solicitud formal, sin respuesta o negativa', keys: ['solicitud', 'peticion', 'sin respuesta'] },
      { value: 'tutela_incumplida', label: 'Ya tengo una tutela a mi favor y no la están cumpliendo', keys: ['tutela', 'incumplida'] },
      { value: 'varias_areas', label: 'Es una combinación de varias áreas', keys: ['varias areas', 'combinacion', 'todo'] }
    ]
  };

  var OPCIONES_TUTELA_PREVIA = [
    { value: 'no', label: 'No, es la primera vez que presento tutela por estos hechos', keys: ['no', 'primera vez', 'nunca'] },
    { value: 'si', label: 'Sí, ya había presentado una tutela previamente', keys: ['si', 'ya habia presentado', 'anterior'] }
  ];

  var OPCIONES_MODALIDAD_DESACATO = [
    { value: 'autogestion', label: 'Autogestión: recibo el documento listo para radicar ($99.000)', keys: ['autogestion', 'documento listo', '99000', '99'] },
    { value: 'acompanamiento', label: 'Con acompañamiento de abogada ($600.000)', keys: ['acompanamiento', 'abogada', '600000', '600'] }
  ];

  // 4. MOTOR CONVERSACIONAL DE BRY
  function AgenteBry(hostElement) {
    this.host = hostElement;
    this.respuestas = {
      tea_condicion: null,
      tea_subtipo_nv: null,
      tea_area: null,
      tea_estado: null,
      tutela_previa: null,
      tea_modalidad: null,
      nombre: '',
      whatsapp: '',
      correo: '',
      consiente: false
    };
    this.pasoActual = 'INICIO';
    this.fallosConsecutivos = 0;
    this.inicializarUI();
  }

  AgenteBry.prototype.inicializarUI = function () {
    var self = this;
    this.host.innerHTML = '';

    // Estructura HTML de Bry
    var container = document.createElement('div');
    container.className = 'bry-container';
    container.id = 'bry-chat-app';

    // Encabezado
    var header = document.createElement('header');
    header.className = 'bry-header';
    header.innerHTML =
      '<div class="bry-brand-wrapper">' +
        '<img src="' + AGENTE_BRY_CONFIG.logoUrl + '" alt="Lyzbri Soluciones Legales" class="bry-header-logo" onerror="this.style.display=\'none\';">' +
        '<div class="bry-brand-title">Lyzbri</div>' +
        '<div class="bry-brand-subtitle">Soluciones legales digitales</div>' +
        '<div class="bry-agent-badge"><span class="bry-status-dot"></span> ' + AGENTE_BRY_CONFIG.nombre + ' · ' + AGENTE_BRY_CONFIG.subtitulo + '</div>' +
      '</div>';
    container.appendChild(header);

    // Contenedor de mensajes
    this.chatBody = document.createElement('div');
    this.chatBody.className = 'bry-chat-messages';
    this.chatBody.setAttribute('role', 'log');
    this.chatBody.setAttribute('aria-live', 'polite');
    container.appendChild(this.chatBody);

    // Barra de entrada inferior (según interfaz.jpeg)
    var inputBar = document.createElement('div');
    inputBar.className = 'bry-chat-input-bar';
    inputBar.innerHTML =
      '<div class="bry-pill-input-wrapper">' +
        '<input type="text" class="bry-input-text" id="bry-user-input" placeholder="Escribe tu mensaje..." aria-label="Mensaje para Bry">' +
        '<button type="button" class="bry-icon-btn bry-icon-send" id="bry-btn-send" title="Enviar">' +
          '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>' +
        '</button>' +
        '<button type="button" class="bry-icon-btn bry-icon-disabled" id="bry-btn-clip" title="Adjuntar documento (Disponible pronto)">' +
          '<svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>' +
        '</button>' +
        '<button type="button" class="bry-icon-btn bry-icon-disabled" id="bry-btn-mic" title="Mensaje de voz (Disponible pronto)">' +
          '<svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>' +
        '</button>' +
      '</div>' +
      '<div class="bry-tooltip" id="bry-media-tooltip">Disponible próximamente</div>';
    container.appendChild(inputBar);

    this.host.appendChild(container);

    // Enlaces de eventos
    this.inputElement = container.querySelector('#bry-user-input');
    this.sendBtn = container.querySelector('#bry-btn-send');
    this.clipBtn = container.querySelector('#bry-btn-clip');
    this.micBtn = container.querySelector('#bry-btn-mic');
    this.tooltip = container.querySelector('#bry-media-tooltip');

    this.sendBtn.addEventListener('click', function () { self.manejarTextoUsuario(); });
    this.inputElement.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        self.manejarTextoUsuario();
      }
    });

    // Tooltip para iconos deshabilitados (Ley 1581)
    var mostrarTooltip = function (e) {
      self.tooltip.textContent = 'Disponible próximamente en la siguiente fase';
      self.tooltip.classList.add('bry-tooltip-visible');
      setTimeout(function () { self.tooltip.classList.remove('bry-tooltip-visible'); }, 2200);
    };
    this.clipBtn.addEventListener('click', mostrarTooltip);
    this.micBtn.addEventListener('click', mostrarTooltip);

    // Iniciar flujo conversacional
    this.iniciarConversacion();
  };

  // Renderizar burbuja de mensaje
  AgenteBry.prototype.agregarMensaje = function (emisor, textoHtml, callback) {
    var self = this;
    var row = document.createElement('div');
    row.className = 'bry-message-row bry-' + emisor;

    var avatar = document.createElement('div');
    avatar.className = 'bry-avatar bry-' + emisor + '-avatar';
    if (emisor === 'agent') {
      avatar.innerHTML = '<img src="' + AGENTE_BRY_CONFIG.avatarAgenteUrl + '" alt="Bry" onerror="this.innerHTML=\'🕊️\';">';
    } else {
      avatar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A4C" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    }

    var bubble = document.createElement('div');
    bubble.className = 'bry-bubble';
    bubble.innerHTML = textoHtml;

    if (emisor === 'agent') {
      row.appendChild(avatar);
      row.appendChild(bubble);
    } else {
      row.appendChild(bubble);
      row.appendChild(avatar);
    }

    this.chatBody.appendChild(row);
    this.scrollToBottom();

    if (callback) callback();
  };

  // Indicador de escritura
  AgenteBry.prototype.mostrarEscribiendo = function (callback) {
    var self = this;
    var row = document.createElement('div');
    row.className = 'bry-message-row bry-agent bry-typing-row';

    var avatar = document.createElement('div');
    avatar.className = 'bry-avatar bry-agent-avatar';
    avatar.innerHTML = '<img src="' + AGENTE_BRY_CONFIG.avatarAgenteUrl + '" alt="Bry">';

    var indicator = document.createElement('div');
    indicator.className = 'bry-typing-indicator';
    indicator.innerHTML = '<div class="bry-typing-dot"></div><div class="bry-typing-dot"></div><div class="bry-typing-dot"></div>';

    row.appendChild(avatar);
    row.appendChild(indicator);
    this.chatBody.appendChild(row);
    this.scrollToBottom();

    setTimeout(function () {
      if (row.parentNode) row.parentNode.removeChild(row);
      if (callback) callback();
    }, AGENTE_BRY_CONFIG.tiempoRespuestaMs);
  };

  // Renderizar chips de respuesta rápida
  AgenteBry.prototype.mostrarChips = function (opciones, alSeleccionar) {
    var self = this;
    var container = document.createElement('div');
    container.className = 'bry-quick-replies';

    opciones.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bry-chip-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        // Deshabilitar todos los chips de este grupo para evitar doble clic
        var hermanos = container.querySelectorAll('.bry-chip-btn');
        hermanos.forEach(function (b) { b.disabled = true; });
        alSeleccionar(opt);
      });
      container.appendChild(btn);
    });

    this.chatBody.appendChild(container);
    this.scrollToBottom();
  };

  AgenteBry.prototype.scrollToBottom = function () {
    var self = this;
    setTimeout(function () {
      self.chatBody.scrollTop = self.chatBody.scrollHeight;
    }, 50);
  };

  // INICIO DE LA CONVERSACIÓN
  AgenteBry.prototype.iniciarConversacion = function () {
    var self = this;
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.saludo, function () {
        self.mostrarEscribiendo(function () {
          self.agregarMensaje('agent', MENSAJES_BRY.intro_tea, function () {
            self.preguntaCondicion();
          });
        });
      });
    });
  };

  // PREGUNTA 1: tea_condicion
  AgenteBry.prototype.preguntaCondicion = function () {
    var self = this;
    this.pasoActual = 'CONDICION';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_condicion, function () {
        self.mostrarChips(OPCIONES_CONDICION, function (opt) {
          self.responderCondicion(opt.value, opt.label);
        });
      });
    });
  };

  AgenteBry.prototype.responderCondicion = function (val, textoVisible) {
    var self = this;
    this.respuestas.tea_condicion = val;
    this.sincronizarConWizard();
    this.agregarMensaje('user', textoVisible, function () {
      var ack = MENSAJES_BRY.ack_condicion[val] || 'Gracias por contarme. Continuemos.';
      self.mostrarEscribiendo(function () {
        self.agregarMensaje('agent', ack, function () {
          if (val === 'no_visible') {
            self.preguntaSubtipoNV();
          } else {
            self.preguntaArea();
          }
        });
      });
    });
  };

  // PREGUNTA 1b: tea_subtipo_nv (Solo si no_visible)
  AgenteBry.prototype.preguntaSubtipoNV = function () {
    var self = this;
    this.pasoActual = 'SUBTIPO_NV';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_subtipo_nv, function () {
        self.mostrarChips(OPCIONES_SUBTIPO_NV, function (opt) {
          self.respuestas.tea_subtipo_nv = opt.value;
          self.sincronizarConWizard();
          self.agregarMensaje('user', opt.label, function () {
            var ack = MENSAJES_BRY.ack_subtipo_nv[opt.value] || 'Gracias por contarlo.';
            self.mostrarEscribiendo(function () {
              self.agregarMensaje('agent', ack, function () {
                self.preguntaArea();
              });
            });
          });
        });
      });
    });
  };

  // PREGUNTA 2: tea_area
  AgenteBry.prototype.preguntaArea = function () {
    var self = this;
    this.pasoActual = 'AREA';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_area, function () {
        self.mostrarChips(OPCIONES_AREA, function (opt) {
          self.respuestas.tea_area = opt.value;
          self.sincronizarConWizard();
          self.agregarMensaje('user', opt.label, function () {
            var ack = MENSAJES_BRY.ack_area[opt.value] || 'Entendido.';
            self.mostrarEscribiendo(function () {
              self.agregarMensaje('agent', ack, function () {
                self.preguntaEstado();
              });
            });
          });
        });
      });
    });
  };

  // PREGUNTA 3: tea_estado
  AgenteBry.prototype.preguntaEstado = function () {
    var self = this;
    this.pasoActual = 'ESTADO';
    var area = this.respuestas.tea_area || 'otro';
    var opciones = OPCIONES_ESTADO_POR_AREA[area] || OPCIONES_ESTADO_POR_AREA.otro;

    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_estado, function () {
        self.mostrarChips(opciones, function (opt) {
          self.respuestas.tea_estado = opt.value;
          self.sincronizarConWizard();
          self.agregarMensaje('user', opt.label, function () {
            var ack = MENSAJES_BRY.ack_estado[opt.value] || 'Gracias por contarlo.';
            self.mostrarEscribiendo(function () {
              self.agregarMensaje('agent', ack, function () {
                if (opt.value === 'peticion_sin_respuesta') {
                  self.preguntaTutelaPrevia();
                } else if (opt.value === 'tutela_incumplida') {
                  self.preguntaModalidad();
                } else {
                  self.pasoContacto();
                }
              });
            });
          });
        });
      });
    });
  };

  // PREGUNTA 4a: tutela_previa (Solo si peticion_sin_respuesta)
  AgenteBry.prototype.preguntaTutelaPrevia = function () {
    var self = this;
    this.pasoActual = 'TUTELA_PREVIA';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_tutela_previa, function () {
        self.mostrarChips(OPCIONES_TUTELA_PREVIA, function (opt) {
          self.respuestas.tutela_previa = opt.value;
          self.sincronizarConWizard();
          self.agregarMensaje('user', opt.label, function () {
            var ack = opt.value === 'si' ? MENSAJES_BRY.alerta_temeridad : MENSAJES_BRY.ack_tutela_previa.no;
            self.mostrarEscribiendo(function () {
              self.agregarMensaje('agent', ack, function () {
                self.pasoContacto();
              });
            });
          });
        });
      });
    });
  };

  // PREGUNTA 4b: tea_modalidad (Solo si tutela_incumplida)
  AgenteBry.prototype.preguntaModalidad = function () {
    var self = this;
    this.pasoActual = 'MODALIDAD';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.q_modalidad, function () {
        self.mostrarChips(OPCIONES_MODALIDAD_DESACATO, function (opt) {
          self.respuestas.tea_modalidad = opt.value;
          self.sincronizarConWizard();
          self.agregarMensaje('user', opt.label, function () {
            var ack = MENSAJES_BRY.ack_modalidad[opt.value] || 'Listo.';
            self.mostrarEscribiendo(function () {
              self.agregarMensaje('agent', ack, function () {
                self.pasoContacto();
              });
            });
          });
        });
      });
    });
  };

  // PASO 5: DATOS DE CONTACTO (wz-nombre, wz-whatsapp, wz-correo, wz-consentimiento)
  AgenteBry.prototype.pasoContacto = function () {
    var self = this;
    this.pasoActual = 'CONTACTO';
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.contacto, function () {
        var formCard = document.createElement('div');
        formCard.className = 'bry-card';
        formCard.innerHTML =
          '<form class="bry-contact-form" id="bry-form-contacto">' +
            '<div class="bry-input-group">' +
              '<label class="bry-input-label" for="bry-f-nombre">Nombre completo *</label>' +
              '<input type="text" class="bry-input-control" id="bry-f-nombre" required placeholder="Tu nombre y apellido">' +
            '</div>' +
            '<div class="bry-input-group">' +
              '<label class="bry-input-label" for="bry-f-whatsapp">WhatsApp *</label>' +
              '<input type="tel" class="bry-input-control" id="bry-f-whatsapp" required placeholder="Ej: 3001234567">' +
            '</div>' +
            '<div class="bry-input-group">' +
              '<label class="bry-input-label" for="bry-f-correo">Correo electrónico (opcional)</label>' +
              '<input type="email" class="bry-input-control" id="bry-f-correo" placeholder="ejemplo@correo.com">' +
            '</div>' +
            '<label class="bry-consent-label">' +
              '<input type="checkbox" class="bry-consent-checkbox" id="bry-f-consentimiento" required>' +
              '<span>Autorizo el tratamiento de mis datos de acuerdo con la <a href="#politica" style="color:var(--bry-turquoise);text-decoration:underline;">Política de Tratamiento de Datos de Lyzbri</a> (Ley 1581 de 2012).</span>' +
            '</label>' +
            '<button type="submit" class="bry-btn-primary" id="bry-btn-ver-resultado">' +
              'Ver orientación gratuita' +
            '</button>' +
          '</form>';

        self.chatBody.appendChild(formCard);
        self.scrollToBottom();

        var form = formCard.querySelector('#bry-form-contacto');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var nombre = form.querySelector('#bry-f-nombre').value.trim();
          var whatsapp = form.querySelector('#bry-f-whatsapp').value.trim();
          var correo = form.querySelector('#bry-f-correo').value.trim();
          var consiente = form.querySelector('#bry-f-consentimiento').checked;

          if (!nombre || !whatsapp) {
            alert('Por favor ingresa tu nombre y número de WhatsApp.');
            return;
          }
          if (!consiente) {
            alert('Debes autorizar el tratamiento de datos para continuar.');
            return;
          }

          self.respuestas.nombre = nombre;
          self.respuestas.whatsapp = whatsapp;
          self.respuestas.correo = correo;
          self.respuestas.consiente = true;

          self.sincronizarConWizard();
          formCard.style.opacity = '0.7';
          form.querySelector('#bry-btn-ver-resultado').disabled = true;

          self.agregarMensaje('user', 'Mis datos: ' + nombre + ' (' + whatsapp + ')', function () {
            self.mostrarResultadoFinal();
          });
        });
      });
    });
  };

  // PASO 6 & 7: RESULTADO (EVALUACIÓN GRATUITA) + PASO AL PAGO
  AgenteBry.prototype.mostrarResultadoFinal = function () {
    var self = this;
    this.pasoActual = 'RESULTADO';

    // Resolver producto y precio desde la lógica existente o cálculo compatible
    var evaluacion = this.calcularEvaluacion();

    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.resultado_intro, function () {
        var card = document.createElement('div');
        card.className = 'bry-card bry-card-result';

        var alertaHtml = '';
        if (self.respuestas.tutela_previa === 'si') {
          alertaHtml =
            '<div class="bry-alert-temerity">' +
              '<span class="bry-alert-icon">⚠️</span>' +
              '<div><strong>Aviso legal:</strong> Al haber presentado una tutela previa por estos hechos, tu caso será revisado por una abogada para evitar temeridad y proteger tu proceso.</div>' +
            '</div>';
        }

        card.innerHTML =
          '<span class="bry-badge-legal">Evaluación Inicial Gratuita</span>' +
          alertaHtml +
          '<h3 class="bry-card-title">' + evaluacion.titulo + '</h3>' +
          '<p class="bry-card-desc">' + evaluacion.descripcion + '</p>' +
          '<div class="bry-price-box">' +
            '<div class="bry-price-label">Servicio recomendado: ' + evaluacion.servicioNombre + '</div>' +
            '<div class="bry-price-value">Tarifa: ' + evaluacion.precioFormateado + ' COP</div>' +
          '</div>' +
          '<p style="font-size:14.5px;line-height:1.45;color:var(--bry-primary);margin-bottom:14px;font-weight:600;">' +
            MENSAJES_BRY.pago +
          '</p>' +
          '<button type="button" class="bry-btn-primary" id="bry-btn-continuar-pago">' +
            'Continuar al pago seguro — ' + evaluacion.precioFormateado +
          '</button>';

        self.chatBody.appendChild(card);
        self.scrollToBottom();

        var payBtn = card.querySelector('#bry-btn-continuar-pago');
        payBtn.addEventListener('click', function () {
          self.ejecutarSaltoAlPago(payBtn, evaluacion);
        });
      });
    });
  };

  // Cálculo de resultado garantizando Control C5 y C6
  AgenteBry.prototype.calcularEvaluacion = function () {
    var answers = {
      tea_condicion: this.respuestas.tea_condicion,
      tea_subtipo_nv: this.respuestas.tea_subtipo_nv,
      tea_area: this.respuestas.tea_area,
      tea_estado: this.respuestas.tea_estado,
      tutela_previa: this.respuestas.tutela_previa,
      tea_modalidad: this.respuestas.tea_modalidad,
      nombre: this.respuestas.nombre,
      whatsapp: this.respuestas.whatsapp,
      correo: this.respuestas.correo
    };

    // Si existen las funciones maestras de index.html, usarlas directamente
    if (typeof window.getResultado === 'function' && typeof window.resolverProducto === 'function') {
      var res = window.getResultado('tea', answers);
      var prod = window.resolverProducto('tea', answers);
      if (prod && typeof window.validarProducto === 'function') {
        var val = window.validarProducto(prod);
        if (val.ok) {
          return {
            titulo: res.titulo || 'Orientación jurídica para tu caso',
            descripcion: res.descripcion || '',
            servicioNombre: prod.nombre || 'Servicio Legal Especializado',
            precio: prod.price,
            precioFormateado: '$' + prod.price.toLocaleString('es-CO'),
            productoClave: prod.clave,
            producto: prod
          };
        }
      }
    }

    // Fallback exacto idéntico al catálogo oficial de Lyzbri
    var precio = 149000;
    var nombreServicio = 'Derecho de petición (Gestión administrativa)';
    var titulo = 'Hay elementos para iniciar una solicitud formal de protección.';
    var desc = 'Presentamos un derecho de petición formal solicitando el servicio o ajuste requerido, citando la normativa de protección de discapacidad y TEA.';

    if (this.respuestas.tea_estado === 'peticion_sin_respuesta') {
      precio = 420000;
      nombreServicio = 'Evaluación + Acción de tutela';
      titulo = 'Procede la acción de tutela para la protección inmediata.';
      desc = 'Al no obtener respuesta o recibir respuesta insatisfactoria, se procede judicialmente mediante acción de tutela para exigir la protección de los derechos fundamentales.';
    } else if (this.respuestas.tea_estado === 'tutela_incumplida') {
      if (this.respuestas.tea_modalidad === 'acompanamiento') {
        precio = 600000;
        nombreServicio = 'Evaluación + Incidente de desacato (Con acompañamiento)';
      } else {
        precio = 99000;
        nombreServicio = 'Incidente de desacato (Autogestión)';
      }
      titulo = 'Corresponde iniciar un incidente de desacato judicial.';
      desc = 'Ante el incumplimiento de una orden de tutela previa a tu favor, el mecanismo legal idóneo es el incidente de desacato ante el juez que emitió el fallo.';
    } else if (this.respuestas.tea_estado === 'acoso_no_investigado') {
      precio = 420000;
      nombreServicio = 'Evaluación + Escrito de denuncia';
      titulo = 'Corresponde radicar denuncia formal por vulneración de derechos.';
      desc = 'Es fundamental dejar los hechos por escrito y exigir las investigaciones formales correspondientes.';
    }

    return {
      titulo: titulo,
      descripcion: desc,
      servicioNombre: nombreServicio,
      precio: precio,
      precioFormateado: '$' + precio.toLocaleString('es-CO'),
      productoClave: 'TEA|' + (this.respuestas.tea_estado || 'DEFAULT')
    };
  };

  // Salto al pago con Bold — C5 idéntico al wizard
  AgenteBry.prototype.ejecutarSaltoAlPago = function (btn, evaluacion) {
    btn.disabled = true;
    btn.textContent = 'Preparando pago seguro con Bold...';

    // 1. Si existe el botón real en index.html, transferir datos y disparar
    var payBtnReal = document.getElementById('resultado-pago');
    if (payBtnReal && typeof window.mostrarResultado === 'function') {
      this.sincronizarConWizard();
      window.mostrarResultado();
      setTimeout(function () {
        if (payBtnReal && payBtnReal.onclick) {
          payBtnReal.click();
        }
      }, 400);
      return;
    }

    // 2. Si es el entorno de pruebas autónomo
    this.mostrarEscribiendo(function () {
      btn.textContent = 'Pago simulado en entorno de pruebas ✅';
      alert('¡Excelente! En producción este botón conecta con Bold (' + evaluacion.precioFormateado + '). Los datos fueron guardados y validados con éxito.');
    });
  };

  // Sincronización bidireccional con el Wizard tradicional (Contrato 3.4)
  AgenteBry.prototype.sincronizarConWizard = function () {
    if (typeof window.wz === 'undefined') {
      window.wz = { servicio: 'tea', answers: {} };
    }
    window.wz.servicio = 'tea';
    if (!window.wz.answers) window.wz.answers = {};

    var ans = window.wz.answers;
    if (this.respuestas.tea_condicion) ans.tea_condicion = this.respuestas.tea_condicion;
    if (this.respuestas.tea_subtipo_nv) ans.tea_subtipo_nv = this.respuestas.tea_subtipo_nv;
    if (this.respuestas.tea_area) ans.tea_area = this.respuestas.tea_area;
    if (this.respuestas.tea_estado) ans.tea_estado = this.respuestas.tea_estado;
    if (this.respuestas.tutela_previa) ans.tutela_previa = this.respuestas.tutela_previa;
    if (this.respuestas.tea_modalidad) ans.tea_modalidad = this.respuestas.tea_modalidad;
    if (this.respuestas.nombre) ans.nombre = this.respuestas.nombre;
    if (this.respuestas.whatsapp) ans.whatsapp = this.respuestas.whatsapp;
    if (this.respuestas.correo) ans.correo = this.respuestas.correo;

    // Sincronizar inputs HTML si existen en el DOM
    var setVal = function (id, val) {
      var el = document.getElementById(id);
      if (el && val) el.value = val;
    };
    setVal('wz-nombre', this.respuestas.nombre);
    setVal('wz-whatsapp', this.respuestas.whatsapp);
    setVal('wz-correo', this.respuestas.correo);
  };

  // Manejo de entrada de texto libre del usuario con detección inteligente
  AgenteBry.prototype.manejarTextoUsuario = function () {
    var rawText = this.inputElement.value.trim();
    if (!rawText) return;

    this.inputElement.value = '';
    var textLower = rawText.toLowerCase();

    // Si está en el paso de contacto, el formulario embebido es el camino prioritario
    if (this.pasoActual === 'CONTACTO') {
      var formNombre = document.getElementById('bry-f-nombre');
      if (formNombre && !formNombre.value) {
        formNombre.value = rawText;
        formNombre.focus();
        return;
      }
    }

    var self = this;
    var emparejado = false;

    // Reconocimiento según el paso actual
    if (this.pasoActual === 'CONDICION') {
      OPCIONES_CONDICION.forEach(function (opt) {
        opt.keys.forEach(function (k) {
          if (textLower.indexOf(k) !== -1 && !emparejado) {
            emparejado = true;
            self.responderCondicion(opt.value, rawText);
          }
        });
      });
    } else if (this.pasoActual === 'SUBTIPO_NV') {
      OPCIONES_SUBTIPO_NV.forEach(function (opt) {
        opt.keys.forEach(function (k) {
          if (textLower.indexOf(k) !== -1 && !emparejado) {
            emparejado = true;
            self.respuestas.tea_subtipo_nv = opt.value;
            self.sincronizarConWizard();
            self.agregarMensaje('user', rawText, function () {
              self.preguntaArea();
            });
          }
        });
      });
    } else if (this.pasoActual === 'AREA') {
      OPCIONES_AREA.forEach(function (opt) {
        opt.keys.forEach(function (k) {
          if (textLower.indexOf(k) !== -1 && !emparejado) {
            emparejado = true;
            self.respuestas.tea_area = opt.value;
            self.sincronizarConWizard();
            self.agregarMensaje('user', rawText, function () {
              self.preguntaEstado();
            });
          }
        });
      });
    } else if (this.pasoActual === 'ESTADO') {
      var area = this.respuestas.tea_area || 'otro';
      var lista = OPCIONES_ESTADO_POR_AREA[area] || OPCIONES_ESTADO_POR_AREA.otro;
      lista.forEach(function (opt) {
        opt.keys.forEach(function (k) {
          if (textLower.indexOf(k) !== -1 && !emparejado) {
            emparejado = true;
            self.respuestas.tea_estado = opt.value;
            self.sincronizarConWizard();
            self.agregarMensaje('user', rawText, function () {
              if (opt.value === 'peticion_sin_respuesta') self.preguntaTutelaPrevia();
              else if (opt.value === 'tutela_incumplida') self.preguntaModalidad();
              else self.pasoContacto();
            });
          }
        });
      });
    }

    if (!emparejado) {
      // Registrar fallo y verificar umbral anti-bucles (F3 B17)
      this.fallosConsecutivos++;
      this.agregarMensaje('user', rawText, function () {
        if (self.fallosConsecutivos >= 2) {
          self.mostrarFallback();
        } else {
          self.mostrarEscribiendo(function () {
            self.agregarMensaje('agent', 'Para asegurarme de orientarte con total precisión, por favor selecciona una de las opciones sugeridas arriba o cuéntame con otra palabra.');
          });
        }
      });
    } else {
      this.fallosConsecutivos = 0;
    }
  };

  // Salida elegante / Fallback (F3 B17)
  AgenteBry.prototype.mostrarFallback = function () {
    var self = this;
    this.mostrarEscribiendo(function () {
      self.agregarMensaje('agent', MENSAJES_BRY.fallback, function () {
        var card = document.createElement('div');
        card.className = 'bry-card';
        card.innerHTML =
          '<p style="font-size:14px;color:var(--bry-text-main);margin-bottom:10px;font-weight:600;">Opciones de ayuda directa:</p>' +
          '<button type="button" class="bry-btn-secondary" id="bry-btn-usar-formulario">' +
            '📋 Abrir formulario clásico' +
          '</button>' +
          '<a href="https://wa.me/573000000000?text=Hola,%20deseo%20orientación%20jurídica%20para%20un%20caso%20de%20discapacidad/TEA" target="_blank" rel="noopener" class="bry-btn-secondary" style="display:flex;align-items:center;justify-content:center;text-decoration:none;gap:8px;">' +
            '💬 Contactar asesora por WhatsApp' +
          '</a>';

        self.chatBody.appendChild(card);
        self.scrollToBottom();

        var btnForm = card.querySelector('#bry-btn-usar-formulario');
        btnForm.addEventListener('click', function () {
          // Mostrar wizard clásico si existe en el sitio
          var cardWz = document.getElementById('wizard-card');
          if (cardWz) {
            self.host.style.display = 'none';
            cardWz.style.display = 'block';
            cardWz.scrollIntoView({ behavior: 'smooth' });
          } else {
            alert('Cambiando a vista de formulario clásico.');
          }
        });
      });
    });
  };

  // 5. INICIALIZADOR GLOBAL / AUTO-MONTAJE
  function iniciarBryGlobal() {
    var mountPoint = document.getElementById('bry-app');
    if (!mountPoint) {
      mountPoint = document.getElementById('agente-bry-mount');
    }
    if (mountPoint && !mountPoint.dataset.bryIniciado) {
      mountPoint.dataset.bryIniciado = 'true';
      window.instanciaAgenteBry = new AgenteBry(mountPoint);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarBryGlobal);
  } else {
    iniciarBryGlobal();
  }

  // Exportar para pruebas o invocación manual
  window.AgenteBry = AgenteBry;
  window.AGENTE_BRY_CONFIG = AGENTE_BRY_CONFIG;
  window.MENSAJES_BRY = MENSAJES_BRY;

})();
