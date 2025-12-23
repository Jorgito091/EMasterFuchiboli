# Documentación del Proyecto: EMaster Fuchiboli

## Introducción
**EMaster Fuchiboli** es una plataforma integral de gestión de ligas de fútbol virtual. Diseñada para ofrecer una experiencia profesional de "Manager", integrando finanzas reales, mercado de fichajes y seguimiento de torneos en tiempo real.

## Arquitectura del Sistema (El "Porqué")
El sistema está construido siguiendo principios de modularidad:
- **React + TS**: Para una interfaz robusta y libre de errores de tipo.
- **Capa de Servicios**: Aísla la lógica de la API de la vista, permitiendo que las pantallas solo se encarguen de mostrar datos.
- **Persistencia Inteligente**: Los datos de sesión y preferencias de tema se mantienen entre sesiones gracias a la sincronización con el navegador.

## Pantallas y Funcionamiento Detallado

### 1. Inicio de Sesión (Login)
- **Lógica**: Utiliza cifrado SHA-256 para mayor seguridad. No solo autentica, sino que carga la "Temporada Activa" global, configurando el entorno de trabajo para el resto de la aplicación.

### 2. Temporada (El Corazón de la Liga)
- **General**: Muestra la Tabla General con reglas de clasificación europeas (Champions, Europa League, Descenso) visualmente diferenciadas por colores.
- **Jornadas**: Implementa un sistema de filtros dinámicos. El usuario puede ver la jornada actual o filtrar por su equipo para saber exactamente qué partidos tiene pendientes de reportar.

### 3. Equipos y Economía
- **Visión Global**: No es solo una lista. Es un auditor financiero que muestra el "Costo de Plantilla" vs "Presupuesto".
- **Por qué**: Permite detectar rápidamente si un equipo está en quiebra técnica o si tiene margen para fichar.

### 4. Detalle de Equipo (Gestión Interna)
- **Plantilla**: Permite ver la media y el potencial de cada jugador. Los jugadores "Bloqueados" indican que no están disponibles para traspaso inmediato.
- **Detalle Financiero**: Desglose contable. Cada euro está justificado por un concepto (premio, venta, etc.), lo que evita malentendidos en la administración de la liga.

### 5. Mercado de Jugadores
- **Lógica de Mercado**: Un buscador potente con debounce. Permite a los administradores crear nuevos talentos y a los usuarios explorar el mercado global. La integración de escudos de equipo ayuda a identificar rápidamente dónde juega cada futbolista.

### 6. Transferencias (Libro de Pases)
- **Balance**: Calcula automáticamente el balance de "Entradas vs Salidas". Es vital para el "Fair Play Financiero" de la liga.

### 7. Noticias y Comunidad
- **Comunicación**: Sistema de anuncios con soporte para imágenes. Permite mantener a los usuarios informados sobre cierres de mercado, sanciones o nuevos torneos.

### 8. Configuración
- **Personalización**: Control del Modo Oscuro/Claro que se adapta a cualquier entorno de iluminación, mejorando la usabilidad durante sesiones largas de gestión.

---
*Para detalles técnicos sobre la implementación de la API y el estado global, consulte [TECNICO.md](file:///Users/podz/Documents/Proyectos/EMasterFuchiboli-main/TECNICO.md).*
