import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../services/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [visites, setVisites] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [parametres, setParametres] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Initialisation
  useEffect(() => {
    storage.initializeStorage();
    loadData();
  }, []);

  const loadData = () => {
    setVisites(storage.getVisites());
    setEntreprises(storage.getEntreprises());
    setParametres(storage.getParametres());
    setLoading(false);
  };

  // Toast notifications
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Visites
  const addVisite = useCallback((visite) => {
    const saved = storage.saveVisite(visite);
    setVisites(storage.getVisites());
    showToast('Visite enregistrée avec succès');
    return saved;
  }, [showToast]);

  const updateVisite = useCallback((visite) => {
    const saved = storage.saveVisite(visite);
    setVisites(storage.getVisites());
    showToast('Visite mise à jour');
    return saved;
  }, [showToast]);

  const removeVisite = useCallback((id) => {
    storage.deleteVisite(id);
    setVisites(storage.getVisites());
    showToast('Visite supprimée');
  }, [showToast]);

  // Entreprises
  const addEntreprise = useCallback((entreprise) => {
    const saved = storage.saveEntreprise(entreprise);
    setEntreprises(storage.getEntreprises());
    showToast('Entreprise enregistrée');
    return saved;
  }, [showToast]);

  const updateEntreprise = useCallback((entreprise) => {
    const saved = storage.saveEntreprise(entreprise);
    setEntreprises(storage.getEntreprises());
    showToast('Entreprise mise à jour');
    return saved;
  }, [showToast]);

  const removeEntreprise = useCallback((id) => {
    storage.deleteEntreprise(id);
    setEntreprises(storage.getEntreprises());
    showToast('Entreprise supprimée');
  }, [showToast]);

  // Paramètres
  const updateParametres = useCallback((params) => {
    storage.saveParametres(params);
    setParametres(params);
    showToast('Paramètres enregistrés');
  }, [showToast]);

  // Stats
  const getStats = useCallback(() => {
    return storage.getStatistiques();
  }, []);

  // Export/Import
  const exportAllData = useCallback(() => {
    const data = storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visite_chantier_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Données exportées');
  }, [showToast]);

  const importAllData = useCallback((jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      storage.importData(data);
      loadData();
      showToast('Données importées avec succès');
    } catch (error) {
      showToast('Erreur lors de l\'import', 'error');
    }
  }, [showToast]);

  const value = {
    // State
    visites,
    entreprises,
    parametres,
    loading,
    toast,

    // Actions
    showToast,
    addVisite,
    updateVisite,
    removeVisite,
    addEntreprise,
    updateEntreprise,
    removeEntreprise,
    updateParametres,
    getStats,
    exportAllData,
    importAllData,
    loadData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
