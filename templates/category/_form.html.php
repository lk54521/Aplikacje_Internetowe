<?php if (!empty($errors)): ?>
    <div class="errors">
        <ul>
            <?php foreach ($errors as $error): ?>
                <li><?= htmlspecialchars($error) ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>

<form method="post">
    <label>
        Name:
        <input type="text" name="category[name]" value="<?= htmlspecialchars($category->getName() ?? '') ?>">
    </label>

    <br><br>

    <label>
        Description:<br>
        <textarea name="category[description]" rows="5" cols="40"><?= htmlspecialchars($category->getDescription() ?? '') ?></textarea>
    </label>

    <br><br>

    <button type="submit">Save</button>
</form>
