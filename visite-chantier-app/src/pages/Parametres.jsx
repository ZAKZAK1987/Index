import { useState, useRef } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  Building,
  User,
  Phone,
  Mail,
  Image,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Parametres = () => {
  const { parametres, updateParametres, exportAllData, importAllData } = useApp();
  const [formData, setFormData] = useState(parametres);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateParametres(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importAllData(event.target.result);
        setFormData(JSON.parse(localStorage.getItem('visite_chantier_parametres') || '{}'));
      };
      reader.readAsText(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('logoUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configurez votre application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du chantier */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-600" />
            Informations du chantier
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nom du chantier</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Résidence Les Jardins"
                value={formData.nomChantier || ''}
                onChange={(e) => handleChange('nomChantier', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Adresse du chantier</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Adresse complète"
                value={formData.adresseChantier || ''}
                onChange={(e) => handleChange('adresseChantier', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Logo (pour les PDF)</label>
              <div className="flex items-center gap-4">
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-16 h-16 object-contain border rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PNG ou JPG recommandé
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </form>
        </div>

        {/* Informations MOE */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Maître d'œuvre par défaut
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nom / Société</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Pillar Building"
                value={formData.maitreOeuvre || ''}
                onChange={(e) => handleChange('maitreOeuvre', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Téléphone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  className="input pl-10"
                  placeholder="01 23 45 67 89"
                  value={formData.telephoneMOE || ''}
                  onChange={(e) => handleChange('telephoneMOE', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="contact@maitreoeuvre.fr"
                  value={formData.emailMOE || ''}
                  onChange={(e) => handleChange('emailMOE', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </form>
        </div>

        {/* Sauvegarde et restauration */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            Sauvegarde et restauration
          </h2>

          <p className="text-gray-600 mb-4">
            Exportez vos données pour les sauvegarder ou les transférer sur un autre appareil.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={exportAllData} className="btn btn-secondary flex-1">
              <Download className="w-4 h-4" />
              Exporter les données
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary flex-1"
            >
              <Upload className="w-4 h-4" />
              Importer des données
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>

          <p className="text-sm text-gray-500 mt-4">
            ⚠️ L'import remplacera toutes les données existantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
