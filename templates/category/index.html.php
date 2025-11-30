<?php

/** @var \App\Model\Category[] $categories */
/** @var \App\Service\Router $router */

$title = 'Category List';
$bodyClass = 'category-index';

ob_start(); ?>
    <h1>Categories List</h1>

    <a href="<?= $router->generatePath('category-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($categories as $category): ?>
            <li>
                <h3><?= htmlspecialchars($category->getName()) ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('category-show', ['id' => $category->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('category-edit', ['id' => $category->getId()]) ?>">Edit</a></li>
                    <li><a href="<?= $router->generatePath('category-delete', ['id' => $category->getId()]) ?>">Delete</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
