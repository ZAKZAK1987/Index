// Service de stockage local avec support pour migration vers Supabase

const DB_VERSION = 1;

export const StorageKeys = {
  VISITES: 'visite_chantier_visites',
  ENTREPRISES: 'visite_chantier_entreprises',
  PARAMETRES: 'visite_chantier_parametres',
  USER: 'visite_chantier_user',
};

// Initialisation des données par défaut
export const initializeStorage = () => {
  if (!localStorage.getItem(StorageKeys.VISITES)) {
    localStorage.setItem(StorageKeys.VISITES, JSON.stringify([]));
  }

  if (!localStorage.getItem(StorageKeys.ENTREPRISES)) {
    const defaultEntreprises = [
      { id: crypto.randomUUID(), nom: 'Bouygues Construction', corpsEtat: 'Gros œuvre', contact: '', telephone: '', email: '' },
      { id: crypto.randomUUID(), nom: 'Dalkia', corpsEtat: 'CVC - Chauffage Ventilation Climatisation', contact: '', telephone: '', email: '' },
      { id: crypto.randomUUID(), nom: 'Spie Batignolles', corpsEtat: 'Électricité', contact: '', telephone: '', email: '' },
      { id: crypto.randomUUID(), nom: 'Vinci Construction', corpsEtat: 'Plomberie', contact: '', telephone: '', email: '' },
      { id: crypto.randomUUID(), nom: 'Eiffage', corpsEtat: 'Menuiserie', contact: '', telephone: '', email: '' },
    ];
    localStorage.setItem(StorageKeys.ENTREPRISES, JSON.stringify(defaultEntreprises));
  }

  if (!localStorage.getItem(StorageKeys.PARAMETRES)) {
    const defaultParams = {
      nomChantier: '',
      adresseChantier: '',
      logoUrl: '',
      maitreOeuvre: '',
      telephoneMOE: '',
      emailMOE: '',
    };
    localStorage.setItem(StorageKeys.PARAMETRES, JSON.stringify(defaultParams));
  }
};

// CRUD Visites
export const getVisites = () => {
  const data = localStorage.getItem(StorageKeys.VISITES);
  return data ? JSON.parse(data) : [];
};

export const getVisite = (id) => {
  const visites = getVisites();
  return visites.find(v => v.id === id);
};

export const saveVisite = (visite) => {
  const visites = getVisites();

  if (visite.id) {
    const index = visites.findIndex(v => v.id === visite.id);
    if (index !== -1) {
      visites[index] = { ...visite, updatedAt: new Date().toISOString() };
    }
  } else {
    visite.id = crypto.randomUUID();
    visite.createdAt = new Date().toISOString();
    visite.updatedAt = new Date().toISOString();
    visites.push(visite);
  }

  localStorage.setItem(StorageKeys.VISITES, JSON.stringify(visites));
  return visite;
};

export const deleteVisite = (id) => {
  const visites = getVisites().filter(v => v.id !== id);
  localStorage.setItem(StorageKeys.VISITES, JSON.stringify(visites));
};

// CRUD Entreprises
export const getEntreprises = () => {
  const data = localStorage.getItem(StorageKeys.ENTREPRISES);
  return data ? JSON.parse(data) : [];
};

export const getEntreprise = (id) => {
  const entreprises = getEntreprises();
  return entreprises.find(e => e.id === id);
};

export const saveEntreprise = (entreprise) => {
  const entreprises = getEntreprises();

  if (entreprise.id) {
    const index = entreprises.findIndex(e => e.id === entreprise.id);
    if (index !== -1) {
      entreprises[index] = entreprise;
    }
  } else {
    entreprise.id = crypto.randomUUID();
    entreprises.push(entreprise);
  }

  localStorage.setItem(StorageKeys.ENTREPRISES, JSON.stringify(entreprises));
  return entreprise;
};

export const deleteEntreprise = (id) => {
  const entreprises = getEntreprises().filter(e => e.id !== id);
  localStorage.setItem(StorageKeys.ENTREPRISES, JSON.stringify(entreprises));
};

// Paramètres
export const getParametres = () => {
  const data = localStorage.getItem(StorageKeys.PARAMETRES);
  return data ? JSON.parse(data) : {};
};

export const saveParametres = (parametres) => {
  localStorage.setItem(StorageKeys.PARAMETRES, JSON.stringify(parametres));
  return parametres;
};

// Export/Import données
export const exportData = () => {
  return {
    version: DB_VERSION,
    exportDate: new Date().toISOString(),
    visites: getVisites(),
    entreprises: getEntreprises(),
    parametres: getParametres(),
  };
};

export const importData = (data) => {
  if (data.visites) {
    localStorage.setItem(StorageKeys.VISITES, JSON.stringify(data.visites));
  }
  if (data.entreprises) {
    localStorage.setItem(StorageKeys.ENTREPRISES, JSON.stringify(data.entreprises));
  }
  if (data.parametres) {
    localStorage.setItem(StorageKeys.PARAMETRES, JSON.stringify(data.parametres));
  }
};

// Statistiques
export const getStatistiques = () => {
  const visites = getVisites();
  const today = new Date().toISOString().split('T')[0];

  return {
    totalVisites: visites.length,
    visitesPassees: visites.filter(v => v.date < today).length,
    visitesFutures: visites.filter(v => v.date >= today).length,
    visitesEnCours: visites.filter(v => v.date === today).length,
    derniereVisite: visites.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null,
  };
};
