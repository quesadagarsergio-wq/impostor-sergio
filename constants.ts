import { WordPair, WordPack } from './types';

export const DEFAULT_WORDS: WordPair[] = [
  { id: 'u1', word: 'Astiz', hint: 'epa' },
  { id: 'u2', word: 'Eduardo', hint: 'YouTube' },
  { id: 'u3', word: 'bildu', hint: 'ruina' },
  { id: 'u4', word: 'vallejos', hint: 'bugatti' },
  { id: 'u5', word: 'javo', hint: 'inventor' },
  { id: 'u6', word: 'españa', hint: 'above' },
];

export const OFFICIAL_PACKS: WordPack[] = [
  {
    id: 'pack_easy',
    name: 'Nivel Principiante',
    description: 'Palabras cotidianas y objetos comunes. Ideal para empezar.',
    difficulty: 'Fácil',
    words: [
      { id: 'e1', word: 'Pizza', hint: 'Comida' },
      { id: 'e2', word: 'Perro', hint: 'Animal' },
      { id: 'e3', word: 'Sol', hint: 'Estrella' },
      { id: 'e4', word: 'Coche', hint: 'Transporte' },
      { id: 'e5', word: 'Libro', hint: 'Lectura' },
      { id: 'e6', word: 'Agua', hint: 'Líquido' },
      { id: 'e7', word: 'Fuego', hint: 'Calor' },
      { id: 'e8', word: 'Árbol', hint: 'Planta' },
      { id: 'e9', word: 'Teléfono', hint: 'Comunicación' },
      { id: 'e10', word: 'Reloj', hint: 'Tiempo' },
      { id: 'e11', word: 'Zapato', hint: 'Vestimenta' },
      { id: 'e12', word: 'Mesa', hint: 'Mueble' },
      { id: 'e13', word: 'Avión', hint: 'Vuelo' },
      { id: 'e14', word: 'Manzana', hint: 'Fruta' },
      { id: 'e15', word: 'Guitarra', hint: 'Música' },
      { id: 'e16', word: 'Pelota', hint: 'Juego' },
      { id: 'e17', word: 'Luna', hint: 'Noche' },
      { id: 'e18', word: 'Gafas', hint: 'Vista' },
      { id: 'e19', word: 'Maleta', hint: 'Viaje' },
      { id: 'e20', word: 'Silla', hint: 'Asiento' }
    ]
  },
  {
    id: 'pack_medium',
    name: 'Nivel Intermedio',
    description: 'Términos más específicos que requieren descripciones creativas.',
    difficulty: 'Media',
    words: [
      { id: 'm1', word: 'Brújula', hint: 'Dirección' },
      { id: 'm2', word: 'Telescopio', hint: 'Espacio' },
      { id: 'm3', word: 'Termómetro', hint: 'Grados' },
      { id: 'm4', word: 'Micrófono', hint: 'Sonido' },
      { id: 'm5', word: 'Microscopio', hint: 'Célula' },
      { id: 'm6', word: 'Satélite', hint: 'Órbita' },
      { id: 'm7', word: 'Volcán', hint: 'Lava' },
      { id: 'm8', word: 'Desierto', hint: 'Arena' },
      { id: 'm9', word: 'Tornado', hint: 'Viento' },
      { id: 'm10', word: 'Terremoto', hint: 'Sismo' },
      { id: 'm11', word: 'Glaciar', hint: 'Hielo' },
      { id: 'm12', word: 'Catedral', hint: 'Iglesia' },
      { id: 'm13', word: 'Rascacielos', hint: 'Edificio' },
      { id: 'm14', word: 'Submarino', hint: 'Profundidad' },
      { id: 'm15', word: 'Paracaídas', hint: 'Caída' },
      { id: 'm16', word: 'Escultura', hint: 'Arte' },
      { id: 'm17', word: 'Arquitectura', hint: 'Diseño' },
      { id: 'm18', word: 'Sinfonía', hint: 'Orquesta' },
      { id: 'm19', word: 'Manuscrito', hint: 'Papel' },
      { id: 'm20', word: 'Algoritmo', hint: 'Cálculo' }
    ]
  },
  {
    id: 'pack_hard',
    name: 'Nivel Experto',
    description: 'Conceptos abstractos y palabras raras. Solo para profesionales.',
    difficulty: 'Dificil',
    words: [
      { id: 'd1', word: 'Entropía', hint: 'Desorden' },
      { id: 'd2', word: 'Paradoja', hint: 'Contradicción' },
      { id: 'd3', word: 'Efímero', hint: 'Breve' },
      { id: 'd4', word: 'Ubicuidad', hint: 'Presencia' },
      { id: 'd5', word: 'Onírico', hint: 'Sueño' },
      { id: 'd6', word: 'Inefable', hint: 'Indescriptible' },
      { id: 'd7', word: 'Serendipia', hint: 'Hallazgo' },
      { id: 'd8', word: 'Resiliencia', hint: 'Adaptación' },
      { id: 'd9', word: 'Ataraxia', hint: 'Calma' },
      { id: 'd10', word: 'Etéreo', hint: 'Luz' },
      { id: 'd11', word: 'Quimera', hint: 'Ilusión' },
      { id: 'd12', word: 'Melancolía', hint: 'Tristeza' },
      { id: 'd13', word: 'Nostalgia', hint: 'Pasado' },
      { id: 'd14', word: 'Epifanía', hint: 'Revelación' },
      { id: 'd15', word: 'Catarsis', hint: 'Liberación' },
      { id: 'd16', word: 'Idiosincrasia', hint: 'Carácter' },
      { id: 'd17', word: 'Soliloquio', hint: 'Discurso' },
      { id: 'd18', word: 'Neologismo', hint: 'Término' },
      { id: 'd19', word: 'Anacronismo', hint: 'Tiempo' },
      { id: 'd20', word: 'Eufemismo', hint: 'Suavizado' }
    ]
  }
];

export const STORAGE_KEY = 'impostor_game_words';