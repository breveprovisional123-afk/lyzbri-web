// =============================================================================
// LYZBRI LEGAL - Motor de las 23 Plantillas de Correo de Insolvencia
// Conforme a 00-INDICE-PLANTILLAS-CORREOS.md, ESPECIFICACION-EJECUCION-v2 y D11
// =============================================================================

const CATALOGO_PLANTILLAS = {
  "10": {
    "id": "10",
    "file": "10-inicio-encargo-diagnostico-empresarial.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "10",
      "file": "10-inicio-encargo-diagnostico-empresarial.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Diagnóstico de Salvación Empresarial y Cesación de Pagos",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`DIAG_EMPRESARIAL`",
      "régimen": "`PJ_EMP` · persona jurídica (régimen empresarial, Ley 1116 de 2006)",
      "tiempo_de_entrega": "5 días hábiles",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Diagnóstico de Salvación Empresarial y Cesación de Pagos (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Diagnóstico de Salvación Empresarial y Cesación de Pagos**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Certificado de existencia y representación legal reciente (o el registro que aplique a la entidad).\n2. Cédula del/de la representante legal y datos de contacto y notificación de la empresa.\n3. RUT de la empresa.\n4. Relación de obligaciones de la empresa: por cada acreedor, tipo de obligación (financiera, laboral, fiscal, proveedores u otra), capital, fecha de vencimiento, días de mora y garantías.\n5. Obligaciones en mora y demandas ejecutivas o cobros en curso (para calcular su porcentaje sobre el pasivo total).\n6. Inventario de los activos de la empresa.\n7. Estados financieros más recientes disponibles, con sus notas e indicando la fecha de corte.\n8. Actividad de la empresa, sector y si está vigilada o supervisada por alguna superintendencia.\n\n**2. Soportes que fortalecen el análisis**\n1. Estructura de control: socios o accionistas principales, matriz, subordinadas y vinculados relevantes.\n2. Información sobre el flujo de caja y la capacidad de pago disponible.\n\n**3. Solo si aplica a tu caso**\n1. Si se va a analizar **incapacidad de pago inminente**: proyecciones financieras y soportes de las circunstancias que afectarán el pago de obligaciones con vencimiento igual o inferior a un año.\n2. Estados financieros de ejercicios anteriores, si los tienes.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** 5 días hábiles. El plazo empieza a contar **desde que recibimos toda la documentación completa**, el poder firmado cuando corresponda y el pago pactado. Si falta algo, te avisamos qué hace falta.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** La contratación no suspende embargos, demandas ni procesos; los efectos dependen de la admisión y de las decisiones de la autoridad competente. Servicio privado; no representa a la Superintendencia de Sociedades ni garantiza admisión. Es un diagnóstico técnico-jurídico preliminar: no incluye contabilidad, auditoría, certificaciones de contador o revisor fiscal, avalúos, radicación ni representación.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "11": {
    "id": "11",
    "file": "11-inicio-encargo-blindaje-legal-activos.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "11",
      "file": "11-inicio-encargo-blindaje-legal-activos.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Blindaje Legal y Protección de Activos (Ley 1116)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`EXP_EMPRESARIAL`",
      "régimen": "`PJ_EMP` · persona jurídica (régimen empresarial, Ley 1116 de 2006)",
      "tiempo_de_entrega": "15 días hábiles",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Blindaje Legal y Protección de Activos (Ley 1116) (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Blindaje Legal y Protección de Activos (Ley 1116)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Certificado de existencia y representación legal reciente (o el registro que aplique a la entidad).\n2. Cédula del/de la representante legal y datos de contacto y notificación de la empresa.\n3. RUT de la empresa.\n4. Estatutos vigentes y libros o actas societarias relevantes (asamblea o junta de socios, libro de accionistas).\n5. Estados financieros más recientes, con sus notas.\n6. Inventario de activos con sus soportes de propiedad (certificados de tradición y libertad, tarjetas de propiedad) y las **garantías o gravámenes** que pesan sobre ellos (hipotecas, prendas, leasing, fiducias).\n7. Relación de obligaciones y acreedores, con sus garantías.\n8. Relación de procesos, embargos y medidas cautelares en curso.\n\n**2. Soportes que fortalecen el análisis**\n1. Contratos y soportes de operaciones relevantes recientes: ventas o transferencias de activos, garantías otorgadas, préstamos a socios o a vinculados.\n2. Estructura de control: socios o accionistas principales, matriz, subordinadas y vinculados relevantes.\n\n**3. Solo si aplica a tu caso**\n1. Si la empresa pertenece a un grupo empresarial o tiene situación de control registrada: certificado o documento que lo acredite.\n2. Si la empresa está vigilada o supervisada por una superintendencia: indicación del supervisor y del régimen aplicable.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** 15 días hábiles. El plazo empieza a contar **desde que recibimos toda la documentación completa**, el poder firmado cuando corresponda y el pago pactado. Si falta algo, te avisamos qué hace falta.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** La contratación no suspende embargos, demandas ni procesos; los efectos dependen de la admisión y de las decisiones de la autoridad competente. Servicio privado; no representa a la Superintendencia de Sociedades ni garantiza admisión. Es un diagnóstico preventivo: no incluye ni facilita transferir, ocultar o simular activos ni actos que perjudiquen a los acreedores, y no garantiza conservar bienes ni evitar embargos. No incluye representación ni radicación.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "12": {
    "id": "12",
    "file": "12-inicio-encargo-reorganizacion-empresarial.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "12",
      "file": "12-inicio-encargo-reorganizacion-empresarial.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Reorganización Empresarial Ley 1116 (Representación)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`REORG_EMP`",
      "régimen": "`PJ_EMP` · persona jurídica (régimen empresarial, Ley 1116 de 2006)",
      "tiempo_de_entrega": "según la propuesta y la etapa de la reorganización",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Reorganización Empresarial Ley 1116 (Representación) (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Reorganización Empresarial Ley 1116 (Representación)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. **Poder** para que actuemos como apoderadas de la empresa: te enviamos el modelo para firma del/de la representante legal.\n2. Certificado de existencia y representación legal reciente (o el registro que aplique a la entidad).\n3. Cédula del/de la representante legal y datos de contacto y notificación de la empresa.\n4. Estatutos vigentes y, cuando corresponda, acta del máximo órgano social que autoriza acudir al trámite.\n5. Estados financieros de los **tres últimos ejercicios**, con notas y dictámenes si existen.\n6. Estados financieros recientes con corte al **último día del mes anterior** a la solicitud.\n7. Inventario de activos y pasivos con ese mismo corte, incluidos los bienes en garantía.\n8. Relación de acreencias para el proyecto de calificación y graduación de créditos y derechos de voto: por acreedor, clase (laboral, fiscal, con garantía, quirografaria u otra), capital e intereses. *Nosotros preparamos el proyecto.*\n9. Explicación de las causas de la crisis. *Nosotros redactamos la memoria explicativa.*\n10. Flujo de caja proyectado y plan de negocios; si no los tienes, la información base (proyección de ingresos, costos y gastos) elaborada por tu contador/a. *Nosotros los parametrizamos en la solicitud.*\n11. Soportes de la causal invocada: obligaciones vencidas y demandas de ejecución o cobro (cesación de pagos), o proyecciones y soportes de la incapacidad de pago inminente.\n12. Informe de procesos ejecutivos, cobros coactivos, restituciones y garantías, con las medidas cautelares decretadas.\n\n**2. Soportes que fortalecen el análisis**\n1. Información laboral, fiscal y pensional pertinente (pasivos con trabajadores, DIAN, entidades territoriales y seguridad social).\n2. Estructura de control: socios o accionistas principales, matriz, subordinadas y vinculados relevantes.\n\n**3. Solo si aplica a tu caso**\n1. Si el trámite ya comenzó: solicitud presentada, constancia de radicación, providencias, requerimientos y sus términos.\n2. Si la empresa está vigilada o supervisada por una superintendencia, o pertenece a un grupo empresarial: documentos que lo acrediten.\n\n*Importante:* La información financiera la elabora o certifica tu contador/a o revisor/a fiscal bajo su competencia; Lyzbri Legal no presta servicios contables. Revisamos el marco contable que aplica a la empresa: no te pediremos documentos que no esté obligada a producir.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** según la propuesta y la etapa de la reorganización. El plazo empieza a contar **desde que recibimos toda la documentación completa**, el poder firmado cuando corresponda y el pago pactado. Si falta algo, te avisamos qué hace falta.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** La contratación no suspende embargos, demandas ni procesos; los efectos dependen de la admisión y de las decisiones de la autoridad competente. Servicio privado; no representa a la Superintendencia de Sociedades ni garantiza admisión. La representación no garantiza la admisión, la confirmación del acuerdo, la aceptación de los acreedores ni la conservación de todos los bienes. No incluye honorarios del promotor cuando se designe, avalúos, servicios contables ni gastos de terceros.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "13": {
    "id": "13",
    "file": "13-inicio-encargo-seguimiento-empresarial.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "13",
      "file": "13-inicio-encargo-seguimiento-empresarial.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Seguimiento Empresarial (Suscripción)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`SEG_EMP`",
      "régimen": "`PJ_EMP` · proceso de reorganización o recuperación empresarial en curso o acuerdo confirmado",
      "tiempo_de_entrega": "Suscripción mensual",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Seguimiento Empresarial (Suscripción) (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Seguimiento Empresarial (Suscripción)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Certificado de existencia y representación legal reciente (o el registro que aplique a la entidad).\n2. Cédula del/de la representante legal y datos de contacto y notificación de la empresa.\n3. Datos del proceso: autoridad (Superintendencia de Sociedades, juez o cámara de comercio), número de expediente, etapa actual y promotor/a o liquidador/a, si lo hay.\n4. Solicitud presentada y providencia de admisión o apertura.\n5. Providencias, requerimientos y comunicaciones recientes, con sus términos.\n6. Calendario de hitos y vencimientos que conozcas (audiencias, entregas de información, plazos de respuesta).\n7. Nombre y contacto de la persona responsable de entregar los documentos y validar la información (por ejemplo, el/la representante legal o el/la director/a financiero/a).\n\n**2. Soportes que fortalecen el análisis**\n1. Estados financieros y reportes periódicos que la empresa presenta en el proceso (durante la negociación, la información financiera trimestral).\n2. Relación actualizada de acreencias.\n\n**3. Solo si aplica a tu caso**\n1. **Si ya hay acuerdo confirmado:** acuerdo y anexos; providencia o acta de confirmación; calendario de pagos y compromisos; comprobantes de cumplimiento; reformas, si existen; información del comité de seguimiento y sus reuniones, cuando corresponda.\n2. Objeciones presentadas y sus soportes.\n3. Si cambió el/la representante legal o el/la apoderado/a: el documento que lo acredite.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Inicio del seguimiento:** el seguimiento mensual se activa **cuando recibamos y verifiquemos la documentación del proceso**. Desde ese momento recibirás el reporte periódico de estado y alertas sobre los hitos registrados.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este es un servicio de seguimiento documental: no incluye representación legal, radicación de escritos ni asistencia a audiencias, y no garantiza decisiones de la autoridad. Las alertas se generan a partir de los documentos, fechas y eventos que nos entregues. La contratación no suspende embargos, demandas ni procesos; los efectos dependen de la admisión y de las decisiones de la autoridad competente. Servicio privado; no representa a la Superintendencia de Sociedades ni garantiza admisión.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "14": {
    "id": "14",
    "file": "14-lead-recibido-servicios-por-contacto.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "14",
      "file": "14-lead-recibido-servicios-por-contacto.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Lead sin pago",
      "servicios": "Representación (REP_NAT), Diagnóstico empresarial, Blindaje, Reorganización, Seguimiento empresarial y Validación de trámite en curso (`INSOLV_SEG_NAT_VALIDACION`)",
      "cuándo_se_envía": "Al registrarse el lead (`delivery_type: LEAD_CONTACTO`)",
      "quién_envía": "Make",
      "estado_del_caso": "`LEAD_PENDIENTE_REVISION`",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Recibimos tu solicitud de {{nombre_producto}} (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu información para el servicio **{{nombre_producto}}**. Tu número de radicado es **{{radicado}}**.\n\nLa abogada revisará tu caso y te contactaremos para evaluarlo y explicarte el alcance, el valor y los siguientes pasos. **Este correo no es un cobro**: no tienes que pagar nada todavía.\n\nPara que la conversación sea más útil, ten a mano, si los tienes: tu documento de identidad (o el certificado de existencia y representación, si es una empresa), una relación de tus acreedores y deudas, y cualquier documento de procesos o cobros en curso. **No los envíes aún**: cuando se confirme el encargo te enviaremos el listado completo y el enlace de tu carpeta privada. Cuando subas tus documentos, para confirmar que terminaste deberás hacer clic en **\"Ya terminé de subir\"** y, además, enviar tu confirmación **por correo a contacto@lyzbri.com** indicando tu radicado; ese correo es obligatorio.\n\nSi tienes un plazo judicial o una actuación urgente en curso, escríbenos de inmediato por WhatsApp indicando tu radicado: {{enlace_whatsapp}}.\n\nLa evaluación inicial no garantiza la admisión ni el resultado de ningún trámite.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "nombre_producto",
      "radicado",
      "nombre_cliente",
      "enlace_whatsapp"
    ]
  },
  "15": {
    "id": "15",
    "file": "15-documentacion-incompleta.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "15",
      "file": "15-documentacion-incompleta.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos",
      "cuándo_se_envía": "Cuando Liza revisa la carpeta y encuentra faltantes (tras el correo de confirmación del cliente a contacto@lyzbri.com o en revisión)",
      "quién_envía": "Liza (o Make al registrar Liza los faltantes en HubSpot)",
      "estado_del_caso": "`DOCS_INCOMPLETOS`; el plazo **no** corre",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{lista_faltantes}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Te faltan algunos documentos para tu {{nombre_producto}} (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRevisamos los documentos que subiste para tu servicio **{{nombre_producto}}** (radicado **{{radicado}}**). Gracias por enviarlos.\n\nPara poder empezar el estudio **nos falta lo siguiente:**\n\n{{lista_faltantes}}\n\nSúbelo en tu misma carpeta privada: **{{enlace_carpeta_cliente}}**. Cuando termines, haz clic en **\"Ya terminé de subir\"** **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo es obligatoria: sin ese correo no iniciamos la revisión.\n\nRecuerda que el plazo de entrega empieza a contar desde que recibimos tu correo de confirmación en contacto@lyzbri.com y verificamos que la documentación está completa. Si algún documento no lo puedes conseguir, escríbenos por WhatsApp con tu radicado: {{enlace_whatsapp}}. Te indicamos si puede reemplazarse o cómo afecta el estudio.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "nombre_producto",
      "radicado",
      "nombre_cliente",
      "lista_faltantes",
      "enlace_carpeta_cliente",
      "enlace_whatsapp"
    ]
  },
  "16": {
    "id": "16",
    "file": "16-recordatorio-documentos-pendientes.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "16",
      "file": "16-recordatorio-documentos-pendientes.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos",
      "cuándo_se_envía": "Cada 3 días mientras el caso esté en `PAGADO_SIN_DOCS` o `DOCS_INCOMPLETOS`, hasta el día 30 (sin duplicar)",
      "quién_envía": "Make (programado)",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Recordatorio: tus documentos para {{nombre_producto}} (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nTe recordamos que aún no hemos recibido la documentación completa de tu servicio **{{nombre_producto}}** (radicado **{{radicado}}**).\n\nPuedes subirla, de una vez o por partes, en tu carpeta privada: **{{enlace_carpeta_cliente}}**. El listado de documentos está en el primer correo que te enviamos. Cuando termines, haz clic en **\"Ya terminé de subir\"** **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo es obligatoria: sin ese correo no iniciamos la revisión.\n\nEl plazo de entrega empieza a contar desde que recibimos tu correo de confirmación en contacto@lyzbri.com y verificamos que la documentación está completa. Si necesitas ayuda, escríbenos por WhatsApp con tu radicado: {{enlace_whatsapp}}.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "nombre_producto",
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_whatsapp"
    ]
  },
  "17": {
    "id": "17",
    "file": "17-documentacion-completa-inicio-de-plazo.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "17",
      "file": "17-documentacion-completa-inicio-de-plazo.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos",
      "cuándo_se_envía": "Cuando Liza, tras recibir el correo de confirmación del cliente en contacto@lyzbri.com, marca la documentación como completa",
      "quién_envía": "Make al cambiar el estado en HubSpot",
      "estado_del_caso": "`DOCS_COMPLETOS_VERIFICADOS` → `EN_ANALISIS`; inicia el plazo",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{tiempo_entrega}}`, `{{fecha_entrega_estimada}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Documentación completa: iniciamos tu {{nombre_producto}} (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu correo de confirmación en contacto@lyzbri.com y verificamos que tu documentación está **completa**. Desde hoy empieza a correr el plazo de **{{tiempo_entrega}}** para tu servicio **{{nombre_producto}}** (radicado **{{radicado}}**).\n\nFecha estimada de entrega: **{{fecha_entrega_estimada}}** (días hábiles).\n\nSi durante el estudio necesitamos aclarar algún dato, te escribiremos. Si algo cambia en tu situación (un nuevo embargo, una notificación, una audiencia), avísanos por WhatsApp con tu radicado: {{enlace_whatsapp}}.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "nombre_producto",
      "radicado",
      "nombre_cliente",
      "tiempo_entrega",
      "fecha_entrega_estimada",
      "enlace_whatsapp"
    ]
  },
  "18": {
    "id": "18",
    "file": "18-entrega-del-servicio.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "18",
      "file": "18-entrega-del-servicio.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos (texto de limitación según producto)",
      "cuándo_se_envía": "Cuando Liza sube la entrega a la carpeta del caso",
      "quién_envía": "Liza (o Make al marcar `ENTREGADO`)",
      "estado_del_caso": "`ENTREGADO`",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{enlace_entrega}}`, `{{aviso_entrega}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Tu {{nombre_producto}} está listo (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nTu servicio **{{nombre_producto}}** (radicado **{{radicado}}**) está listo. Puedes descargarlo aquí: **{{enlace_entrega}}**.\n\nEl documento organiza la información que nos entregaste, identifica los puntos que requieren verificación y señala los siguientes pasos recomendados.\n\n{{aviso_entrega}}\n\nSi te pedimos documentos o aclaraciones adicionales, súbelos en tu carpeta y haz clic en **\"Ya terminé de subir\"** y, además, **envía tu confirmación al correo contacto@lyzbri.com** indicando tu radicado; ese correo es obligatorio.\n\nSi tienes preguntas sobre el resultado, escríbenos por WhatsApp con tu radicado: {{enlace_whatsapp}}.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "nombre_producto",
      "radicado",
      "nombre_cliente",
      "enlace_entrega",
      "aviso_entrega",
      "enlace_whatsapp"
    ]
  },
  "19": {
    "id": "19",
    "file": "19-caso-inactivo-dia-30.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "19",
      "file": "19-caso-inactivo-dia-30.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos",
      "cuándo_se_envía": "Día 30 desde el pago o el inicio del encargo sin documentación completa",
      "quién_envía": "Make (programado)",
      "estado_del_caso": "`INACTIVO` (no se borra nada)",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Tu caso {{radicado}} quedó en pausa — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nHan pasado 30 días sin que recibamos la documentación completa de tu servicio **{{nombre_producto}}** (radicado **{{radicado}}**), así que dejamos tu caso **en pausa**.\n\nNo borramos nada: los documentos que ya subiste siguen guardados en tu carpeta privada.\n\nCuando quieras retomarlo, sube lo que falta en **{{enlace_carpeta_cliente}}** haz clic en **\"Ya terminé de subir\"** y, además, **envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**; sin ese correo no reanudamos la revisión. Si tienes dudas, escríbenos por WhatsApp con tu radicado: {{enlace_whatsapp}}. Revisaremos si la información sigue vigente (por ejemplo, la fecha de corte de las relaciones de acreedores y bienes).\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "nombre_producto",
      "enlace_carpeta_cliente",
      "enlace_whatsapp"
    ]
  },
  "20": {
    "id": "20",
    "file": "20-reactivacion-del-caso.md",
    "group": "C-ciclo-del-caso",
    "meta": {
      "id": "20",
      "file": "20-reactivacion-del-caso.md",
      "group": "C-ciclo-del-caso",
      "tipo": "Ciclo del caso",
      "servicios": "Todos",
      "cuándo_se_envía": "Cuando un caso `INACTIVO` recibe nuevos documentos o el cliente pide retomarlo",
      "quién_envía": "Make o Liza",
      "estado_del_caso": "`PAGADO_SIN_DOCS` o `DOCS_INCOMPLETOS`, según lo que falte",
      "variables": "`{{nombre_cliente}}`, `{{nombre_producto}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`"
    },
    "asunto": "Retomamos tu caso {{radicado}} — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRetomamos tu servicio **{{nombre_producto}}** (radicado **{{radicado}}**).\n\nVamos a revisar la documentación de tu carpeta y te diremos si falta algo o si hay que actualizar alguna información. Mientras tanto, puedes seguir subiendo documentos en **{{enlace_carpeta_cliente}}**. Cuando termines, haz clic en **\"Ya terminé de subir\"** **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo es obligatoria: sin ese correo no iniciamos la revisión.\n\nEl plazo de entrega empieza a contar desde que recibimos tu correo de confirmación en contacto@lyzbri.com y verificamos que la documentación está completa. Cualquier duda, escríbenos por WhatsApp con tu radicado: {{enlace_whatsapp}}.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "nombre_producto",
      "enlace_carpeta_cliente",
      "enlace_whatsapp"
    ]
  },
  "21": {
    "id": "21",
    "file": "21-alerta-interna-pago-o-encargo-confirmado.md",
    "group": "D-alertas-internas-a-Liza",
    "meta": {
      "id": "21",
      "file": "21-alerta-interna-pago-o-encargo-confirmado.md",
      "group": "D-alertas-internas-a-Liza",
      "tipo": "Interno (no va al cliente)",
      "destinatario": "contacto@lyzbri.com (alerta) + tarea en HubSpot",
      "cuándo_se_envía": "En todo pago confirmado o encargo confirmado",
      "quién_envía": "Make",
      "variables": "`{{radicado}}`, `{{sku}}`, `{{nombre_producto}}`, `{{regimen}}`, `{{monto}}`, `{{cant_acreedores}}`, `{{prioridad}}`, `{{nombre_cliente}}`, `{{email_cliente}}`, `{{telefono_cliente}}`, `{{enlace_hubspot}}`, `{{enlace_carpeta_caso}}`"
    },
    "asunto": "[{{prioridad}}] Pago confirmado · {{radicado}} · {{sku}} · ${{monto}}",
    "cuerpo": "Nuevo caso de insolvencia con pago confirmado.\n\n- Radicado: {{radicado}}\n- Servicio: {{nombre_producto}} (`{{sku}}`)\n- Régimen: {{regimen}}\n- Acreedores declarados: {{cant_acreedores}}\n- Monto: ${{monto}} COP\n- Prioridad: {{prioridad}}\n- Cliente: {{nombre_cliente}} · {{email_cliente}} · {{telefono_cliente}}\n- Caso en HubSpot: {{enlace_hubspot}}\n- Carpeta del caso: {{enlace_carpeta_caso}}\n\nEl correo post-pago con el listado de documentos ya fue enviado al cliente. Estado: `PAGADO_SIN_DOCS`.\n\nPara confirmar que terminó de subir sus documentos, el cliente debe hacer clic en \"Ya terminé de subir\" y, además, **enviar su confirmación al correo contacto@lyzbri.com** con el asunto \"Ya terminé de subir - radicado {{radicado}}\". El correo es obligatorio; el plazo no corre antes de recibirlo y verificar la completitud.\n\nSi la prioridad es **HIGH_TICKET** (empresarial, representación o monto ≥ $390.000), contactar al cliente sin esperar la carga de documentos.",
    "variables": [
      "prioridad",
      "radicado",
      "sku",
      "monto",
      "nombre_producto",
      "regimen",
      "cant_acreedores",
      "nombre_cliente",
      "email_cliente",
      "telefono_cliente",
      "enlace_hubspot",
      "enlace_carpeta_caso"
    ]
  },
  "22": {
    "id": "22",
    "file": "22-alerta-interna-carga-terminada.md",
    "group": "D-alertas-internas-a-Liza",
    "meta": {
      "id": "22",
      "file": "22-alerta-interna-carga-terminada.md",
      "group": "D-alertas-internas-a-Liza",
      "tipo": "Interno (no va al cliente)",
      "destinatario": "contacto@lyzbri.com + tarea en HubSpot",
      "cuándo_se_envía": "Cuando el cliente hace clic en \"Ya terminé de subir\"",
      "quién_envía": "Make",
      "variables": "`{{radicado}}`, `{{nombre_producto}}`, `{{regimen}}`, `{{numero_archivos}}`, `{{fecha_confirmacion_cliente}}`, `{{enlace_carpeta_caso}}`, `{{enlace_hubspot}}`"
    },
    "asunto": "Documentos recibidos para revisar · {{radicado}} · {{nombre_producto}}",
    "cuerpo": "El cliente del radicado {{radicado}} indicó con el botón \"Ya terminé de subir\" que terminó de subir sus documentos. **Verifica que también llegó su correo de confirmación a contacto@lyzbri.com** (fecha de recepción: {{fecha_confirmacion_cliente}}); sin ese correo no se inicia la revisión.\n\n- Servicio: {{nombre_producto}}\n- Régimen: {{regimen}}\n- Archivos en la carpeta: {{numero_archivos}}\n- Carpeta: {{enlace_carpeta_caso}}\n- HubSpot: {{enlace_hubspot}}\n\nPendiente: verificar completitud. Si está completa, marcar `DOCS_COMPLETOS_VERIFICADOS` (se envía la plantilla 17 e inicia el plazo). Si falta algo, registrar faltantes (se envía la plantilla 15). **El plazo no corre hasta la verificación.**",
    "variables": [
      "radicado",
      "nombre_producto",
      "fecha_confirmacion_cliente",
      "regimen",
      "numero_archivos",
      "enlace_carpeta_caso",
      "enlace_hubspot"
    ]
  },
  "23": {
    "id": "23",
    "file": "23-alerta-interna-vencimiento-plazo.md",
    "group": "D-alertas-internas-a-Liza",
    "meta": {
      "id": "23",
      "file": "23-alerta-interna-vencimiento-plazo.md",
      "group": "D-alertas-internas-a-Liza",
      "tipo": "Interno (no va al cliente)",
      "destinatario": "contacto@lyzbri.com + tarea en HubSpot",
      "cuándo_se_envía": "1 día hábil antes del vencimiento del plazo de un caso `EN_ANALISIS`",
      "quién_envía": "Make (programado)",
      "variables": "`{{radicado}}`, `{{nombre_producto}}`, `{{fecha_confirmacion_cliente}}`, `{{fecha_verificacion}}`, `{{fecha_vencimiento}}`, `{{enlace_hubspot}}`, `{{enlace_carpeta_caso}}`"
    },
    "asunto": "Vence mañana · {{radicado}} · {{nombre_producto}}",
    "cuerpo": "El plazo de entrega del radicado {{radicado}} vence el **{{fecha_vencimiento}}**.\n\n- Servicio: {{nombre_producto}}\n- Confirmación del cliente recibida en contacto@lyzbri.com el: {{fecha_confirmacion_cliente}}\n- Documentación verificada el: {{fecha_verificacion}}\n- HubSpot: {{enlace_hubspot}}\n- Carpeta: {{enlace_carpeta_caso}}\n\nAl subir la entrega a la carpeta, enviar la plantilla 18 y marcar `ENTREGADO`.",
    "variables": [
      "radicado",
      "nombre_producto",
      "fecha_vencimiento",
      "fecha_confirmacion_cliente",
      "fecha_verificacion",
      "enlace_hubspot",
      "enlace_carpeta_caso"
    ]
  },
  "01": {
    "id": "01",
    "file": "01-post-pago-diagnostico-natural-NO-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "01",
      "file": "01-post-pago-diagnostico-natural-NO-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`DIAG_NATURAL`",
      "régimen": "`PN_NC_CGP` · persona natural **no comerciante** (CGP, reformado por la Ley 2445 de 2025)",
      "tiempo_de_entrega": "2 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos de contacto y notificación: dirección, correo electrónico y celular.\n2. Relación de **todas** tus deudas: por cada acreedor, nombre, valor aproximado (capital e intereses) y desde cuándo estás en mora. Puede ser una lista sencilla; nosotros la organizamos.\n3. Soportes de mora y cobros que tengas: extractos o certificados de deuda, cartas o mensajes de cobro y, si existen, procesos judiciales, embargos o cobros coactivos (juzgado o entidad y número de proceso, si los conoces).\n4. Relación de tus bienes (vivienda, vehículo, cuentas, otros) con los soportes que tengas.\n5. Tus ingresos mensuales, tus gastos de subsistencia (vivienda, alimentación, servicios, transporte, salud, educación) y los recursos de que dispones.\n6. Información de tu sociedad conyugal o unión marital (vigente o liquidada) y de las obligaciones alimentarias a tu cargo, si las tienes.\n7. Breve descripción de tu actividad (empleado/a, independiente, pensionado/a u otra) y de tu situación jurídica actual.\n\n**2. Soportes que fortalecen el análisis**\n1. Soportes de tus ingresos: desprendibles de nómina, certificado laboral o de pensión, o extractos bancarios recientes.\n2. Certificados de tradición y libertad de tus inmuebles y tarjeta de propiedad de tus vehículos.\n3. RUT, si lo tienes.\n\n**3. Solo si aplica a tu caso**\n1. Escritura pública o sentencia de separación de bienes o de liquidación de la sociedad conyugal o patrimonial.\n2. Soportes de libranzas o descuentos de nómina.\n3. Si eres socio/a o tienes participación en alguna sociedad: certificado de existencia y representación de esa sociedad.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **2 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio es un estudio documental de tu caso. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "02": {
    "id": "02",
    "file": "02-post-pago-diagnostico-natural-PEQUENA-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "02",
      "file": "02-post-pago-diagnostico-natural-PEQUENA-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`DIAG_NATURAL`",
      "régimen": "`PN_PC_CGP` · persona natural **pequeña comerciante** (CGP; activos computables < 1.000 SMMLV)",
      "tiempo_de_entrega": "2 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Diagnóstico de Insolvencia: Evalúa Si Puedes Detener Embargos**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos de contacto y notificación: dirección, correo electrónico y celular.\n2. Certificado de matrícula mercantil.\n3. Relación de **todas** tus deudas, personales y del negocio: por cada acreedor, nombre, valor aproximado (capital e intereses) y desde cuándo estás en mora.\n4. Soportes de mora y cobros que tengas: extractos o certificados de deuda, cartas de cobro y, si existen, procesos judiciales, embargos o cobros coactivos.\n5. Inventario de tus bienes (personales y del negocio) con los soportes disponibles, indicando si alguno es tu **vivienda familiar** o tu **vehículo de trabajo** (estos se excluyen del cálculo del límite de activos para pequeña comerciante).\n6. Información de tus ingresos y gastos personales y del negocio, y de los recursos de que dispones.\n7. Información de tu sociedad conyugal o unión marital (vigente o liquidada) y de las obligaciones alimentarias a tu cargo, si las tienes.\n8. Breve descripción de tu actividad comercial y de tu situación jurídica actual.\n\n**2. Soportes que fortalecen el análisis**\n1. RUT con tu actividad comercial actualizada.\n2. Certificados de tradición y libertad de tus inmuebles y tarjeta de propiedad de tus vehículos.\n3. Balance o información básica del negocio (ventas, costos y gastos), si la tienes.\n\n**3. Solo si aplica a tu caso**\n1. Soporte de la afectación a vivienda familiar o del patrimonio de familia, si aplica.\n2. Soporte de que el vehículo es tu instrumento de trabajo, si aplica.\n3. Escritura pública o sentencia de separación de bienes o de liquidación de la sociedad conyugal o patrimonial.\n4. Soportes de libranzas o descuentos de nómina.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **2 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio es un estudio documental de tu caso. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "03": {
    "id": "03",
    "file": "03-post-pago-estrategia-negociacion-vs-liquidacion-NO-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "03",
      "file": "03-post-pago-estrategia-negociacion-vs-liquidacion-NO-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Estrategia Legal: Negociación de Deudas vs. Liquidación",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`DIAG_MODALIDAD`",
      "régimen": "`PN_NC_CGP` · persona natural **no comerciante** (CGP, reformado por la Ley 2445 de 2025)",
      "tiempo_de_entrega": "3 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Estrategia Legal: Negociación de Deudas vs. Liquidación · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Estrategia Legal: Negociación de Deudas vs. Liquidación**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos de contacto y notificación: dirección, correo electrónico y celular.\n2. Relación de **todas** tus deudas: por cada acreedor, nombre, valor aproximado (capital e intereses) y desde cuándo estás en mora. Puede ser una lista sencilla; nosotros la organizamos.\n3. Soportes de mora y cobros que tengas: extractos o certificados de deuda, cartas o mensajes de cobro y, si existen, procesos judiciales, embargos o cobros coactivos (juzgado o entidad y número de proceso, si los conoces).\n4. Relación de tus bienes (vivienda, vehículo, cuentas, otros) con los soportes que tengas.\n5. Tus ingresos mensuales, tus gastos de subsistencia (vivienda, alimentación, servicios, transporte, salud, educación) y los recursos de que dispones.\n6. Información de tu sociedad conyugal o unión marital (vigente o liquidada) y de las obligaciones alimentarias a tu cargo, si las tienes.\n7. Breve descripción de tu actividad (empleado/a, independiente, pensionado/a u otra) y de tu situación jurídica actual.\n\n**2. Soportes que fortalecen el análisis**\n1. Soportes de tus ingresos: desprendibles de nómina, certificado laboral o de pensión, o extractos bancarios recientes.\n2. Certificados de tradición y libertad de tus inmuebles y tarjeta de propiedad de tus vehículos.\n3. RUT, si lo tienes.\n\n**3. Solo si aplica a tu caso**\n1. Escritura pública o sentencia de separación de bienes o de liquidación de la sociedad conyugal o patrimonial.\n2. Soportes de libranzas o descuentos de nómina.\n3. Si eres socio/a o tienes participación en alguna sociedad: certificado de existencia y representación de esa sociedad.\n4. Si en los últimos meses hiciste pagos a un solo acreedor, entregaste bienes en pago o hiciste operaciones extraordinarias con algún acreedor: soportes de esas operaciones.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **3 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio es un estudio documental de tu caso. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "04": {
    "id": "04",
    "file": "04-post-pago-estrategia-negociacion-vs-liquidacion-PEQUENA-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "04",
      "file": "04-post-pago-estrategia-negociacion-vs-liquidacion-PEQUENA-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Estrategia Legal: Negociación de Deudas vs. Liquidación",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`DIAG_MODALIDAD`",
      "régimen": "`PN_PC_CGP` · persona natural **pequeña comerciante** (CGP; activos computables < 1.000 SMMLV)",
      "tiempo_de_entrega": "3 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Estrategia Legal: Negociación de Deudas vs. Liquidación · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Estrategia Legal: Negociación de Deudas vs. Liquidación**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos de contacto y notificación: dirección, correo electrónico y celular.\n2. Certificado de matrícula mercantil.\n3. Relación de **todas** tus deudas, personales y del negocio: por cada acreedor, nombre, valor aproximado (capital e intereses) y desde cuándo estás en mora.\n4. Soportes de mora y cobros que tengas: extractos o certificados de deuda, cartas de cobro y, si existen, procesos judiciales, embargos o cobros coactivos.\n5. Inventario de tus bienes (personales y del negocio) con los soportes disponibles, indicando si alguno es tu **vivienda familiar** o tu **vehículo de trabajo** (estos se excluyen del cálculo del límite de activos para pequeña comerciante).\n6. Información de tus ingresos y gastos personales y del negocio, y de los recursos de que dispones.\n7. Información de tu sociedad conyugal o unión marital (vigente o liquidada) y de las obligaciones alimentarias a tu cargo, si las tienes.\n8. Breve descripción de tu actividad comercial y de tu situación jurídica actual.\n\n**2. Soportes que fortalecen el análisis**\n1. RUT con tu actividad comercial actualizada.\n2. Certificados de tradición y libertad de tus inmuebles y tarjeta de propiedad de tus vehículos.\n3. Balance o información básica del negocio (ventas, costos y gastos), si la tienes.\n\n**3. Solo si aplica a tu caso**\n1. Soporte de la afectación a vivienda familiar o del patrimonio de familia, si aplica.\n2. Soporte de que el vehículo es tu instrumento de trabajo, si aplica.\n3. Escritura pública o sentencia de separación de bienes o de liquidación de la sociedad conyugal o patrimonial.\n4. Soportes de libranzas o descuentos de nómina.\n5. Si en los últimos meses hiciste pagos a un solo acreedor, entregaste bienes en pago o hiciste operaciones extraordinarias con algún acreedor: soportes de esas operaciones.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **3 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio es un estudio documental de tu caso. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "05": {
    "id": "05",
    "file": "05-post-pago-expediente-negociacion-NO-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "05",
      "file": "05-post-pago-expediente-negociacion-NO-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Preparación de Expediente y Defensa para Negociación de Deudas",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`EXP_NEG_NATURAL`",
      "régimen": "`PN_NC_CGP` · persona natural **no comerciante** (CGP, reformado por la Ley 2445 de 2025)",
      "tiempo_de_entrega": "3 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Preparación de Expediente y Defensa para Negociación de Deudas · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Preparación de Expediente y Defensa para Negociación de Deudas**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos completos de notificación: dirección física, correo electrónico y celular.\n2. Explicación, en tus palabras, de las causas por las que no pudiste seguir pagando. *Nosotros redactamos el informe formal.*\n3. Cuánto puedes pagar al mes y en qué plazo. *Nosotros estructuramos la propuesta de pago.*\n4. Relación completa de acreedores: nombre, dirección o correo de notificación (si lo conoces), capital, intereses, tipo de crédito, garantías y fecha de vencimiento o de inicio de la mora.\n5. Relación de **todos** tus bienes, incluidos los que tengas en el exterior, con sus soportes (certificados de tradición, tarjetas de propiedad, extractos).\n6. Relación de procesos judiciales y actuaciones contra tu patrimonio (ejecutivos, cobros coactivos, restituciones u otros), con juzgado o entidad y número de radicado, si lo tienes.\n7. Certificación o declaración de tus ingresos: certificado laboral o de pensión, desprendibles de nómina o, si eres independiente, la declaración de tus ingresos.\n8. Relación de los recursos de que dispones y de los gastos necesarios para tu subsistencia, la de las personas a tu cargo y la conservación de tus bienes.\n9. Información de tu sociedad conyugal o patrimonial (si estás casado/a o en unión marital).\n10. Obligaciones alimentarias a tu cargo (a favor de quién y por qué valor) y certificado del REDAM (Registro de Deudores Alimentarios Morosos).\n\n**2. Soportes que fortalecen el análisis**\n1. Extractos o certificaciones de saldo de cada deuda.\n2. Soportes de tus ingresos y de tus gastos mensuales.\n\n**3. Solo si aplica a tu caso**\n1. Si en los últimos dos años se liquidó tu sociedad conyugal o patrimonial o hubo separación de bienes: escritura pública o sentencia correspondiente.\n2. Soportes de libranzas o descuentos de nómina.\n3. Si tus deudas superan la mínima cuantía, la solicitud debe presentarse con apoderado/a (art. 539 del CGP). Este servicio prepara el expediente; la representación se contrata por separado. Si ya tienes abogado/a, envíanos su poder.\n\n*Importante:* Las relaciones de acreedores y de bienes se presentan con corte al **último día del mes anterior** a la presentación de la solicitud. La **manifestación bajo juramento** no la tienes que enviar: va incluida en la solicitud que preparamos y tú la firmas.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **3 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio prepara documentalmente tu expediente; no incluye representación jurídica, radicación ni asistencia a audiencias. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "06": {
    "id": "06",
    "file": "06-post-pago-expediente-negociacion-PEQUENA-comerciante.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "06",
      "file": "06-post-pago-expediente-negociacion-PEQUENA-comerciante.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Preparación de Expediente y Defensa para Negociación de Deudas",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`EXP_NEG_NATURAL`",
      "régimen": "`PN_PC_CGP` · persona natural **pequeña comerciante** (CGP; activos computables < 1.000 SMMLV)",
      "tiempo_de_entrega": "3 días hábiles",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Preparación de Expediente y Defensa para Negociación de Deudas · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Preparación de Expediente y Defensa para Negociación de Deudas**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Cédula (ambas caras) y tus datos completos de notificación: dirección física, correo electrónico y celular.\n2. Constancia o certificado de matrícula mercantil.\n3. Explicación, en tus palabras, de las causas por las que no pudiste seguir pagando. *Nosotros redactamos el informe formal.*\n4. Cuánto puedes pagar al mes y en qué plazo. *Nosotros estructuramos la propuesta de pago.*\n5. Relación completa de acreedores, personales y del negocio: nombre, dirección o correo de notificación (si lo conoces), capital, intereses, tipo de crédito, garantías y fecha de vencimiento o de inicio de la mora.\n6. Relación de **todos** tus bienes, personales y del negocio, incluidos los que tengas en el exterior, con sus soportes, indicando si alguno es tu **vivienda familiar** o tu **vehículo de trabajo**.\n7. Relación de procesos judiciales y actuaciones contra tu patrimonio (ejecutivos, cobros coactivos, restituciones u otros), con juzgado o entidad y número de radicado, si lo tienes.\n8. Certificación o declaración de tus ingresos personales y del negocio.\n9. Relación de los recursos de que dispones y de los gastos necesarios para tu subsistencia, la de las personas a tu cargo y la conservación de tus bienes.\n10. Información de tu sociedad conyugal o patrimonial (si estás casado/a o en unión marital).\n11. Obligaciones alimentarias a tu cargo (a favor de quién y por qué valor) y certificado del REDAM (Registro de Deudores Alimentarios Morosos).\n\n**2. Soportes que fortalecen el análisis**\n1. RUT con tu actividad comercial actualizada.\n2. Extractos o certificaciones de saldo de cada deuda, personales y del negocio.\n3. Soportes de tus ingresos y gastos, y balance o información básica del negocio.\n\n**3. Solo si aplica a tu caso**\n1. Soporte de la afectación a vivienda familiar o del patrimonio de familia, y soporte de que el vehículo es tu instrumento de trabajo, si aplica.\n2. Si en los últimos dos años se liquidó tu sociedad conyugal o patrimonial o hubo separación de bienes: escritura pública o sentencia correspondiente.\n3. Soportes de libranzas o descuentos de nómina.\n4. Si tus deudas superan la mínima cuantía, la solicitud debe presentarse con apoderado/a (art. 539 del CGP). Este servicio prepara el expediente; la representación se contrata por separado. Si ya tienes abogado/a, envíanos su poder.\n\n*Importante:* Las relaciones de acreedores y de bienes se presentan con corte al **último día del mes anterior** a la presentación de la solicitud. La **manifestación bajo juramento** no la tienes que enviar: va incluida en la solicitud que preparamos y tú la firmas.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo de **3 días hábiles** empieza a contar **desde que recibimos toda la documentación completa**, no desde tu pago. Si falta algo, te avisamos qué hace falta y el plazo inicia cuando esté completo.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este servicio prepara documentalmente tu expediente; no incluye representación jurídica, radicación ni asistencia a audiencias. No confirma admisibilidad, no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "07": {
    "id": "07",
    "file": "07-post-pago-seguimiento-natural.md",
    "group": "A-post-pago-servicios-en-linea",
    "meta": {
      "id": "07",
      "file": "07-post-pago-seguimiento-natural.md",
      "group": "A-post-pago-servicios-en-linea",
      "tipo": "Post-pago (automático)",
      "servicio": "Gestión y Control de Tu Trámite (Seguimiento)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`SEG_NAT`",
      "régimen": "`SEGUIMIENTO` · trámite de insolvencia en curso o acuerdo aprobado (CGP)",
      "tiempo_de_entrega": "Suscripción mensual",
      "cuándo_se_envía": "Una sola vez, al confirmarse el pago (Bold `SALE_APPROVED`, `pago_confirmado = true`)",
      "quién_envía": "Make, ruta de insolvencia (plan maestro F2), desde contacto@lyzbri.com",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Tu Gestión y Control de Tu Trámite (Seguimiento) · recibimos tu pago (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nRecibimos tu pago del servicio **Gestión y Control de Tu Trámite (Seguimiento)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar a estudiar tu caso necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. Solicitud de insolvencia presentada y sus anexos (lo que tengas).\n2. Decisión de aceptación, admisión o apertura del trámite, si ya existe.\n3. Datos del trámite: centro de conciliación, notaría o juzgado; número de radicado y canal de consulta.\n4. Notificaciones, requerimientos y comunicaciones recibidas.\n5. Escritos y propuestas que hayas presentado.\n6. Citaciones y actas de audiencias, y las fechas o términos pendientes que conozcas.\n\n**2. Soportes que fortalecen el análisis**\n1. Estado actual de los procesos ejecutivos o cobros que debieron suspenderse.\n2. Cambios relevantes en tus ingresos y gastos.\n\n**3. Solo si aplica a tu caso**\n1. **Si ya tienes acuerdo aprobado:** acuerdo y anexos; acta o decisión que lo aprobó; calendario de pagos y compromisos; comprobantes de los pagos realizados; reformas, si existen.\n2. Escritos de objeciones a créditos o inventarios presentados en el trámite.\n3. Si cambió tu identificación o tu apoderado/a: el documento que lo acredite.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Inicio del seguimiento:** tu seguimiento mensual se activa **cuando recibamos y verifiquemos la documentación de tu trámite**. Desde ese momento recibirás un reporte mensual de estado y alertas por los eventos y fechas que registremos.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** Este es un servicio de seguimiento documental: no incluye representación legal, radicación de escritos ni asistencia a audiencias, y no garantiza decisiones de la autoridad. Las alertas se generan a partir de los documentos, fechas y eventos que nos entregues. Por tratarse de un trabajo que realizamos con tu información, no admite devoluciones.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "08": {
    "id": "08",
    "file": "08-inicio-encargo-representacion-NO-comerciante.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "08",
      "file": "08-inicio-encargo-representacion-NO-comerciante.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Abogado de Insolvencia PN / Pequeño Comerciante (Representación)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`REP_NAT`",
      "régimen": "`PN_NC_CGP` · persona natural **no comerciante** (CGP, reformado por la Ley 2445 de 2025)",
      "tiempo_de_entrega": "el plazo del encargo pactado en la propuesta",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Abogado de Insolvencia PN / Pequeño Comerciante (Representación) (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Abogado de Insolvencia PN / Pequeño Comerciante (Representación)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. **Poder** para que actuemos como tus apoderadas: te enviamos el modelo para que lo firmes y nos lo devuelvas.\n2. Cédula (ambas caras) y tus datos completos de notificación: dirección física, correo electrónico y celular.\n3. Explicación, en tus palabras, de las causas por las que no pudiste seguir pagando. *Nosotros redactamos el informe formal.*\n4. Cuánto puedes pagar al mes y en qué plazo. *Nosotros estructuramos la propuesta de pago.*\n5. Relación completa de acreedores: nombre, dirección o correo de notificación (si lo conoces), capital, intereses, tipo de crédito, garantías y fecha de vencimiento o de inicio de la mora.\n6. Relación de **todos** tus bienes, incluidos los que tengas en el exterior, con sus soportes (certificados de tradición, tarjetas de propiedad, extractos).\n7. Relación de procesos judiciales y actuaciones contra tu patrimonio (ejecutivos, cobros coactivos, restituciones u otros), con juzgado o entidad y número de radicado, si lo tienes.\n8. Certificación o declaración de tus ingresos: certificado laboral o de pensión, desprendibles de nómina o, si eres independiente, la declaración de tus ingresos.\n9. Relación de los recursos de que dispones y de los gastos necesarios para tu subsistencia, la de las personas a tu cargo y la conservación de tus bienes.\n10. Información de tu sociedad conyugal o patrimonial (si estás casado/a o en unión marital).\n11. Obligaciones alimentarias a tu cargo (a favor de quién y por qué valor) y certificado del REDAM (Registro de Deudores Alimentarios Morosos).\n\n**2. Soportes que fortalecen el análisis**\n1. Tus instrucciones para negociar: cuánto puedes ofrecer como máximo y qué bienes es prioritario conservar.\n2. Extractos o certificaciones de saldo de cada deuda.\n3. Soportes de tus ingresos y de tus gastos mensuales.\n\n**3. Solo si aplica a tu caso**\n1. Si en los últimos dos años se liquidó tu sociedad conyugal o patrimonial o hubo separación de bienes: escritura pública o sentencia correspondiente.\n2. Soportes de libranzas o descuentos de nómina.\n3. Si el trámite ya comenzó: solicitud presentada y constancia de radicación; decisiones, actas y notificaciones; requerimientos con sus términos.\n4. Si se discuten créditos, bienes o votos: objeciones presentadas y sus soportes.\n5. Si existen acuerdos con acreedores o modificaciones: copia de esos acuerdos.\n6. Si vienes de otro/a abogado/a: soportes de las actuaciones realizadas hasta hoy.\n\n*Importante:* Esta lista corresponde a la **negociación de deudas**. Si tras la revisión la modalidad que procede es la convalidación de un acuerdo privado o la liquidación patrimonial, te indicaremos los documentos adicionales. Las relaciones de acreedores y de bienes llevan corte al **último día del mes anterior** a la presentación.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo del encargo pactado en la propuesta. El plazo empieza a contar **desde que recibimos toda la documentación completa**, el poder firmado cuando corresponda y el pago pactado. Si falta algo, te avisamos qué hace falta.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** La contratación no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. La representación no garantiza la admisión, la aprobación de la propuesta, la aceptación de los acreedores, la conservación de todos los bienes ni la extinción de todas las obligaciones. No incluye tarifas del centro de conciliación o de la notaría, avalúos ni gastos de terceros.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  },
  "09": {
    "id": "09",
    "file": "09-inicio-encargo-representacion-PEQUENA-comerciante.md",
    "group": "B-inicio-encargo-servicios-por-contacto",
    "meta": {
      "id": "09",
      "file": "09-inicio-encargo-representacion-PEQUENA-comerciante.md",
      "group": "B-inicio-encargo-servicios-por-contacto",
      "tipo": "Inicio de encargo (servicio por contacto, sin pago en línea)",
      "servicio": "Abogado de Insolvencia PN / Pequeño Comerciante (Representación)",
      "clave_catálogo_/_case_type": "`DEUDAS\\",
      "sku": "`REP_NAT`",
      "régimen": "`PN_PC_CGP` · persona natural **pequeña comerciante** (CGP; activos computables < 1.000 SMMLV)",
      "tiempo_de_entrega": "el plazo del encargo pactado en la propuesta",
      "cuándo_se_envía": "Cuando Liza confirma el encargo con el cliente (propuesta aceptada y pago pactado). **Nunca** al registrarse el lead",
      "quién_envía": "Make al marcar Liza el caso como encargo confirmado en HubSpot, o Liza manualmente",
      "estado_del_caso_tras_el_envío": "`PAGADO_SIN_DOCS`",
      "variables": "`{{nombre_cliente}}`, `{{radicado}}`, `{{enlace_carpeta_cliente}}`, `{{enlace_whatsapp}}`, `{{enlace_politica_datos}}`"
    },
    "asunto": "Inicio de tu encargo Abogado de Insolvencia PN / Pequeño Comerciante (Representación) (radicado {{radicado}}) — Lyzbri Legal",
    "cuerpo": "Hola, {{nombre_cliente}}:\n\nConfirmamos el inicio de tu encargo **Abogado de Insolvencia PN / Pequeño Comerciante (Representación)**. Gracias por confiar en Lyzbri Legal. Tu número de radicado es **{{radicado}}**; tenlo a mano en cualquier comunicación con nosotros.\n\n**Para empezar necesitamos que nos envíes estos documentos:**\n\n**1. Necesarios para tu caso**\n1. **Poder** para que actuemos como tus apoderadas: te enviamos el modelo para que lo firmes y nos lo devuelvas.\n2. Cédula (ambas caras) y tus datos completos de notificación: dirección física, correo electrónico y celular.\n3. Constancia o certificado de matrícula mercantil.\n4. Explicación, en tus palabras, de las causas por las que no pudiste seguir pagando. *Nosotros redactamos el informe formal.*\n5. Cuánto puedes pagar al mes y en qué plazo. *Nosotros estructuramos la propuesta de pago.*\n6. Relación completa de acreedores, personales y del negocio: nombre, dirección o correo de notificación (si lo conoces), capital, intereses, tipo de crédito, garantías y fecha de vencimiento o de inicio de la mora.\n7. Relación de **todos** tus bienes, personales y del negocio, incluidos los que tengas en el exterior, con sus soportes, indicando si alguno es tu **vivienda familiar** o tu **vehículo de trabajo**.\n8. Relación de procesos judiciales y actuaciones contra tu patrimonio (ejecutivos, cobros coactivos, restituciones u otros), con juzgado o entidad y número de radicado, si lo tienes.\n9. Certificación o declaración de tus ingresos personales y del negocio.\n10. Relación de los recursos de que dispones y de los gastos necesarios para tu subsistencia, la de las personas a tu cargo y la conservación de tus bienes.\n11. Información de tu sociedad conyugal o patrimonial (si estás casado/a o en unión marital).\n12. Obligaciones alimentarias a tu cargo (a favor de quién y por qué valor) y certificado del REDAM (Registro de Deudores Alimentarios Morosos).\n\n**2. Soportes que fortalecen el análisis**\n1. Tus instrucciones para negociar: cuánto puedes ofrecer como máximo y qué bienes es prioritario conservar.\n2. RUT con tu actividad comercial actualizada.\n3. Extractos o certificaciones de saldo de cada deuda, personales y del negocio.\n4. Soportes de tus ingresos y gastos, y balance o información básica del negocio.\n\n**3. Solo si aplica a tu caso**\n1. Soporte de la afectación a vivienda familiar o del patrimonio de familia, y soporte de que el vehículo es tu instrumento de trabajo, si aplica.\n2. Si en los últimos dos años se liquidó tu sociedad conyugal o patrimonial o hubo separación de bienes: escritura pública o sentencia correspondiente.\n3. Soportes de libranzas o descuentos de nómina.\n4. Si el trámite ya comenzó: solicitud presentada y constancia de radicación; decisiones, actas y notificaciones; requerimientos con sus términos.\n5. Si se discuten créditos, bienes o votos: objeciones presentadas y sus soportes.\n6. Si existen acuerdos con acreedores o modificaciones: copia de esos acuerdos.\n7. Si vienes de otro/a abogado/a: soportes de las actuaciones realizadas hasta hoy.\n\n*Importante:* Esta lista corresponde a la **negociación de deudas**. Si tras la revisión la modalidad que procede es la convalidación de un acuerdo privado o la liquidación patrimonial, te indicaremos los documentos adicionales. Las relaciones de acreedores y de bienes llevan corte al **último día del mes anterior** a la presentación.\n\n*Si no tienes alguno de los documentos de la sección 1, escríbenos por WhatsApp antes de subir: te indicamos cómo obtenerlo o con qué puede reemplazarse.*\n\n**Tiempo de entrega:** el plazo del encargo pactado en la propuesta. El plazo empieza a contar **desde que recibimos toda la documentación completa**, el poder firmado cuando corresponda y el pago pactado. Si falta algo, te avisamos qué hace falta.\n\n**¿Cómo enviar tus documentos?** Reúne tus documentos con calma y súbelos en tu **carpeta privada**, aquí: **{{enlace_carpeta_cliente}}** (solo para tu caso, radicado {{radicado}}). Puedes subirlos **de una vez o en varias sesiones**; el enlace no caduca.\n\n**Cuando termines de subir todo**, haz clic en **\"Ya terminé de subir\"** en esa misma página **y, además, envía tu confirmación al correo contacto@lyzbri.com** con el asunto **\"Ya terminé de subir - radicado {{radicado}}\"**. La confirmación por correo a contacto@lyzbri.com es **obligatoria**: sin ese correo no iniciamos la revisión de tu documentación.\n\n*El plazo no corre mientras reúnes y subes tus documentos; corre desde que confirmas (botón y correo a contacto@lyzbri.com) y verificamos que la documentación está completa.*\n\n**Ten en cuenta:** La contratación no suspende cobros ni embargos y no cancela deudas; esos efectos dependen de la autoridad competente. La representación no garantiza la admisión, la aprobación de la propuesta, la aceptación de los acreedores, la conservación de todos los bienes ni la extinción de todas las obligaciones. No incluye tarifas del centro de conciliación o de la notaría, avalúos ni gastos de terceros.\n\n**Tratamiento de datos:** al subir tus documentos a tu carpeta, autorizas el tratamiento de esos datos para los fines del servicio contratado, conforme a nuestra Política de Tratamiento de Datos Personales (Ley 1581 de 2012): {{enlace_politica_datos}}.\n\n**¿Dudas mientras reúnes o subes tus documentos?** Escríbenos por WhatsApp: {{enlace_whatsapp}}. Indica siempre tu radicado **{{radicado}}** para ayudarte más rápido.\n\nQuedamos atentos,\n**Equipo Lyzbri Legal**\ncontacto@lyzbri.com",
    "variables": [
      "radicado",
      "nombre_cliente",
      "enlace_carpeta_cliente",
      "enlace_politica_datos",
      "enlace_whatsapp"
    ]
  }
};

// Conversion de Markdown a HTML optimizado para clientes de correo (Gmail/Outlook/Apple Mail)
function markdownToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const html = [];
  let inUl = false;
  let inOl = false;

  function closeLists() {
    if (inUl) { html.push('</ul>'); inUl = false; }
    if (inOl) { html.push('</ol>'); inOl = false; }
  }

  function formatInline(text) {
    return text
      .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1a365d; text-decoration: underline; font-weight: 500;">$1</a>')
      .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 90%;">$1</code>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      closeLists();
      continue;
    }

    if (line.startsWith('#### ')) {
      closeLists();
      html.push('<h4 style="font-size: 15px; font-weight: bold; color: #1a365d; margin: 16px 0 8px 0;">' + formatInline(line.slice(5)) + '</h4>');
    } else if (line.startsWith('### ')) {
      closeLists();
      html.push('<h3 style="font-size: 16px; font-weight: bold; color: #1a365d; margin: 18px 0 8px 0;">' + formatInline(line.slice(4)) + '</h3>');
    } else if (line.startsWith('## ')) {
      closeLists();
      html.push('<h2 style="font-size: 18px; font-weight: bold; color: #1a365d; margin: 20px 0 10px 0;">' + formatInline(line.slice(3)) + '</h2>');
    } else if (line.startsWith('# ')) {
      closeLists();
      html.push('<h1 style="font-size: 20px; font-weight: bold; color: #1a365d; margin: 22px 0 12px 0;">' + formatInline(line.slice(2)) + '</h1>');
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inOl) { closeLists(); inOl = true; html.push('<ol style="margin: 8px 0 14px 22px; padding: 0; line-height: 1.6;">'); }
      const itemText = line.replace(/^\d+\.\s+/, '');
      html.push('<li style="margin-bottom: 6px;">' + formatInline(itemText) + '</li>');
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUl) { closeLists(); inUl = true; html.push('<ul style="margin: 8px 0 14px 22px; padding: 0; line-height: 1.6;">'); }
      const itemText = line.slice(2);
      html.push('<li style="margin-bottom: 6px;">' + formatInline(itemText) + '</li>');
    } else if (line.startsWith('> ')) {
      closeLists();
      html.push('<blockquote style="border-left: 4px solid #1a365d; padding: 8px 14px; margin: 14px 0; background: #f8fafc; color: #334155;">' + formatInline(line.slice(2)) + '</blockquote>');
    } else {
      closeLists();
      html.push('<p style="margin: 0 0 14px 0; line-height: 1.6;">' + formatInline(line) + '</p>');
    }
  }
  closeLists();

  return '<div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6; max-width: 620px; margin: 0 auto; padding: 10px;">\n' +
    html.join('\n') +
    '\n</div>';
}

// Selector determinista segun case_type + regimen (00-INDICE-PLANTILLAS-CORREOS.md)
function seleccionarPlantilla(criterios) {
  if (!criterios || typeof criterios !== 'object') {
    return { ok: false, error: 'MANUAL_REVIEW', motivo: 'criterios_no_provistos' };
  }

  const { case_type, regimen, momento, estado, alerta } = criterios;

  // 1. Grupo D: Alertas internas
  if (alerta) {
    if (alerta === 'PAGO_CONFIRMADO' || alerta === 'ENCARGO_CONFIRMADO') return { ok: true, id: '21', plantilla: CATALOGO_PLANTILLAS['21'] };
    if (alerta === 'CARGA_TERMINADA' || alerta === 'DOCS_SUBIDOS') return { ok: true, id: '22', plantilla: CATALOGO_PLANTILLAS['22'] };
    if (alerta === 'VENCIMIENTO_PLAZO' || alerta === 'VENCIMIENTO') return { ok: true, id: '23', plantilla: CATALOGO_PLANTILLAS['23'] };
  }

  // 2. Grupo C: Ciclo del caso
  if (momento || estado) {
    const est = estado || momento;
    if (est === 'LEAD_PENDIENTE_REVISION' || est === 'LEAD_RECIBIDO') return { ok: true, id: '14', plantilla: CATALOGO_PLANTILLAS['14'] };
    if (est === 'DOCS_INCOMPLETOS' || est === 'DOCUMENTACION_INCOMPLETA') return { ok: true, id: '15', plantilla: CATALOGO_PLANTILLAS['15'] };
    if (est === 'RECORDATORIO_DOCS' || est === 'RECORDATORIO') return { ok: true, id: '16', plantilla: CATALOGO_PLANTILLAS['16'] };
    if (est === 'DOCS_COMPLETOS_VERIFICADOS' || est === 'INICIO_PLAZO') return { ok: true, id: '17', plantilla: CATALOGO_PLANTILLAS['17'] };
    if (est === 'ENTREGADO' || est === 'ENTREGA_SERVICIO') return { ok: true, id: '18', plantilla: CATALOGO_PLANTILLAS['18'] };
    if (est === 'INACTIVO' || est === 'CASO_INACTIVO_DIA_30') return { ok: true, id: '19', plantilla: CATALOGO_PLANTILLAS['19'] };
    if (est === 'REACTIVACION' || est === 'REACTIVACION_CASO') return { ok: true, id: '20', plantilla: CATALOGO_PLANTILLAS['20'] };
  }

  // 3. Grupo A: Post-pago servicios en linea
  if (case_type === 'INSOLV_DIAG_NAT') {
    if (regimen === 'PN_NC_CGP') return { ok: true, id: '01', plantilla: CATALOGO_PLANTILLAS['01'] };
    if (regimen === 'PN_PC_CGP') return { ok: true, id: '02', plantilla: CATALOGO_PLANTILLAS['02'] };
  }
  if (case_type === 'INSOLV_MOD_NAT') {
    if (regimen === 'PN_NC_CGP') return { ok: true, id: '03', plantilla: CATALOGO_PLANTILLAS['03'] };
    if (regimen === 'PN_PC_CGP') return { ok: true, id: '04', plantilla: CATALOGO_PLANTILLAS['04'] };
  }
  if (case_type === 'INSOLV_NEG_NAT') {
    if (regimen === 'PN_NC_CGP') return { ok: true, id: '05', plantilla: CATALOGO_PLANTILLAS['05'] };
    if (regimen === 'PN_PC_CGP') return { ok: true, id: '06', plantilla: CATALOGO_PLANTILLAS['06'] };
  }
  if (case_type === 'INSOLV_SEG_NAT') {
    return { ok: true, id: '07', plantilla: CATALOGO_PLANTILLAS['07'] };
  }

  // 4. Grupo B: Inicio de encargo (servicios por contacto)
  if (case_type === 'INSOLV_REP_NAT') {
    if (regimen === 'PN_NC_CGP') return { ok: true, id: '08', plantilla: CATALOGO_PLANTILLAS['08'] };
    if (regimen === 'PN_PC_CGP') return { ok: true, id: '09', plantilla: CATALOGO_PLANTILLAS['09'] };
    // Por defecto requiere definicion de Liza entre 08 y 09
    return { ok: false, error: 'MANUAL_REVIEW', motivo: 'rep_nat_requiere_clasificacion_liza' };
  }
  if (case_type === 'INSOLV_DIAG_EMP') return { ok: true, id: '10', plantilla: CATALOGO_PLANTILLAS['10'] };
  if (case_type === 'INSOLV_EXP_EMP') return { ok: true, id: '11', plantilla: CATALOGO_PLANTILLAS['11'] };
  if (case_type === 'INSOLV_REORG_EMP') return { ok: true, id: '12', plantilla: CATALOGO_PLANTILLAS['12'] };
  if (case_type === 'INSOLV_SEG_EMP') return { ok: true, id: '13', plantilla: CATALOGO_PLANTILLAS['13'] };

  // Falla cerrada RC9: Sin coincidencia exacta -> MANUAL_REVIEW
  return {
    ok: false,
    error: 'MANUAL_REVIEW',
    motivo: 'sin_coincidencia_exacta_case_type_regimen',
    criterios: criterios
  };
}

// Renderizado y reemplazo estricto de variables
function renderizarPlantilla(id, variables) {
  const p = CATALOGO_PLANTILLAS[id];
  if (!p) {
    return { ok: false, error: 'plantilla_no_encontrada', id };
  }

  const vars = variables || {};

  // Valores predeterminados seguros para politicas y canales
  const defaults = {
    enlace_politica_datos: 'https://lyzbri.com/#politica-datos',
    enlace_whatsapp: vars.radicado 
      ? 'https://wa.me/573115872929?text=' + encodeURIComponent('Hola Liza, mi radicado es ' + vars.radicado)
      : 'https://wa.me/573115872929'
  };

  const merged = Object.assign({}, defaults, vars);

  let asunto = p.asunto;
  let cuerpo = p.cuerpo;

  // Reemplazo de todas las variables
  Object.keys(merged).forEach(k => {
    const val = (merged[k] !== undefined && merged[k] !== null) ? String(merged[k]) : '';
    const re = new RegExp('\\{\\{' + k + '\\}\\}', 'g');
    asunto = asunto.replace(re, val);
    cuerpo = cuerpo.replace(re, val);
  });

  // Verificacion de variables sin resolver: si queda algun {{...}}, se rechaza
  const pendientesAsunto = asunto.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  const pendientesCuerpo = cuerpo.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  const faltantes = Array.from(new Set(pendientesAsunto.concat(pendientesCuerpo).map(v => v.replace(/[\{\}]/g, ''))));

  if (faltantes.length > 0) {
    return {
      ok: false,
      error: 'variables_sin_resolver',
      faltantes: faltantes,
      id: id,
      asuntoParcial: asunto
    };
  }

  const bodyHtml = markdownToHtml(cuerpo);

  return {
    ok: true,
    id: id,
    archivo: p.file,
    grupo: p.group,
    asunto: asunto,
    cuerpoMarkdown: cuerpo,
    cuerpoHtml: bodyHtml,
    meta: p.meta
  };
}

module.exports = {
  CATALOGO_PLANTILLAS,
  markdownToHtml,
  seleccionarPlantilla,
  renderizarPlantilla
};
