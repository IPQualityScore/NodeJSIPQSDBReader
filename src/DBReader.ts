import * as fs from 'fs';
import * as Binary from './BinaryOption';
import Column from './Column';

import FileReader from './FileReader';
import Utility from './Utility';

export default class DBReader {
	public static readonly IPQS_READER_VERSION = 1;
	public static readonly HEADER_PREFIX_BYTES = 11;
	public static Open(filename: string): FileReader {
		let file = new FileReader();
		
		fs.open(filename, 'r', (status, fd) => {
			file.fileHandler = fd;
			file.fileError = status;

			if(file.fileError !== null){
				return file.setup();
			}
			
			// Read headers.
			var buffer = Buffer.alloc(this.HEADER_PREFIX_BYTES);
			fs.read(fd, buffer, 0, 11, 0, (err, num) => {
				file.binaryData = new Binary.Bitmask(buffer[0]);
				if(file.binaryData.has(Binary.IPv4Map)){
					file.valid = true;
					file.IPv6 = false;
				}

				if(file.binaryData.has(Binary.IPv6Map)){
					file.valid = true;
					file.IPv6 = true;
				}

				if(file.binaryData.has(Binary.IsBlacklistFile)){
					file.blacklistFile = true;
				}

				if(file.valid === false){
					return file.setup("Invalid file format, invalid first byte, EID 1.");
				}

				if(buffer[1] !== this.IPQS_READER_VERSION){
					return file.setup("Invalid file version, EID 1.");
				}

				file.treeStart = Utility.uVarInt([buffer[2], buffer[3], buffer[4]]);
				if(file.treeStart === 0){
					return file.setup("Invalid file format, invalid header bytes, EID 2.");
				}

				file.recordBytes = Utility.uVarInt([buffer[5], buffer[6]]);
				if(file.recordBytes === 0){
					return file.setup("Invalid file format, invalid record bytes, EID 3.");
				}

				file.totalBytes = buffer.readInt32LE(7);
				if(file.totalBytes === 0){
					return file.setup("Invalid file format, EID 4.");
				}

				let column_bytes = file.treeStart - this.HEADER_PREFIX_BYTES;
				let columns = Buffer.alloc(column_bytes);
				fs.read(fd, columns, 0, column_bytes, this.HEADER_PREFIX_BYTES, (err, num) => {
					if(err !== null){
						file.fileError = err;
						return file.setup();
					}

					for(let i = 0;i < (columns.length / 24); i++){
						file.columns[i] = new Column(
							columns.toString('ascii', (i * 24), ((i + 1) * 24) - 1).split('\x00',1)[0],
							new Binary.Bitmask(columns.readUInt8(((i + 1) * 24) - 1))
						);
					}
					
					if(file.columns.length === 0){
						return file.setup("File does not appear to be valid, no column data found. EID: 5")
					}

					let treeheader = Buffer.alloc(FileReader.TREE_PREFIX_BYTES);
					fs.read(fd, treeheader, 0, FileReader.TREE_PREFIX_BYTES, file.treeStart, (err, num) => {
						if(err !== null){
							file.fileError = err;
							return file.setup();
						}
						
						let treetype = new Binary.Bitmask(treeheader[0]);
						if(!treetype.has(Binary.TreeData)){
							return file.setup("File does not appear to be valid, bad binary tree. EID: 6");
						}

						let totaltree = treeheader.readUInt32LE(1);
						if(totaltree === 0){
							return file.setup("File does not appear to be valid, tree size is too small. EID: 7");
						}

						file.treeEnd = file.treeStart + totaltree;
						file.setup();
					});
				});
			});
		});
		
		return file;
	}
}