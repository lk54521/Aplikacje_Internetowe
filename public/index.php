<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

use App\Service\Config;
use App\Service\Templating;
use App\Service\Router;

use App\Controller\PostController;
use App\Controller\CategoryController;

$config = new Config();

$templating = new Templating();
$router = new Router();

$action = $_REQUEST['action'] ?? null;

switch ($action) {

    case 'post-index':
    case null:
        $controller = new PostController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'post-create':
        $controller = new PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;

    case 'post-edit':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new PostController();
        $view = $controller->editAction(
            (int) $_REQUEST['id'],
            $_REQUEST['post'] ?? null,
            $templating,
            $router
        );
        break;

    case 'post-show':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new PostController();
        $view = $controller->showAction((int) $_REQUEST['id'], $templating, $router);
        break;

    case 'post-delete':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new PostController();
        $view = $controller->deleteAction((int) $_REQUEST['id'], $router);
        break;

    case 'category-index':
        $controller = new CategoryController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'category-show':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new CategoryController();
        $view = $controller->showAction((int) $_REQUEST['id'], $templating, $router);
        break;

    case 'category-create':
        $controller = new CategoryController();
        $view = $controller->createAction($_REQUEST['category'] ?? null, $templating, $router);
        break;

    case 'category-edit':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new CategoryController();
        $view = $controller->editAction(
            (int) $_REQUEST['id'],
            $_REQUEST['category'] ?? null,
            $templating,
            $router
        );
        break;

    case 'category-delete':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new CategoryController();
        $view = $controller->deleteAction((int) $_REQUEST['id'], $router);
        break;

    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
