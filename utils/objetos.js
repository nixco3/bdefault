let notif_level = {
  ALL_MESSAGES: "Todos los Mensajes",
  ONLY_MENTIONS: "Solo menciones"
}

let exp_content_filter = {
      DISABLED: "Desactivado",
      MEMBERS_WITHOUT_ROLES: "Miembros sin Roles",
      ALL_MEMBERS: "Todos los Miembros"
    }
let mfa_level = {
      NONE: "Ninguno",
      ELEVATED: "Elevado"
    }
let verif_level = {
      NONE: "Ninguno",
      LOW: "Bajo",
      MEDIUM: "Medio",
      HIGH: "Alto",
      VERY_HIGH: "Muy alto"
    }
let nsfw_level = {
      DEFAULT: "Por defecto",
      EXPLICIT: "Explícito",
      SAFE: "Seguro",
      AGE_RESTRICTED: "Restricción de Edad"
    }

let premium_tier = {
       NONE: "Nivel 0",
       TIER_1: "Nivel 1",
       TIER_2: "Nivel 2",
       TIER_3: "Nivel 3", 
    }

let guild_features = {
      ANIMATED_ICON: "Ícono Animado",
      BANNER: "Banner",
      COMMERCE: "Comercio Habilitado",
      COMMUNITY: "Comunidad Habilitada",
      DISCOVERABLE: "Descubrimiento Habilitado",
      FEATURABLE: "Destacable",
      INVITE_SPLASH: "Fondo de Invitación",
      MEMBER_VERIFICATION_GATE_ENABLED: "Cribado de Miembros Habilitado",
      MONETIZATION_ENABLED: "Monetización Habilitada",
      MORE_STICKERS: "Más Stickers",
      NEWS: "Anuncios",
      PARTNERED: "Socio de Discord",
      PREVIEW_ENABLED: "Vista Previa Habilitada",
      PRIVATE_THREADS: "Hilos Privados",
      ROLE_ICONS: "Íconos de Roles",
      NEW_THREAD_PERMISSIONS: "Nuevos permisos de Hilos",
      THREADS_ENABLED: "Hilos Habilitados",
      SEVEN_DAY_THREAD_ARCHIVE: "Archivar Hilos en 7 días",
      THREE_DAY_THREAD_ARCHIVE: "Archivar Hilos en 3 días",
      TICKETED_EVENTS_ENABLED: "Eventos Habilitados",
      VANITY_URL: "Invitación Personalizada",
      VERIFIED: "Verificado",
      VIP_REGIONS: "Regiones VIP",
      WELCOME_SCREEN_ENABLED: "Pantalla de Bienvenidas Habilitada"
    };

module.exports = { 
notif_level,
exp_content_filter,
mfa_level,
verif_level,
nsfw_level,
premium_tier,
guild_features }