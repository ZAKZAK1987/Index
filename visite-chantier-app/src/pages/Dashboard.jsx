import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Plus,
  Calendar,
  Search,
  FileText,
  Trash2,
  Eye,
  ClipboardList,
  Clock,
  CheckCircle,
  Building2,
  Filter,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import generatePDF from '../services/pdfGenerator';

const Dashboard = () => {
  const { visites, parametres, removeVisite, getStats } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  // Filtrage et tri des visites
  const filteredVisites = useMemo(() => {
    let result = [...visites];

    // Recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(v =>
        v.maitreOuvrage?.toLowerCase().includes(search) ||
        v.maitreOeuvre?.toLowerCase().includes(search) ||
        v.entreprisesPresentes?.some(e => e.nom?.toLowerCase().includes(search)) ||
        v.observationsGenerales?.toLowerCase().includes(search)
      );
    }

    // Filtre statut
    if (filterStatus !== 'all') {
      if (filterStatus === 'past') {
        result = result.filter(v => v.date < today);
      } else if (filterStatus === 'future') {
        result = result.filter(v => v.date >= today);
      }
    }

    // Tri
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

    return result;
  }, [visites, searchTerm, filterStatus, sortBy, today]);

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
      removeVisite(id);
    }
  };

  const handleGeneratePDF = (visite, e) => {
    e.preventDefault();
    e.stopPropagation();
    generatePDF(visite, parametres);
  };

  const getStatusBadge = (date) => {
    if (date < today) {
      return <span className="badge badge-green">Terminée</span>;
    } else if (date === today) {
      return <span className="badge badge-blue">Aujourd'hui</span>;
    } else {
      return <span className="badge badge-yellow">À venir</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Gérez vos visites de chantier</p>
        </div>
        <Link to="/visite/nouvelle" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nouvelle visite
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVisites}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.visitesPassees}</p>
              <p className="text-sm text-gray-500">Terminées</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.visitesFutures}</p>
              <p className="text-sm text-gray-500">À venir</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.visitesEnCours}</p>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une visite..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="input w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="past">Terminées</option>
              <option value="future">À venir</option>
            </select>

            <select
              className="input w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Plus récentes</option>
              <option value="date-asc">Plus anciennes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des visites */}
      {filteredVisites.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {visites.length === 0 ? 'Aucune visite' : 'Aucun résultat'}
          </h3>
          <p className="text-gray-500 mb-4">
            {visites.length === 0
              ? 'Commencez par créer votre première visite de chantier'
              : 'Modifiez vos critères de recherche'}
          </p>
          {visites.length === 0 && (
            <Link to="/visite/nouvelle" className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Créer une visite
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisites.map((visite) => (
            <Link
              key={visite.id}
              to={`/visite/${visite.id}`}
              className="card p-4 block hover:shadow-md transition-shadow border-l-4 border-l-primary-500"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {format(new Date(visite.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </h3>
                    {getStatusBadge(visite.date)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">MOA:</span>
                      {visite.maitreOuvrage || '-'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">MOE:</span>
                      {visite.maitreOeuvre || parametres.maitreOeuvre || '-'}
                    </div>
                  </div>

                  {visite.entreprisesPresentes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {visite.entreprisesPresentes.slice(0, 4).map((e, i) => (
                        <span key={i} className="badge badge-gray">
                          <Building2 className="w-3 h-3 mr-1" />
                          {e.nom}
                        </span>
                      ))}
                      {visite.entreprisesPresentes.length > 4 && (
                        <span className="badge badge-gray">
                          +{visite.entreprisesPresentes.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleGeneratePDF(visite, e)}
                    className="btn btn-success btn-sm"
                    title="Générer PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                  <Link
                    to={`/visite/${visite.id}`}
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Voir</span>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(visite.id, e)}
                    className="btn btn-danger btn-sm"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
