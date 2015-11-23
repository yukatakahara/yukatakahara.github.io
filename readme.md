# My Website

## Creating Project Pages manually

https://help.github.com/articles/creating-project-pages-manually/

```
git clone github.com/user/repository.git
cd repository
git checkout --orphan gh-pages
git rm -rf .
rm '.gitignore'
echo "My Page" > index.html
git add index.html
git commit -a -m "First pages commit"
git push origin gh-pages
```
