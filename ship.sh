set -e

git checkout build
git merge master -m "Merge master"
rm -rf docs/
yarn build
git add -A docs
git commit -m "Release"
git push origin build
git checkout master
