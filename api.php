<?php
/**
 * API de synchronisation pour Pillar Building
 * Stocke les données dans un fichier JSON sur le serveur
 */

// Configuration
$dataFile = __DIR__ . '/data.json';

// Headers CORS et JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérification simple d'authentification (même credentials que le frontend)
function checkAuth() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    // Format attendu: "Basic base64(user:pass)"
    if (preg_match('/Basic\s+(.+)/', $auth, $matches)) {
        $decoded = base64_decode($matches[1]);
        return $decoded === 'admin:chantier2026';
    }
    return false;
}

// GET: Récupérer les données
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Non autorisé']);
        exit;
    }

    if (file_exists($dataFile)) {
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        // Retourner des données vides par défaut
        echo json_encode([
            'chantiers' => [],
            'remarques' => [],
            'savedReports' => [],
            'currentChantier' => [
                'id' => null,
                'nom' => '',
                'adresse' => '',
                'mo' => '',
                'moe' => '',
                'dateVisite' => date('Y-m-d'),
                'dateMiseAJour' => '',
                'entreprises' => [],
                'niveaux' => [],
                'localisations' => []
            ],
            'currentReportId' => null
        ]);
    }
    exit;
}

// POST: Sauvegarder les données
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Non autorisé']);
        exit;
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON invalide']);
        exit;
    }

    // Sauvegarder avec formatage pour debug
    if (file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'timestamp' => time()]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur d\'écriture']);
    }
    exit;
}

// Méthode non supportée
http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);
