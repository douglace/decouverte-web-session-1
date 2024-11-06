<?php
//Database configurations
$host = 'localhost';
$db = 'todos_db';
$user = 'root';
$pass = 'root';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    apiResponse(false, null, "Erreur de connexion : " . $e->getMessage());
}
//End

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getTodoById($pdo, (int) $_GET['id']);
        } else {
            getAllTodos($pdo);
        }
        break;

    case 'POST':
        if (isset($input['label'])) {
            createTodo($pdo, $input['label']);
        } else {
            apiResponse(false, null, "Le champ 'label' est requis.");
        }
        break;

    case 'PUT':
        if (isset($_GET['id']) && isset($input['label']) && isset($input['status'])) {
            updateTodo($pdo, (int) $_GET['id'], $input['label'], (bool) $input['status']);
        } else {
            apiResponse(false, null, "Les champs 'id', 'label' et 'status' sont requis.");
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteTodo($pdo, (int) $_GET['id']);
        } else {
            apiResponse(false, null, "Le champ 'id' est requis pour supprimer.");
        }
        break;

    default:
        apiResponse(false, null, "Méthode non supportée");
        break;
}

//Functions helpers
/**
 * Format response
 *
 * @param boolean $status
 * @param array|null $data
 * @param string $message
 * @return void
 */
function apiResponse(bool $status = true, $data = null, string $message = "")
{
    die(json_encode([
        "status" => $status,
        "data" => $data,
        "message" => $message,
    ]));
}

/**
 * Get all totos
 *
 * @param PDO $pdo
 * @return void
 */
function getAllTodos(PDO $pdo)
{
    $stmt = $pdo->query("SELECT * FROM todos ORDER BY `status` ASC");
    $todos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    apiResponse(true, $todos);
}

/**
 * Get todo by id
 *
 * @param PDO $pdo
 * @param integer $id
 * @return void
 */
function getTodoById(PDO $pdo, int $id)
{
    $stmt = $pdo->prepare("SELECT * FROM todos WHERE id = ?");
    $stmt->execute([$id]);
    $todo = $stmt->fetch(PDO::FETCH_ASSOC);
    $todo ? apiResponse(true, $todo) : apiResponse(false, null, "Tâche non trouvée");
}

/**
 * Get all totos
 *
 * @param PDO $pdo
 * @param string $label
 * @return void
 */
function createTodo(PDO $pdo, string $label)
{
    $stmt = $pdo->prepare("INSERT INTO todos (label) VALUES (?)");
    if ($stmt->execute([$label])) {
        apiResponse(true, $pdo->lastInsertId(), "Tâche ajoutée");
    } else {
        apiResponse(false, null, "Erreur lors de la création de la tâche");
    }
}

/**
 * Update todo
 *
 * @param PDO $pdo
 * @param integer $id
 * @param string $label
 * @param boolean $status
 * @return void
 */
function updateTodo(PDO $pdo, int $id, string $label, bool $status)
{
    $stmt = $pdo->prepare("UPDATE todos SET label = ?, status = ?, updated_at = NOW() WHERE id = ?");
    if ($stmt->execute([$label, $status, $id])) {
        apiResponse(true, null, "Tâche mise à jour");
    } else {
        apiResponse(false, null, "Erreur lors de la mise à jour de la tâche");
    }
}

/**
 * Delete todo
 *
 * @param PDO $pdo
 * @param integer $id
 * @return void
 */
function deleteTodo(PDO $pdo, int $id)
{
    $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
    if ($stmt->execute([$id])) {
        apiResponse(true, null, "Tâche supprimée");
    } else {
        apiResponse(false, null, "Erreur lors de la suppression de la tâche");
    }
}
//End
