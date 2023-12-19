import * as fs from 'fs';
import * as archiver from 'archiver';

const folderToGet = process.argv[2] || __dirname;
const currentDate = new Date().toISOString().slice(0,19).replace(":","").replace(":","");
const zipFileName = `archive_${currentDate}.zip`;
const output = fs.createWriteStream(zipFileName);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    console.log(`Archive name is - ${zipFileName}`)
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

archive.on("progress", (progress) =>
    console.log(`[PROCESS PROGRESS]: ${progress.entries.processed}`)
)

archive.pipe(output);
archive.directory(folderToGet, false);
archive.finalize();