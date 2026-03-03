/**
 * Tipos de vista disponibles para listados.
 * - table: vista de tabla con filas
 * - gallery: vista de cuadrícula con tarjetas
 * - calendar: vista de calendario (solo tareas y proyectos)
 */
export type ViewType = 'table' | 'gallery' | 'calendar';

/**
 * Tipos de vista simplificados (sin calendario).
 * Usado en IDEAS y BOXES que no tienen lógica de fechas.
 */
export type SimpleViewType = 'table' | 'gallery';
