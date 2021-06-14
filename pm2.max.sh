# Background server
pm2 start server/index.js --name "farmery-api"
echo "Background server opened successfully"

# Static file server
#pm2 start files/index.js -i max

pm2 start files/index.js --name "farmery-files"
echo "File server opened successfully"
