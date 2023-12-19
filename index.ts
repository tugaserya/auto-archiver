import * as fs from 'fs';
import * as zlib from 'zlib';
import * as archiver from 'archiver';
import * as path from 'path';

const folderToGet = process.argv[2] || __dirname;
const currentDate = new Date().toISOString().slice(0,10);
const zipFileName = `${path.basename(folderToGet)}.zip`;
const output = fs.createWriteStream(zipFileName);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    fs.renameSync(zipFileName, `archive_${currentDate}.zip`);
});

archive.on('warning', err => {
    if (err.code === 'ENOENT') {
        console.warn('Warning:', err.message);
    } else {
        throw err;
    }
});

archive.on('error', err => {
    throw err;
});

archive.pipe(output);
archive.directory(folderToGet, false);
archive.finalize();
