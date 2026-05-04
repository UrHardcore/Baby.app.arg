/* ========================================
   BebeCare - Data Module
   Vaccination schedules, development milestones,
   tips, and reference information
   ======================================== */

const VACCINE_SCHEDULE = [
  { id: 'bcg', name: 'BCG', description: 'Tuberculosis', ageMonths: 0, ageDays: 0, ageLabel: 'Al nacer' },
  { id: 'hepb1', name: 'Hepatitis B', description: 'Primera dosis', ageMonths: 0, ageDays: 0, ageLabel: 'Al nacer' },
  { id: 'penta1', name: 'Pentavalente', description: 'DPT + HB + Hib - 1ra dosis', ageMonths: 2, ageDays: 0, ageLabel: '2 meses' },
  { id: 'ipv1', name: 'IPV (Salk)', description: 'Polio inactivada - 1ra dosis', ageMonths: 2, ageDays: 0, ageLabel: '2 meses' },
  { id: 'rotavirus1', name: 'Rotavirus', description: '1ra dosis', ageMonths: 2, ageDays: 0, ageLabel: '2 meses' },
  { id: 'neumo1', name: 'Neumococo conjugada', description: '1ra dosis', ageMonths: 2, ageDays: 0, ageLabel: '2 meses' },
  { id: 'penta2', name: 'Pentavalente', description: 'DPT + HB + Hib - 2da dosis', ageMonths: 4, ageDays: 0, ageLabel: '4 meses' },
  { id: 'ipv2', name: 'IPV (Salk)', description: 'Polio inactivada - 2da dosis', ageMonths: 4, ageDays: 0, ageLabel: '4 meses' },
  { id: 'rotavirus2', name: 'Rotavirus', description: '2da dosis', ageMonths: 4, ageDays: 0, ageLabel: '4 meses' },
  { id: 'neumo2', name: 'Neumococo conjugada', description: '2da dosis', ageMonths: 4, ageDays: 0, ageLabel: '4 meses' },
  { id: 'penta3', name: 'Pentavalente', description: 'DPT + HB + Hib - 3ra dosis', ageMonths: 6, ageDays: 0, ageLabel: '6 meses' },
  { id: 'ipv3', name: 'IPV (Salk)', description: 'Polio inactivada - 3ra dosis', ageMonths: 6, ageDays: 0, ageLabel: '6 meses' },
  { id: 'gripe1', name: 'Antigripal', description: '1ra dosis', ageMonths: 6, ageDays: 0, ageLabel: '6 meses' },
  { id: 'gripe2', name: 'Antigripal', description: '2da dosis (al mes de la 1ra)', ageMonths: 7, ageDays: 0, ageLabel: '7 meses' },
  { id: 'neumo3', name: 'Neumococo conjugada', description: 'Refuerzo', ageMonths: 12, ageDays: 0, ageLabel: '12 meses' },
  { id: 'triple1', name: 'Triple viral', description: 'Sarampion, rubeola, paperas - 1ra dosis', ageMonths: 12, ageDays: 0, ageLabel: '12 meses' },
  { id: 'hepatitisa1', name: 'Hepatitis A', description: 'Dosis unica', ageMonths: 12, ageDays: 0, ageLabel: '12 meses' },
  { id: 'varicela1', name: 'Varicela', description: '1ra dosis', ageMonths: 15, ageDays: 0, ageLabel: '15 meses' },
  { id: 'meningo', name: 'Meningococo', description: 'Refuerzo', ageMonths: 15, ageDays: 0, ageLabel: '15 meses' },
  { id: 'penta_ref', name: 'Pentavalente', description: 'Refuerzo', ageMonths: 18, ageDays: 0, ageLabel: '18 meses' },
  { id: 'ipv_ref', name: 'IPV (Salk)', description: 'Refuerzo', ageMonths: 18, ageDays: 0, ageLabel: '18 meses' },
  { id: 'triple2', name: 'Triple viral', description: 'Sarampion, rubeola, paperas - 2da dosis', ageMonths: 60, ageDays: 0, ageLabel: '5 anos' },
  { id: 'varicela2', name: 'Varicela', description: '2da dosis', ageMonths: 60, ageDays: 0, ageLabel: '5 anos' },
  { id: 'dpt_ref', name: 'DPT', description: 'Refuerzo', ageMonths: 60, ageDays: 0, ageLabel: '5-6 anos' },
  { id: 'ipv_ref2', name: 'IPV (Salk)', description: '2do refuerzo', ageMonths: 60, ageDays: 0, ageLabel: '5-6 anos' },
  { id: 'vph1', name: 'VPH', description: 'Virus papiloma humano - esquema segun pais', ageMonths: 120, ageDays: 0, ageLabel: '11 anos' },
];

const DEVELOPMENT_MILESTONES = [
  { ageMonths: 0, icon: '👶', label: 'Nacimiento', description: 'Reflejos basicos, agarra dedos' },
  { ageMonths: 1, icon: '👀', label: 'Fija mirada', description: 'Sigue objetos con la vista' },
  { ageMonths: 2, icon: '😊', label: 'Sonrisa social', description: 'Primera sonrisa intencional' },
  { ageMonths: 3, icon: '🗣', label: 'Gorjea', description: 'Emite sonidos, sostiene cabeza' },
  { ageMonths: 4, icon: '✋', label: 'Agarra objetos', description: 'Toma cosas con las manos' },
  { ageMonths: 5, icon: '🔄', label: 'Se da vuelta', description: 'Gira de boca abajo a arriba' },
  { ageMonths: 6, icon: '🪑', label: 'Se sienta', description: 'Se sienta con apoyo, balbuceo' },
  { ageMonths: 7, icon: '🦷', label: 'Primeros dientes', description: 'Pueden aparecer los incisivos' },
  { ageMonths: 8, icon: '👋', label: 'Dice adios', description: 'Imita gestos, extrana' },
  { ageMonths: 9, icon: '🐛', label: 'Gatea', description: 'Se desplaza gateando' },
  { ageMonths: 10, icon: '🧍', label: 'Se para', description: 'Se pone de pie con apoyo' },
  { ageMonths: 12, icon: '🚶', label: 'Primeros pasos', description: 'Camina con o sin apoyo' },
  { ageMonths: 15, icon: '🗣', label: 'Primeras palabras', description: 'Dice varias palabras sueltas' },
  { ageMonths: 18, icon: '🏃', label: 'Corre', description: 'Camina bien, empieza a correr' },
  { ageMonths: 24, icon: '💬', label: 'Frases', description: 'Arma frases de 2-3 palabras' },
  { ageMonths: 36, icon: '🎨', label: 'Creatividad', description: 'Dibuja, juega con otros' },
  { ageMonths: 48, icon: '✏️', label: 'Pre-escolar', description: 'Escribe su nombre, cuenta' },
  { ageMonths: 60, icon: '📚', label: 'Escolar', description: 'Lee, escribe, razona' },
];

const DAILY_TIPS = [
  'Habla y canta a tu bebe desde el primer dia. La estimulacion auditiva favorece el desarrollo del lenguaje.',
  'El contacto piel con piel fortalece el vinculo emocional y regula la temperatura del bebe.',
  'La lactancia materna es el mejor alimento durante los primeros 6 meses de vida.',
  'Coloca al bebe boca arriba para dormir. Es la posicion mas segura para prevenir la muerte subita.',
  'Cada bebe tiene su propio ritmo de desarrollo. No compares con otros ninos.',
  'El juego es la forma natural de aprender. Dedica tiempo a jugar con tu hijo cada dia.',
  'Leer cuentos desde temprana edad estimula la imaginacion y el vocabulario.',
  'Manten las vacunas al dia. Son la mejor proteccion contra enfermedades graves.',
  'La rutina da seguridad al bebe. Intenta mantener horarios regulares de comida y sueno.',
  'El llanto es la forma de comunicacion del bebe. Aprender a interpretarlo es clave.',
  'La vitamina D es importante para los huesos. Consulta con tu pediatra sobre suplementacion.',
  'El bano diario es un momento de relajacion y vinculo. Usa agua tibia (37 grados).',
  'Evita el uso de pantallas antes de los 2 anos. Prioriza la interaccion humana.',
  'La paciencia es tu mejor herramienta. Los primeros meses son desafiantes pero pasan rapido.',
  'Cuida tu salud mental. Un padre/madre sano cria hijos sanos.',
  'La alimentacion complementaria se inicia a los 6 meses. Comienza con alimentos suaves.',
  'Las siestas son fundamentales para el desarrollo cerebral del bebe.',
  'Mantene las unas del bebe cortas para evitar que se rasgunen.',
  'Los cambios de panal frecuentes previenen irritaciones en la piel.',
  'Consulta con tu pediatra ante cualquier duda. No hay preguntas tontas cuando se trata de tu bebe.',
];

const INFO_CONTENT = {
  feeding: {
    title: 'Alimentacion por Edades',
    sections: [
      {
        title: 'Lactancia Materna (0-6 meses)',
        content: `<p>La leche materna es el alimento ideal y exclusivo durante los primeros 6 meses de vida. Contiene todos los nutrientes necesarios y anticuerpos que protegen al bebe.</p>
<h4>Beneficios principales</h4>
<ul>
  <li>Proteccion inmunologica natural contra infecciones</li>
  <li>Mejor digestion y absorcion de nutrientes</li>
  <li>Fortalecimiento del vinculo madre-hijo</li>
  <li>Reduccion del riesgo de alergias</li>
  <li>Composicion que se adapta a las necesidades del bebe</li>
</ul>
<h4>Frecuencia recomendada</h4>
<ul>
  <li><strong>Recien nacido:</strong> cada 2-3 horas (8-12 veces al dia)</li>
  <li><strong>1-3 meses:</strong> cada 2.5-3 horas (7-9 veces al dia)</li>
  <li><strong>3-6 meses:</strong> cada 3-4 horas (6-8 veces al dia)</li>
</ul>
<h4>Senales de buena alimentacion</h4>
<ul>
  <li>6 o mas panales mojados al dia</li>
  <li>Deposiciones regulares</li>
  <li>Bebe satisfecho despues de alimentarse</li>
  <li>Ganancia de peso adecuada</li>
</ul>`
      },
      {
        title: 'Introduccion de Alimentos (6-12 meses)',
        content: `<p>A partir de los 6 meses se inicia la alimentacion complementaria manteniendo la lactancia.</p>
<h4>Primeros alimentos (6 meses)</h4>
<ul>
  <li>Cereales sin gluten (arroz, maiz)</li>
  <li>Verduras suaves: calabaza, zanahoria, zapallo</li>
  <li>Frutas: banana, manzana rallada, pera</li>
  <li>Texturas: pures suaves y homogeneos</li>
</ul>
<h4>A partir de 7-8 meses</h4>
<ul>
  <li>Carnes magras (pollo, ternera) bien trituradas</li>
  <li>Yema de huevo cocida</li>
  <li>Legumbres (lentejas, garbanzos) en pure</li>
  <li>Texturas mas gruesas, trocitos blandos</li>
</ul>
<h4>9-12 meses</h4>
<ul>
  <li>Pescado blanco (merluza, lenguado)</li>
  <li>Huevo entero bien cocido</li>
  <li>Yogur natural sin azucar</li>
  <li>Alimentos blandos en trocitos para practicar masticacion</li>
</ul>
<h4>Alimentos a evitar antes del ano</h4>
<ul>
  <li>Miel (riesgo de botulismo)</li>
  <li>Sal y azucar agregados</li>
  <li>Leche de vaca como bebida principal</li>
  <li>Frutos secos enteros (riesgo de atragantamiento)</li>
  <li>Embutidos y alimentos ultra-procesados</li>
</ul>`
      },
      {
        title: 'Nutricion 1-5 anos',
        content: `<p>La dieta debe ser variada y equilibrada, adaptada a la actividad y crecimiento del nino.</p>
<h4>Grupos de alimentos diarios</h4>
<ul>
  <li><strong>Lacteos:</strong> 2-3 porciones (leche, yogur, queso)</li>
  <li><strong>Frutas y verduras:</strong> 5 porciones variadas</li>
  <li><strong>Proteinas:</strong> 1-2 porciones (carne, pescado, huevo, legumbres)</li>
  <li><strong>Cereales:</strong> en cada comida (pan, arroz, pasta)</li>
  <li><strong>Agua:</strong> la mejor bebida, evitar jugos azucarados</li>
</ul>
<h4>Consejos importantes</h4>
<ul>
  <li>Respetar las senales de hambre y saciedad del nino</li>
  <li>Ofrecer variedad sin forzar</li>
  <li>Comer en familia siempre que sea posible</li>
  <li>Evitar distracciones (pantallas) durante las comidas</li>
  <li>Establecer horarios regulares de comidas</li>
</ul>`
      },
      {
        title: 'Gases en bebes',
        content: `<h4>Como identificar gases</h4>
<ul>
  <li>Llanto inconsolable, especialmente despues de comer</li>
  <li>Abdomen hinchado y tenso al tacto</li>
  <li>Piernas encogidas hacia el abdomen</li>
  <li>Inquietud y dificultad para dormir</li>
  <li>Eructos o flatulencias frecuentes</li>
</ul>
<h4>Como aliviarlos</h4>
<ul>
  <li><strong>Posicion vertical:</strong> sostener al bebe en posicion vertical despues de cada toma durante 15-20 minutos</li>
  <li><strong>Bicicleta:</strong> mover las piernitas del bebe como si pedaleara, suavemente</li>
  <li><strong>Masaje abdominal:</strong> masajear el abdomen en sentido de las agujas del reloj con movimientos suaves</li>
  <li><strong>Calor:</strong> una toalla tibia sobre el abdomen puede aliviar</li>
  <li><strong>Postura al amamantar:</strong> asegurar un buen agarre para evitar que trague aire</li>
  <li><strong>Biberon anti-colico:</strong> si usa biberon, elegir uno con sistema anti-colico</li>
</ul>`
      }
    ]
  },

  hygiene: {
    title: 'Higiene del Bebe',
    sections: [
      {
        title: 'Higiene de los Ojos',
        content: `<p>Los ojos del recien nacido requieren cuidado especial, ya que son sensibles a infecciones.</p>
<ul>
  <li>Limpiar con gasa esteril humedecida en suero fisiologico</li>
  <li>Limpiar desde el lagrimal hacia afuera (de adentro hacia afuera)</li>
  <li>Usar una gasa diferente para cada ojo</li>
  <li>Realizar la limpieza al menos 2 veces al dia</li>
  <li>Si hay secreciones amarillentas persistentes, consultar al pediatra</li>
  <li>No usar gotas ni colirios sin indicacion medica</li>
</ul>`
      },
      {
        title: 'Higiene de la Cara',
        content: `<ul>
  <li>Limpiar con algodones humedecidos en agua tibia</li>
  <li>Secar suavemente con toques, sin frotar</li>
  <li>Prestar atencion a los pliegues detras de las orejas</li>
  <li>Limpiar la nariz con suero fisiologico si hay mucosidad</li>
  <li>No introducir hisopos en los oidos, solo limpiar externamente</li>
  <li>Aplicar crema hidratante si la piel esta seca</li>
</ul>`
      },
      {
        title: 'Higiene del Cuerpo',
        content: `<h4>El bano</h4>
<ul>
  <li><strong>Temperatura del agua:</strong> 37 grados (verificar con termometro o codo)</li>
  <li><strong>Temperatura del ambiente:</strong> 22-24 grados</li>
  <li><strong>Duracion:</strong> 5-10 minutos</li>
  <li><strong>Frecuencia:</strong> diario o cada 2 dias</li>
  <li>Usar jabon neutro especial para bebes (pH neutro)</li>
  <li>Nunca dejar al bebe solo en el agua, ni por un segundo</li>
  <li>Secar bien todos los pliegues (cuello, axilas, ingle)</li>
</ul>
<h4>Zona del panal</h4>
<ul>
  <li>Cambiar el panal frecuentemente (cada 2-3 horas)</li>
  <li>Limpiar de adelante hacia atras (especialmente en ninas)</li>
  <li>Secar bien antes de poner el panal nuevo</li>
  <li>Aplicar crema protectora (oleo calcareo o crema de panal)</li>
  <li>Si hay enrojecimiento persistente, consultar al pediatra</li>
</ul>`
      },
      {
        title: 'Cuidado del Ombligo',
        content: `<p>El cordon umbilical se cae generalmente entre los 7 y 15 dias de vida.</p>
<ul>
  <li>Mantener la zona limpia y seca</li>
  <li>Limpiar con gasa y alcohol 70% en cada cambio de panal</li>
  <li>Doblar el panal por debajo del ombligo para que no lo cubra</li>
  <li>No cubrir con vendas ni fajas</li>
  <li>No tirar del cordon, se caera solo</li>
  <li>Es normal un leve sangrado al caerse</li>
</ul>
<h4>Consultar al medico si:</h4>
<ul>
  <li>Hay enrojecimiento alrededor del ombligo</li>
  <li>Sale pus o tiene mal olor</li>
  <li>Sangra de forma abundante</li>
  <li>No se cae despues de 3 semanas</li>
</ul>`
      }
    ]
  },

  symptoms: {
    title: 'Sintomas Comunes',
    sections: [
      {
        title: 'Tos',
        content: `<p>La tos es un mecanismo de defensa del cuerpo para limpiar las vias respiratorias.</p>
<h4>Tipos de tos</h4>
<ul>
  <li><strong>Tos seca:</strong> sin flema, puede ser irritativa. Comun en resfrios iniciales</li>
  <li><strong>Tos humeda/productiva:</strong> con flema. Indica que el cuerpo esta eliminando mucosidad</li>
  <li><strong>Tos perruna:</strong> sonido ronco, como ladrido. Puede indicar crup/laringitis</li>
  <li><strong>Tos con silbido:</strong> puede indicar bronquiolitis o asma</li>
</ul>
<h4>Cuando consultar al medico</h4>
<ul>
  <li>Bebe menor de 3 meses con tos</li>
  <li>Dificultad para respirar</li>
  <li>Labios o unas azuladas</li>
  <li>Tos que dura mas de 2 semanas</li>
  <li>Fiebre alta asociada</li>
  <li>Tos que impide dormir o alimentarse</li>
</ul>`
      },
      {
        title: 'Estornudos',
        content: `<p>Los estornudos son muy frecuentes en recien nacidos y rara vez indican enfermedad.</p>
<h4>Causas normales</h4>
<ul>
  <li>Limpieza natural de las fosas nasales</li>
  <li>Adaptacion al ambiente (polvo, perfumes, aire frio)</li>
  <li>Vias nasales estrechas del bebe</li>
  <li>Exposicion a luz brillante</li>
</ul>
<h4>Cuando preocuparse</h4>
<ul>
  <li>Si se acompanan de fiebre</li>
  <li>Si hay mucosidad abundante y espesa</li>
  <li>Si el bebe tiene dificultad para respirar</li>
  <li>Si rechaza la alimentacion</li>
</ul>`
      },
      {
        title: 'Mocos y Congestion',
        content: `<h4>Como actuar</h4>
<ul>
  <li>Usar suero fisiologico nasal (2-3 gotas por fosa nasal)</li>
  <li>Aspirar suavemente con pera de goma o aspirador nasal</li>
  <li>Elevar ligeramente la cabecera de la cuna</li>
  <li>Mantener el ambiente humidificado</li>
  <li>Ofrecer liquidos frecuentemente</li>
  <li>No usar descongestionantes sin indicacion medica</li>
</ul>
<h4>Color del moco y significado</h4>
<ul>
  <li><strong>Transparente:</strong> normal, limpieza natural</li>
  <li><strong>Blanco:</strong> congestion leve, resfrio comun</li>
  <li><strong>Amarillo:</strong> infeccion en proceso, el cuerpo esta luchando</li>
  <li><strong>Verde:</strong> infeccion mas avanzada, consultar al medico</li>
  <li><strong>Con sangre:</strong> irritacion nasal por sequedad o limpieza excesiva</li>
</ul>`
      },
      {
        title: 'Laganas (Secreciones oculares)',
        content: `<p>Las secreciones oculares son comunes en recien nacidos debido a la inmadurez del conducto lagrimal.</p>
<h4>Causas comunes</h4>
<ul>
  <li><strong>Obstruccion del conducto lagrimal:</strong> muy frecuente, generalmente se resuelve solo antes del ano</li>
  <li><strong>Conjuntivitis:</strong> infeccion que requiere tratamiento medico</li>
  <li><strong>Irritacion:</strong> por polvo, humo u otros agentes</li>
</ul>
<h4>Cuidados</h4>
<ul>
  <li>Limpiar con gasa esteril y suero fisiologico</li>
  <li>Masajear suavemente el lagrimal (esquina interna del ojo) hacia abajo</li>
  <li>No usar gotas sin indicacion medica</li>
  <li>Consultar si las secreciones son amarillas/verdes o si hay hinchazom</li>
</ul>`
      }
    ]
  },

  interpretation: {
    title: 'Guia de Interpretacion',
    sections: [
      {
        title: 'Tipos de Llanto',
        content: `<p>El llanto es la principal forma de comunicacion del bebe. Aprender a diferenciarlo te ayudara enormemente.</p>
<h4>Llanto de hambre</h4>
<ul>
  <li>Ritmico y repetitivo: "naa... naa... naa..."</li>
  <li>Se intensifica gradualmente</li>
  <li>El bebe busca el pecho/biberon, se lleva las manos a la boca</li>
  <li>Se calma al alimentarlo</li>
</ul>
<h4>Llanto de sueno/cansancio</h4>
<ul>
  <li>Quejumbroso, intermitente</li>
  <li>Se frota los ojos y las orejas</li>
  <li>Bosteza, mira fijamente</li>
  <li>Se calma al mecerlo o acunarlo</li>
</ul>
<h4>Llanto de dolor/malestar</h4>
<ul>
  <li>Agudo, repentino, intenso</li>
  <li>Puede ser un grito seguido de apnea (pausa)</li>
  <li>Cara enrojecida, cuerpo tenso</li>
  <li>No se calma facilmente</li>
</ul>
<h4>Llanto de colico</h4>
<ul>
  <li>Inconsolable, generalmente al atardecer/noche</li>
  <li>Dura mas de 3 horas, mas de 3 dias a la semana</li>
  <li>Piernas encogidas, punos cerrados</li>
  <li>Abdomen tenso e hinchado</li>
</ul>
<h4>Llanto de aburrimiento/estimulacion</h4>
<ul>
  <li>Intermitente, como "llamando la atencion"</li>
  <li>Se calma al tomarlo en brazos o hablarle</li>
  <li>Busca contacto visual</li>
</ul>`
      },
      {
        title: 'Materia Fecal: Colores y Significado',
        content: `<p>El color y la consistencia de las deposiciones del bebe son indicadores importantes de su salud.</p>
<div class="color-guide">
  <div class="color-item">
    <div class="color-dot" style="background: #1a3d1a"></div>
    <div class="color-info">
      <div class="color-name">Verde oscuro/negro (Meconio)</div>
      <div class="color-desc">Normal en los primeros 2-3 dias de vida. Es pegajoso y sin olor.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #8B7D3C"></div>
    <div class="color-info">
      <div class="color-name">Verde amarillento (Transicion)</div>
      <div class="color-desc">Normal entre el dia 3 y 5. Indica la transicion del meconio.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #DAA520"></div>
    <div class="color-info">
      <div class="color-name">Amarillo mostaza</div>
      <div class="color-desc">Normal en bebes amamantados. Puede tener grumos. Frecuente y liquida.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #8B6914"></div>
    <div class="color-info">
      <div class="color-name">Amarillo oscuro/marron</div>
      <div class="color-desc">Normal en bebes con formula. Mas consistente y con olor mas fuerte.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #556B2F"></div>
    <div class="color-info">
      <div class="color-name">Verde</div>
      <div class="color-desc">Puede indicar que toma mucho foremilk, sensibilidad alimentaria, o es normal con ciertos alimentos.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #8B0000"></div>
    <div class="color-info">
      <div class="color-name">Rojo (con sangre)</div>
      <div class="color-desc">Consultar al medico. Puede ser fisura anal, alergia a proteina de leche, o infeccion.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #F5F5DC; border-color: #999"></div>
    <div class="color-info">
      <div class="color-name">Blanco/gris palido</div>
      <div class="color-desc">ALERTA: Consulta urgente. Puede indicar problemas hepaticos o biliares.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #1a1a1a"></div>
    <div class="color-info">
      <div class="color-name">Negro (despues del meconio)</div>
      <div class="color-desc">ALERTA: Consultar al medico. Puede indicar sangrado digestivo alto.</div>
    </div>
  </div>
</div>`
      },
      {
        title: 'Orina: Colores y Alertas',
        content: `<p>La orina del bebe normalmente es clara y sin olor fuerte. Cambios pueden indicar deshidratacion u otros problemas.</p>
<div class="color-guide">
  <div class="color-item">
    <div class="color-dot" style="background: #FFFACD"></div>
    <div class="color-info">
      <div class="color-name">Amarillo claro/transparente</div>
      <div class="color-desc">Normal. Indica buena hidratacion.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #FFD700"></div>
    <div class="color-info">
      <div class="color-name">Amarillo intenso</div>
      <div class="color-desc">Puede indicar concentracion por poca ingesta de liquidos. Aumentar tomas.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #FF8C00"></div>
    <div class="color-info">
      <div class="color-name">Naranja</div>
      <div class="color-desc">En recien nacidos puede ser cristales de urato (normal primeros dias). Despues, consultar.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #FF69B4"></div>
    <div class="color-info">
      <div class="color-name">Rosado/rojo</div>
      <div class="color-desc">En recien nacidos: cristales de urato (normal). En bebes mayores: consultar, puede indicar sangre.</div>
    </div>
  </div>
  <div class="color-item">
    <div class="color-dot" style="background: #8B4513"></div>
    <div class="color-info">
      <div class="color-name">Marron oscuro</div>
      <div class="color-desc">ALERTA: Puede indicar deshidratacion severa. Consultar urgente.</div>
    </div>
  </div>
</div>
<h4>Frecuencia normal de panales mojados</h4>
<ul>
  <li><strong>Dia 1-2:</strong> 1-2 panales mojados</li>
  <li><strong>Dia 3-4:</strong> 3-4 panales mojados</li>
  <li><strong>Dia 5 en adelante:</strong> 6 o mas panales mojados (indica buena alimentacion)</li>
</ul>`
      }
    ]
  },

  development: {
    title: 'Desarrollo del Bebe',
    sections: [
      {
        title: 'La Sonrisa Social',
        content: `<p>Una de las primeras interacciones sociales del bebe.</p>
<ul>
  <li><strong>Cuando aparece:</strong> entre las 6 y 8 semanas de vida</li>
  <li><strong>Que es:</strong> una sonrisa intencional en respuesta a un estimulo (tu voz, tu cara)</li>
  <li>Antes de esto, las sonrisas son reflejas (durante el sueno, por ejemplo)</li>
  <li>Es un hito importante del desarrollo social y emocional</li>
</ul>
<h4>Como estimularla</h4>
<ul>
  <li>Hablarle y sonreirle frecuentemente</li>
  <li>Hacer contacto visual a 20-30 cm de distancia</li>
  <li>Imitar sus expresiones faciales</li>
  <li>Cantar canciones suaves</li>
</ul>`
      },
      {
        title: 'Gateo',
        content: `<p>El gateo es una etapa importante para el desarrollo motor y cognitivo.</p>
<ul>
  <li><strong>Cuando:</strong> la mayoria entre los 7 y 10 meses</li>
  <li>Algunos bebes no gatean y pasan directo a caminar (es normal)</li>
  <li>Puede empezar con desplazamiento hacia atras o arrastrarse</li>
</ul>
<h4>Tipos de gateo</h4>
<ul>
  <li><strong>Clasico:</strong> manos y rodillas alternando</li>
  <li><strong>Comando:</strong> arrastandose con los codos</li>
  <li><strong>De oso:</strong> con manos y pies (sin rodillas)</li>
  <li><strong>Sentado:</strong> se desplaza sentado usando las manos</li>
</ul>
<h4>Como estimularlo</h4>
<ul>
  <li>Tiempo boca abajo supervisado desde los primeros meses</li>
  <li>Colocar juguetes fuera de su alcance para motivarlo</li>
  <li>Crear un espacio seguro en el piso</li>
  <li>No usar andador (retrasa el desarrollo motor)</li>
</ul>`
      },
      {
        title: 'Primeros Pasos',
        content: `<p>Caminar es uno de los hitos mas esperados y emocionantes.</p>
<ul>
  <li><strong>Cuando:</strong> la mayoria entre los 9 y 18 meses</li>
  <li><strong>Promedio:</strong> alrededor de los 12 meses</li>
  <li>Primero se para con apoyo, luego camina agarrado, luego solo</li>
</ul>
<h4>Etapas previas</h4>
<ul>
  <li>Se pone de pie agarrandose de muebles (8-10 meses)</li>
  <li>Camina de lado agarrado (crucero) (9-12 meses)</li>
  <li>Se suelta brevemente (10-13 meses)</li>
  <li>Primeros pasos independientes (12-15 meses)</li>
</ul>
<h4>Calzado</h4>
<ul>
  <li>En casa: descalzo o con medias antideslizantes</li>
  <li>Exterior: zapatos flexibles con suela blanda</li>
  <li>Evitar zapatos rigidos que limiten el movimiento del pie</li>
</ul>`
      },
      {
        title: 'Salida de Dientes',
        content: `<p>La denticion puede generar molestias pero es un proceso normal.</p>
<h4>Cronologia aproximada</h4>
<ul>
  <li><strong>6-10 meses:</strong> incisivos centrales inferiores</li>
  <li><strong>8-12 meses:</strong> incisivos centrales superiores</li>
  <li><strong>9-13 meses:</strong> incisivos laterales superiores</li>
  <li><strong>10-16 meses:</strong> incisivos laterales inferiores</li>
  <li><strong>13-19 meses:</strong> primeros molares</li>
  <li><strong>16-23 meses:</strong> caninos</li>
  <li><strong>23-33 meses:</strong> segundos molares</li>
</ul>
<h4>Sintomas comunes</h4>
<ul>
  <li>Irritabilidad y llanto</li>
  <li>Babeo excesivo</li>
  <li>Necesidad de morder todo</li>
  <li>Encias hinchadas y enrojecidas</li>
  <li>Posible fiebre baja (menor a 38 grados)</li>
  <li>Dificultad para dormir</li>
</ul>
<h4>Como aliviar</h4>
<ul>
  <li>Mordedores frios (no congelados)</li>
  <li>Masajear las encias con el dedo limpio</li>
  <li>Ofrecer alimentos frios si ya come solidos</li>
  <li>Consultar al pediatra sobre analgesicos si hay mucho dolor</li>
</ul>`
      }
    ]
  },

  tips: {
    title: 'Consejos Generales',
    sections: [
      {
        title: 'El Sueno del Bebe',
        content: `<h4>Horas de sueno recomendadas</h4>
<ul>
  <li><strong>Recien nacido (0-3 meses):</strong> 14-17 horas</li>
  <li><strong>4-11 meses:</strong> 12-15 horas</li>
  <li><strong>1-2 anos:</strong> 11-14 horas</li>
  <li><strong>3-5 anos:</strong> 10-13 horas</li>
  <li><strong>6-10 anos:</strong> 9-12 horas</li>
</ul>
<h4>Sueno seguro</h4>
<ul>
  <li>Siempre boca arriba para dormir</li>
  <li>Colchon firme sin almohadas, peluches ni sabanas sueltas</li>
  <li>Temperatura de la habitacion: 20-22 grados</li>
  <li>No abrigar en exceso</li>
  <li>Lo ideal es que duerma en su cuna en la habitacion de los padres los primeros 6-12 meses</li>
</ul>
<h4>Rutina de sueno</h4>
<ul>
  <li>Establecer una rutina consistente (bano, cuento, cancion)</li>
  <li>Mantener horarios regulares</li>
  <li>Reducir estimulacion y luz 30 minutos antes</li>
  <li>Aprender a reconocer las senales de sueno</li>
  <li>Dejar que se quede dormido en su cuna (no siempre en brazos)</li>
</ul>`
      },
      {
        title: 'Estimulacion Temprana',
        content: `<p>La estimulacion adecuada promueve el desarrollo integral del bebe.</p>
<h4>0-3 meses</h4>
<ul>
  <li>Contacto piel con piel</li>
  <li>Hablarle, cantarle, leerle</li>
  <li>Mostrar objetos de colores contrastantes</li>
  <li>Tummy time (tiempo boca abajo) supervisado</li>
</ul>
<h4>3-6 meses</h4>
<ul>
  <li>Ofrecer juguetes de diferentes texturas</li>
  <li>Juegos de escondidas (cucutas)</li>
  <li>Sentarlo con apoyo para que vea el entorno</li>
  <li>Musica y sonidos variados</li>
</ul>
<h4>6-12 meses</h4>
<ul>
  <li>Juegos de encajar y apilar</li>
  <li>Dejar explorar en un espacio seguro</li>
  <li>Nombrar objetos y personas</li>
  <li>Lectura de cuentos con imagenes</li>
</ul>
<h4>1-3 anos</h4>
<ul>
  <li>Juegos de imitacion</li>
  <li>Pintar, dibujar, plasticina</li>
  <li>Juego al aire libre</li>
  <li>Canciones con movimiento</li>
</ul>`
      },
      {
        title: 'Seguridad en el Hogar',
        content: `<p>A medida que el bebe crece y se desplaza, es fundamental adaptar el hogar.</p>
<h4>Prevencion de accidentes</h4>
<ul>
  <li>Proteger enchufes electricos con tapas de seguridad</li>
  <li>Colocar trabas en cajones y puertas de muebles</li>
  <li>Instalar rejas en escaleras (arriba y abajo)</li>
  <li>Anclar muebles pesados a la pared</li>
  <li>Guardar productos de limpieza y medicamentos fuera de alcance</li>
  <li>No dejar objetos pequenos accesibles (riesgo de atragantamiento)</li>
  <li>Proteger esquinas de mesas con protectores</li>
</ul>
<h4>En el agua</h4>
<ul>
  <li>Nunca dejar solo al bebe en la banera, ni un segundo</li>
  <li>Verificar temperatura del agua antes del bano</li>
  <li>Vigilar cerca de piletas, baldes o cualquier recipiente con agua</li>
</ul>
<h4>En el auto</h4>
<ul>
  <li>Siempre usar silla de auto (butaca) homologada</li>
  <li>Hasta los 2 anos: mirando hacia atras</li>
  <li>Nunca dejar al bebe solo en el auto</li>
</ul>
<h4>Telefono de emergencias</h4>
<ul>
  <li>Tener a mano el numero de emergencias y del pediatra</li>
  <li>Aprender maniobras basicas de RCP infantil</li>
  <li>Conocer la maniobra de Heimlich para bebes</li>
</ul>`
      }
    ]
  }
};
