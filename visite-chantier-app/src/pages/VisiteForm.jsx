import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  FileText,
  Plus,
  Trash2,
  Camera,
  X,
  ArrowLeft,
  Building2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import generatePDF from '../services/pdfGenerator';

const VisiteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { visites, entreprises, parametres, addVisite, updateVisite } = useApp();
  const fileInputRef = useRef(null);

  const isEditing = id && id !== 'nouvelle';
  const existingVisite = isEditing ? visites.find(v => v.id === id) : null;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    maitreOuvrage: '',
    maitreOeuvre: parametres.maitreOeuvre || '',
    entreprisesPresentes: [],
    observationsGenerales: '',
    observationsEntreprises: [],
    decisions: '',
    prochaineVisite: '',
    photos: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingVisite) {
      setFormData(existingVisite);
    }
  }, [existingVisite]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Entreprises présentes
  const addEntreprisePresente = () => {
    setFormData(prev => ({
      ...prev,
      entreprisesPresentes: [
        ...prev.entreprisesPresentes,
        { nom: '', corpsEtat: '', representant: '' }
      ]
    }));
  };

  const updateEntreprisePresente = (index, field, value) => {
    const updated = [...formData.entreprisesPresentes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, entreprisesPresentes: updated }));
  };

  const removeEntreprisePresente = (index) => {
    setFormData(prev => ({
      ...prev,
      entreprisesPresentes: prev.entreprisesPresentes.filter((_, i) => i !== index)
    }));
  };

  const selectEntrepriseFromList = (index, entrepriseId) => {
    const ent = entreprises.find(e => e.id === entrepriseId);
    if (ent) {
      updateEntreprisePresente(index, 'nom', ent.nom);
      updateEntreprisePresente(index, 'corpsEtat', ent.corpsEtat);
    }
  };

  // Observations par entreprise
  const addObservationEntreprise = () => {
    setFormData(prev => ({
      ...prev,
      observationsEntreprises: [
        ...prev.observationsEntreprises,
        { entreprise: '', remarque: '', priorite: 'Normal', photo: null }
      ]
    }));
  };

  const updateObservationEntreprise = (index, field, value) => {
    const updated = [...formData.observationsEntreprises];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, observationsEntreprises: updated }));
  };

  const removeObservationEntreprise = (index) => {
    setFormData(prev => ({
      ...prev,
      observationsEntreprises: prev.observationsEntreprises.filter((_, i) => i !== index)
    }));
  };

  // Photos
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, { data: event.target.result, name: file.name }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleObsPhotoUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateObservationEntreprise(index, 'photo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateVisite(formData);
    } else {
      addVisite(formData);
    }
    navigate('/');
  };

  const handleSaveAndPDF = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let saved;
    if (isEditing) {
      saved = updateVisite(formData);
    } else {
      saved = addVisite(formData);
    }

    setTimeout(() => {
      generatePDF(saved, parametres);
      navigate('/');
    }, 100);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux visites
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier la visite' : 'Nouvelle visite'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Informations générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Date de la visite *</label>
              <input
                type="date"
                className={`input ${errors.date ? 'input-error' : ''}`}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="label">Prochaine visite prévue</label>
              <input
                type="date"
                className="input"
                value={formData.prochaineVisite || ''}
                onChange={(e) => handleChange('prochaineVisite', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Maître d'ouvrage (MOA)</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Crédit Agricole Immobilier"
                value={formData.maitreOuvrage}
                onChange={(e) => handleChange('maitreOuvrage', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Maître d'œuvre (MOE)</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Pillar Building"
                value={formData.maitreOeuvre}
                onChange={(e) => handleChange('maitreOeuvre', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Entreprises présentes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Entreprises présentes
            </h2>
            <button
              type="button"
              onClick={addEntreprisePresente}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {formData.entreprisesPresentes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Aucune entreprise ajoutée
            </p>
          ) : (
            <div className="space-y-4">
              {formData.entreprisesPresentes.map((ent, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative animate-slide-in">
                  <button
                    type="button"
                    onClick={() => removeEntreprisePresente(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="label">Entreprise</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input"
                          placeholder="Nom"
                          value={ent.nom}
                          onChange={(e) => updateEntreprisePresente(index, 'nom', e.target.value)}
                        />
                        {entreprises.length > 0 && (
                          <select
                            className="input w-auto"
                            onChange={(e) => selectEntrepriseFromList(index, e.target.value)}
                            value=""
                          >
                            <option value="">Liste</option>
                            {entreprises.map(e => (
                              <option key={e.id} value={e.id}>{e.nom}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="label">Corps d'état</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ex: Gros œuvre"
                        value={ent.corpsEtat}
                        onChange={(e) => updateEntreprisePresente(index, 'corpsEtat', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">Représentant</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Nom du représentant"
                        value={ent.representant || ''}
                        onChange={(e) => updateEntreprisePresente(index, 'representant', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observations générales */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Observations générales
          </h2>
          <textarea
            className="input min-h-[120px]"
            placeholder="Observations générales sur l'avancement du chantier..."
            value={formData.observationsGenerales}
            onChange={(e) => handleChange('observationsGenerales', e.target.value)}
          />
        </div>

        {/* Observations par entreprise */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Observations par entreprise
            </h2>
            <button
              type="button"
              onClick={addObservationEntreprise}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {formData.observationsEntreprises.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Aucune observation ajoutée
            </p>
          ) : (
            <div className="space-y-4">
              {formData.observationsEntreprises.map((obs, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative animate-slide-in">
                  <button
                    type="button"
                    onClick={() => removeObservationEntreprise(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="label">Entreprise concernée</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Nom de l'entreprise"
                        value={obs.entreprise}
                        onChange={(e) => updateObservationEntreprise(index, 'entreprise', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">Priorité</label>
                      <select
                        className="input"
                        value={obs.priorite || 'Normal'}
                        onChange={(e) => updateObservationEntreprise(index, 'priorite', e.target.value)}
                      >
                        <option value="Faible">Faible</option>
                        <option value="Normal">Normal</option>
                        <option value="Important">Important</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="label">Remarque</label>
                    <textarea
                      className="input min-h-[80px]"
                      placeholder="Description de l'observation..."
                      value={obs.remarque}
                      onChange={(e) => updateObservationEntreprise(index, 'remarque', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label">Photo (facultatif)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleObsPhotoUpload(index, e)}
                      className="text-sm"
                    />
                    {obs.photo && (
                      <img
                        src={obs.photo}
                        alt="Aperçu"
                        className="mt-2 w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Décisions et actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Décisions et actions à suivre
          </h2>
          <textarea
            className="input min-h-[120px]"
            placeholder="Décisions prises et actions à mettre en œuvre..."
            value={formData.decisions}
            onChange={(e) => handleChange('decisions', e.target.value)}
          />
        </div>

        {/* Photos générales */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-600" />
            Photos générales
          </h2>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Cliquez pour ajouter des photos</p>
            <p className="text-sm text-gray-400">JPG, PNG jusqu'à 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {formData.photos?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.data || photo}
                    alt={`Photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
          <button
            type="button"
            onClick={handleSaveAndPDF}
            className="btn btn-success"
          >
            <FileText className="w-4 h-4" />
            Enregistrer et PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisiteForm;
