<?php

namespace App\Controller;

use App\Model\Category;
use App\Service\Templating;
use App\Service\Router;

class CategoryController
{
    public function indexAction(Templating $templating, Router $router): string
    {
        $categories = Category::findAll();

        return $templating->render('category/index.html.php', [
            'categories' => $categories,
            'router'     => $router,
        ]);
    }

    public function showAction(int $id, Templating $templating, Router $router): string
    {
        $category = Category::find($id);
        if (! $category) {
            return 'Category not found';
        }

        return $templating->render('category/show.html.php', [
            'category' => $category,
            'router'   => $router,
        ]);
    }

    public function createAction(?array $data, Templating $templating, Router $router): string
    {
        $category = new Category();
        $errors = [];

        if ($data) {
            $category->fill($data);

            if (! $category->getName()) {
                $errors[] = 'Name is required.';
            }

            if (! $errors) {
                $category->save();
                header('Location: ' . $router->generatePath('category-index'));
                exit;
            }
        }

        return $templating->render('category/create.html.php', [
            'category' => $category,
            'errors'   => $errors,
            'router'   => $router,
        ]);
    }

    public function editAction(int $id, ?array $data, Templating $templating, Router $router): string
    {
        $category = Category::find($id);
        if (! $category) {
            return 'Category not found';
        }

        $errors = [];

        if ($data) {
            $category->fill($data);

            if (! $category->getName()) {
                $errors[] = 'Name is required.';
            }

            if (! $errors) {
                $category->save();
                header('Location: ' . $router->generatePath('category-index'));
                exit;
            }
        }

        return $templating->render('category/edit.html.php', [
            'category' => $category,
            'errors'   => $errors,
            'router'   => $router,
        ]);
    }

    public function deleteAction(int $id, Router $router): string
    {
        $category = Category::find($id);
        if ($category) {
            $category->delete();
        }

        header('Location: ' . $router->generatePath('category-index'));
        exit;
    }
}
