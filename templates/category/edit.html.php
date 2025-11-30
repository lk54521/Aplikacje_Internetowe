<?php

/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Edit Category';
$bodyClass = 'category-edit';

ob_start(); ?>
    <h1>Edit Category</h1>

<?php include __DIR__ . '/_form.html.php'; ?>

    <p><a href="<?= $router->generatePath('category-index') ?>">Back to list</a></p>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
