<?php

/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Category Details';
$bodyClass = 'category-show';

ob_start(); ?>
    <h1><?= htmlspecialchars($category->getName()) ?></h1>

    <p><?= nl2br(htmlspecialchars($category->getDescription())) ?></p>

    <p>
        <a href="<?= $router->generatePath('category-edit', ['id' => $category->getId()]) ?>">Edit</a>
    </p>

    <p>
        <a href="<?= $router->generatePath('category-index') ?>">Back to list</a>
    </p>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
