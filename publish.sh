echo 清空dist
rm -rf dist/*
mkdir -p dist
echo 复制src
cp -R src dist/src
echo 复制package.json
cp package.json dist/package.json
echo 复制README.md
cp README.md dist/README.md
echo 开始发布
cd dist && npm publish && cd .. && rm -rf dist
echo 发布完成
