"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var archiver = require("archiver");
var path = require("path");
var folderToGet = process.argv[2] || __dirname;
var currentDate = new Date().toISOString().slice(0, 10);
var zipFileName = "".concat(path.basename(folderToGet), ".zip");
var output = fs.createWriteStream(zipFileName);
var archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    fs.renameSync(zipFileName, "archive_".concat(currentDate, ".zip"));
});
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn('Warning:', err.message);
    }
    else {
        throw err;
    }
});
archive.on('error', function (err) {
    throw err;
});
archive.pipe(output);
archive.directory(folderToGet, false);
archive.finalize();
