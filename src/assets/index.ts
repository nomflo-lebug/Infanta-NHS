// Centralized asset exports bundled with Vite asset pipeline
import inhsLogoImg from './aistudio/INHS_LOGO_v2_3c57a62d.png';
import campusFacadeImg from './images/school_campus_facade_1793804196290.jpg';
import studentLifeImg from './images/school_student_life_1793804199202.jpg';
import scienceLabImg from './images/classroom_stem_laboratory_1793804197413.jpg';
import sealEmblemImg from './images/school_seal_emblem_1793804197660.jpg';

export const APP_ASSETS = {
  logo: inhsLogoImg,
  campusFacade: campusFacadeImg,
  studentLife: studentLifeImg,
  scienceLab: scienceLabImg,
  sealEmblem: sealEmblemImg,
  // Fallback public URLs if browser blocks bundled blob
  publicLogo: '/assets/aistudio/INHS_LOGO_v2_3c57a62d.png',
  publicCampusFacade: '/assets/images/school_campus_facade_1793804196290.jpg',
  publicStudentLife: '/assets/images/school_student_life_1793804199202.jpg',
  publicScienceLab: '/assets/images/classroom_stem_laboratory_1793804197413.jpg',
};
