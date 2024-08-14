<?php
// api/index.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Auth-Token, Origin, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=kanban", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Route handling
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'], '/'));

switch ($method) {
    case 'GET':
        if ($path[0] === 'tasks' && isset($path[1]) && is_numeric($path[1])) {
            // Fetch task by task ID
            $tasks_id = intval($path[1]);
            $query = "SELECT * FROM `tasks` WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->bindValue(':id', $tasks_id, PDO::PARAM_INT);
            $stmt->execute();
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => 1, 'data' => $tasks]);
        } elseif ($path[0] === 'users' && isset($path[1]) && is_numeric($path[1]) && isset($path[2]) && $path[2] === 'tasks') {
            // Fetch tasks by user ID
            $user_id = intval($path[1]);
            $query = "SELECT * FROM `tasks` WHERE user_id = :user_id";
            $stmt = $pdo->prepare($query);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => 1, 'data' => $tasks]);
        } else {
            echo json_encode(['success' => 0, 'message' => 'Invalid Parameters']);
        }
        break;

    case 'POST':
        if ($path[0] === 'tasks') {
            // Insert a new task
            $data = json_decode(file_get_contents("php://input"));

            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => 0, 'message' => 'Invalid JSON']);
                exit;
            }

            if (!isset($data->task_name) || !isset($data->task_desc) || !isset($data->status) || !isset($data->date) || !isset($data->user_id)) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Please enter all compulsory fields: Task Name, Task Description, Status, Due Date, and User ID',
                ]);
                exit;
            } elseif (empty(trim($data->task_name)) || empty(trim($data->task_desc)) || empty(trim($data->status)) || empty(trim($data->date)) || empty(trim($data->user_id))) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Fields cannot be empty. Please fill all the fields.',
                ]);
                exit;
            }

            try {
                $task_name = htmlspecialchars(trim($data->task_name));
                $task_desc = htmlspecialchars(trim($data->task_desc));
                $status = htmlspecialchars(trim($data->status));
                $date = htmlspecialchars(trim($data->date));
                $user_id = htmlspecialchars(trim($data->user_id));

                $query = "INSERT INTO `tasks` (
                    task_name,
                    task_desc,
                    status,
                    date,
                    user_id
                ) VALUES (
                    :task_name,
                    :task_desc,
                    :status,
                    :date,
                    :user_id
                )";

                $stmt = $pdo->prepare($query);

                $stmt->bindValue(':task_name', $task_name, PDO::PARAM_STR);
                $stmt->bindValue(':task_desc', $task_desc, PDO::PARAM_STR);
                $stmt->bindValue(':status', $status, PDO::PARAM_STR);
                $stmt->bindValue(':date', $date, PDO::PARAM_STR);
                $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode([
                        'success' => 1,
                        'message' => 'Data inserted successfully.'
                    ]);
                    exit;
                }

                echo json_encode([
                    'success' => 0,
                    'message' => 'There was a problem inserting the data'
                ]);
                exit;
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => 0,
                    'message' => $e->getMessage()
                ]);
                exit;
            }
        } elseif ($path[0] === 'login') {
            // User login
            $data = json_decode(file_get_contents("php://input"));

            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => 0, 'message' => 'Invalid JSON']);
                exit;
            }

            if (!isset($data->user_name) || !isset($data->user_pass)) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Please enter both User Name and Password',
                ]);
                exit;
            } elseif (empty(trim($data->user_name)) || empty(trim($data->user_pass))) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Fields cannot be empty. Please fill all the fields.',
                ]);
                exit;
            }

            $user_name = htmlspecialchars(trim($data->user_name));
            $user_pass = htmlspecialchars(trim($data->user_pass));

            try {
                $query = "SELECT * FROM users WHERE user_name = :user_name";
                $stmt = $pdo->prepare($query);
                $stmt->bindValue(':user_name', $user_name, PDO::PARAM_STR);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $password_valid = password_verify($user_pass, $row['user_pass']);

                    if ($password_valid) {
                        echo json_encode([
                            'success' => 1,
                            'message' => 'Login successful.',
                            'user' => [
                                'user_id' => $row['user_id'],
                                'user_name' => $row['user_name'],
                                'user_email' => $row['user_email']
                            ]
                        ]);
                        exit;
                    } else {
                        echo json_encode([
                            'success' => 0,
                            'message' => 'Incorrect password.'
                        ]);
                        exit;
                    }
                } else {
                    echo json_encode([
                        'success' => 0,
                        'message' => 'User not found.'
                    ]);
                    exit;
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => 0,
                    'message' => $e->getMessage()
                ]);
                exit;
            }
        } elseif ($path[0] === 'register') {
            // User registration
            $data = json_decode(file_get_contents("php://input"));

            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => 0, 'message' => 'Invalid JSON']);
                exit;
            }

            if (!isset($data->user_name) || !isset($data->user_pass) || !isset($data->user_email)) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Please enter compulsory fields: User Name, User Password, User Email',
                ]);
                exit;
            } elseif (empty(trim($data->user_name)) || empty(trim($data->user_pass)) || empty(trim($data->user_email))) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Fields cannot be empty. Please fill all the fields.',
                ]);
                exit;
            }

            $user_name = htmlspecialchars(trim($data->user_name));
            $user_pass = htmlspecialchars(trim($data->user_pass));
            $user_email = htmlspecialchars(trim($data->user_email));

            if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode([
                    'success' => 0,
                    'message' => 'Invalid email format.',
                ]);
                exit;
            }

            try {
                $checkQuery = "SELECT user_name, user_email FROM users WHERE user_name = :user_name OR user_email = :user_email";
                $checkStmt = $pdo->prepare($checkQuery);
                $checkStmt->bindValue(':user_name', $user_name, PDO::PARAM_STR);
                $checkStmt->bindValue(':user_email', $user_email, PDO::PARAM_STR);
                $checkStmt->execute();

                if ($checkStmt->rowCount() > 0) {
                    echo json_encode([
                        'success' => 0,
                        'message' => 'Username or email already exists.',
                    ]);
                    exit;
                }

                $user_pass_hash = password_hash($user_pass, PASSWORD_DEFAULT);

                $query = "INSERT INTO users (user_name, user_pass, user_email) VALUES (:user_name, :user_pass, :user_email)";
                $stmt = $pdo->prepare($query);

                $stmt->bindValue(':user_name', $user_name, PDO::PARAM_STR);
                $stmt->bindValue(':user_pass', $user_pass_hash, PDO::PARAM_STR);
                $stmt->bindValue(':user_email', $user_email, PDO::PARAM_STR);

                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode([
                        'success' => 1,
                        'message' => 'User registered successfully.'
                    ]);
                    exit;
                }

                echo json_encode([
                    'success' => 0,
                    'message' => 'There was a problem registering the user'
                ]);
                exit;
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => 0,
                    'message' => $e->getMessage()
                ]);
                exit;
            }
        } else {
            echo json_encode(['success' => 0, 'message' => 'Invalid Parameters']);
        }
        break;

        case 'PUT':
            if ($path[0] === 'tasks') {
                $data = json_decode(file_get_contents("php://input"));

                if (json_last_error() !== JSON_ERROR_NONE) {
                    echo json_encode(['success' => 0, 'message' => 'Invalid JSON']);
                    exit;
                }
    
                if (!isset($data->id)) {
                    echo json_encode(['success' => 0, 'message' => 'Task ID is missing']);
                    exit;
                }
    
                try {
                    $task_id = $data->id;
    
                    // Check if task exists
                    $fetch_stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = :id");
                    $fetch_stmt->bindValue(':id', $task_id, PDO::PARAM_INT);
                    $fetch_stmt->execute();
    
                    if ($fetch_stmt->rowCount() > 0) {
                        $task_name = isset($data->task_name) ? htmlspecialchars(strip_tags($data->task_name)) : '';
                        $task_desc = isset($data->task_desc) ? htmlspecialchars(strip_tags($data->task_desc)) : '';
                        $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : '';
                        $date = isset($data->date) ? htmlspecialchars(strip_tags($data->date)) : '';
    
                        $update_query = "UPDATE tasks SET task_name = :task_name, task_desc = :task_desc, status = :status, date = :date WHERE id = :id";
                        $update_stmt = $pdo->prepare($update_query);
    
                        $update_stmt->bindValue(':task_name', $task_name, PDO::PARAM_STR);
                        $update_stmt->bindValue(':task_desc', $task_desc, PDO::PARAM_STR);
                        $update_stmt->bindValue(':status', $status, PDO::PARAM_STR);
                        $update_stmt->bindValue(':date', $date, PDO::PARAM_STR);
                        $update_stmt->bindValue(':id', $task_id, PDO::PARAM_INT);
    
                        if ($update_stmt->execute()) {
                            echo json_encode(['success' => 1, 'message' => 'Record updated successfully']);
                        } else {
                            echo json_encode(['success' => 0, 'message' => 'Update failed']);
                        }
                    } else {
                        echo json_encode(['success' => 0, 'message' => 'No record found']);
                    }
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['success' => 0, 'message' => $e->getMessage()]);
                }

            }elseif ($path[0] === 'position') {
                $data = json_decode(file_get_contents("php://input"));
        
                if (json_last_error() !== JSON_ERROR_NONE) {
                    echo json_encode(['success' => 0, 'message' => 'Invalid JSON']);
                    exit;
                }
        
                try {
                    $pdo->beginTransaction();
        
                    foreach ($data as $task) {
                        $id = $task->id;
                        $position = is_numeric($task->position) ? (int)$task->position : 0;
                        $status = htmlspecialchars(strip_tags($task->status));
        
                        $update_query = "UPDATE tasks SET position = :position, status = :status WHERE id = :id";
                        $update_stmt = $pdo->prepare($update_query);
                        $update_stmt->bindValue(':position', $position, PDO::PARAM_INT);
                        $update_stmt->bindValue(':status', $status, PDO::PARAM_STR);
                        $update_stmt->bindValue(':id', $id, PDO::PARAM_INT);
                        $update_stmt->execute();
                    }
        
                    $pdo->commit();
                    echo json_encode(['success' => 1, 'message' => 'Task positions updated successfully']);
                } catch (PDOException $e) {
                    $pdo->rollBack();
                    http_response_code(500);
                    echo json_encode(['success' => 0, 'message' => $e->getMessage()]);
                }
            }

            break;

        case 'DELETE':
            if ($path[0] === 'tasks' && isset($path[1]) && is_numeric($path[1])) {
                $task_id = intval($path[1]);
                try {
                    $query = "DELETE FROM `tasks` WHERE id = :id";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindValue(':id', $task_id, PDO::PARAM_INT);
                    if ($stmt->execute()) {
                        echo json_encode(['success' => 1, 'message' => 'Task deleted successfully.']);
                    } else {
                        echo json_encode(['success' => 0, 'message' => 'Failed to delete task.']);
                    }
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['success' => 0, 'message' => $e->getMessage()]);
                }
            } else {
                echo json_encode(['success' => 0, 'message' => 'Invalid Parameters']);
            }
            break;
        
        
        
    default:
        http_response_code(405);
        echo json_encode(['success' => 0, 'message' => 'Method Not Allowed']);
        break;
}
?>
