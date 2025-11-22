import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generatePDF = (visite, parametres) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 20;

  // Couleurs
  const primaryColor = [37, 99, 235];
  const textColor = [31, 41, 55];
  const grayColor = [107, 114, 128];

  // En-tête avec fond bleu
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Logo si disponible
  if (parametres.logoUrl) {
    try {
      doc.addImage(parametres.logoUrl, 'PNG', margin, 8, 30, 30);
    } catch (e) {
      console.log('Logo non chargé');
    }
  }

  // Titre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('COMPTE RENDU DE VISITE DE CHANTIER', pageWidth / 2, 20, { align: 'center' });

  // Numéro de visite
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const visiteNum = `N° ${visite.id?.substring(0, 8).toUpperCase() || 'DRAFT'}`;
  doc.text(visiteNum, pageWidth / 2, 32, { align: 'center' });

  y = 55;

  // Informations du chantier
  doc.setTextColor(...textColor);
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 35, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('INFORMATIONS CHANTIER', margin + 5, y + 8);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  const chantierInfo = [
    [`Chantier: ${parametres.nomChantier || 'Non défini'}`, `Date: ${formatDate(visite.date)}`],
    [`Adresse: ${parametres.adresseChantier || 'Non définie'}`, ''],
  ];

  let infoY = y + 16;
  chantierInfo.forEach(row => {
    doc.text(row[0], margin + 5, infoY);
    if (row[1]) {
      doc.text(row[1], pageWidth / 2 + 10, infoY);
    }
    infoY += 7;
  });

  y += 45;

  // Participants
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 30, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PARTICIPANTS', margin + 5, y + 8);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...textColor);

  doc.text(`Maître d'ouvrage (MOA): ${visite.maitreOuvrage || '-'}`, margin + 5, y + 18);
  doc.text(`Maître d'œuvre (MOE): ${visite.maitreOeuvre || parametres.maitreOeuvre || '-'}`, margin + 5, y + 25);

  y += 40;

  // Entreprises présentes
  if (visite.entreprisesPresentes?.length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ENTREPRISES PRÉSENTES', margin, y);
    y += 8;

    const entreprisesData = visite.entreprisesPresentes.map((e, i) => [
      (i + 1).toString(),
      e.nom || '-',
      e.corpsEtat || '-',
      e.representant || '-'
    ]);

    doc.autoTable({
      startY: y,
      head: [['N°', 'Entreprise', "Corps d'état", 'Représentant']],
      body: entreprisesData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9,
        textColor: textColor
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },
        3: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // Observations générales
  if (visite.observationsGenerales) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('OBSERVATIONS GÉNÉRALES', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...textColor);

    const obsLines = doc.splitTextToSize(visite.observationsGenerales, pageWidth - 2 * margin);
    doc.text(obsLines, margin, y);
    y += obsLines.length * 5 + 10;
  }

  // Observations par entreprise
  if (visite.observationsEntreprises?.length > 0) {
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('OBSERVATIONS PAR ENTREPRISE', margin, y);
    y += 8;

    const obsData = visite.observationsEntreprises.map((o, i) => [
      (i + 1).toString(),
      o.entreprise || '-',
      o.remarque || '-',
      o.priorite || 'Normal'
    ]);

    doc.autoTable({
      startY: y,
      head: [['N°', 'Entreprise', 'Observation', 'Priorité']],
      body: obsData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9,
        textColor: textColor
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // Décisions et actions
  if (visite.decisions) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('DÉCISIONS ET ACTIONS À SUIVRE', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...textColor);

    const decLines = doc.splitTextToSize(visite.decisions, pageWidth - 2 * margin);
    doc.text(decLines, margin, y);
    y += decLines.length * 5 + 10;
  }

  // Prochaine visite
  if (visite.prochaineVisite) {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 15, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(`Prochaine visite prévue le: ${formatDate(visite.prochaineVisite)}`, margin + 5, y + 10);
    y += 25;
  }

  // Zone signatures
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 20;
  }

  y = Math.max(y, pageHeight - 50);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);

  // Ligne MOA
  doc.line(margin, y, margin + 70, y);
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text("Signature Maître d'ouvrage", margin, y + 8);

  // Ligne MOE
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
  doc.text("Signature Maître d'œuvre", pageWidth - margin - 70, y + 8);

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);

    // Numéro de page
    doc.text(`Page ${i}/${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Date de génération
    doc.text(
      `Document généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Téléchargement
  const fileName = `CR_Visite_${visite.date}_${(parametres.nomChantier || 'Chantier').replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);

  return fileName;
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
  } catch {
    return dateString;
  }
};

export default generatePDF;
