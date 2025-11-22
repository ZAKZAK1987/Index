import { useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  User,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Entreprises = () => {
  const { entreprises, addEntreprise, updateEntreprise, removeEntreprise } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    corpsEtat: '',
    contact: '',
    telephone: '',
    email: ''
  });

  const filteredEntreprises = entreprises.filter(e =>
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.corpsEtat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (entreprise = null) => {
    setEditingEntreprise(entreprise);
    setFormData(entreprise || {
      nom: '',
      corpsEtat: '',
      contact: '',
      telephone: '',
      email: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEntreprise(null);
    setFormData({
      nom: '',
      corpsEtat: '',
      contact: '',
      telephone: '',
      email: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) return;

    if (editingEntreprise) {
      updateEntreprise({ ...formData, id: editingEntreprise.id });
    } else {
      addEntreprise(formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      removeEntreprise(id);
    }
  };

  const corpsEtatSuggestions = [
    'Gros œuvre',
    'Second œuvre',
    'Électricité',
    'Plomberie',
    'CVC - Chauffage Ventilation Climatisation',
    'Menuiserie',
    'Serrurerie',
    'Peinture',
    'Carrelage',
    'Façade',
    'Étanchéité',
    'Couverture',
    'Terrassement',
    'VRD',
    'Espaces verts'
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
          <p className="text-gray-600 mt-1">Gérez votre carnet d'adresses</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nouvelle entreprise
        </button>
      </div>

      {/* Recherche */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste */}
      {filteredEntreprises.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {entreprises.length === 0 ? 'Aucune entreprise' : 'Aucun résultat'}
          </h3>
          <p className="text-gray-500 mb-4">
            {entreprises.length === 0
              ? 'Ajoutez vos entreprises pour les sélectionner rapidement'
              : 'Modifiez votre recherche'}
          </p>
          {entreprises.length === 0 && (
            <button onClick={() => openModal()} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Ajouter une entreprise
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntreprises.map((entreprise) => (
            <div key={entreprise.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{entreprise.nom}</h3>
                  <span className="badge badge-blue mt-1">{entreprise.corpsEtat || 'Non défini'}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(entreprise)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entreprise.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(entreprise.contact || entreprise.telephone || entreprise.email) && (
                <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
                  {entreprise.contact && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {entreprise.contact}
                    </div>
                  )}
                  {entreprise.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${entreprise.telephone}`} className="hover:text-primary-600">
                        {entreprise.telephone}
                      </a>
                    </div>
                  )}
                  {entreprise.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${entreprise.email}`} className="hover:text-primary-600 truncate">
                        {entreprise.email}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingEntreprise ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="label">Nom de l'entreprise *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Bouygues Construction"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="label">Corps d'état</label>
                <input
                  type="text"
                  className="input"
                  list="corps-etat-list"
                  placeholder="Ex: Gros œuvre"
                  value={formData.corpsEtat}
                  onChange={(e) => setFormData(prev => ({ ...prev, corpsEtat: e.target.value }))}
                />
                <datalist id="corps-etat-list">
                  {corpsEtatSuggestions.map((corps, i) => (
                    <option key={i} value={corps} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="label">Contact</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Nom du contact"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Téléphone</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="06 00 00 00 00"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="contact@entreprise.fr"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingEntreprise ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entreprises;
