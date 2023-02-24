## Pages

### Categories

We need a page that shows the list of categories, e.g. pillows, blankets, ...

This page needs to statically fetch all categories from Strapi

When you click on the category - we need to append a category to URL, e.g. http://localhost:3000/categories/pillows

### Category page

We need a page that shows the list of items in category, e.g. pillow-1, pillow-2, ...

This page needs to statically constructs the paths for all the items in the category. This page also needs to display the category items data depending on the category id in URL. http://localhost:3000/categories/pillows

Maps to:

http://localhost:3000/categories/[categoryName]

```js
src
    pages
        [categoryName] <---------- pillows, blankets, candles
            [itemId]
        index.js
```

### Item page

We need a page that shows the item pillow-1, pillow-2, ...

This page also needs to display the item data depending on the category name & item id in URL. http://localhost:3000/categories/pillows/2

Maps to:

http://localhost:3000/categories/[categoryName]/[itemId]

e.g.

http://localhost:3000/categories/pillows/2
http://localhost:3000/categories/pillows/4
http://localhost:3000/categories/pillows/8
http://localhost:3000/categories/candles/1
http://localhost:3000/categories/candles/3
http://localhost:3000/categories/blankets/2

Get static paths is required so Next knows about all of the possible paths above. Next needs to be aware at the build time what paths are possible. We make it clear to it via getStaticPaths

```js
src
    pages
        [categoryName] <---------- pillows, blankets, candles
            [itemId] <-------- 1,2,3,4
                index.js
        index.js


```
