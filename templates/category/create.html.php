<?php

/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Create Category';
$bodyClass = 'category-create';

ob_start(); ?>
    <h1>Create Category</h1>

<?php include __DIR__ . '/_form.html.php'; ?>

    <p><a href="<?= $router->generatePath('category-index') ?>">Back to list</a></p>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
