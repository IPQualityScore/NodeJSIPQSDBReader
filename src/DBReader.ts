import { open } from "node:fs/promises";
import * as Binary from "./BinaryOption";
import Column from "./Column";

import FileReader from "./FileReader";
import Utility from "./Utility";

export default class DBReader {
  public static readonly IPQS_READER_VERSION = 1;
  public static readonly HEADER_PREFIX_BYTES = 11;

  public static async Open(filename: string): Promise<FileReader> {
    const file = new FileReader(); // Create the FileReader instance

    try {
      const handle = await open(filename, "r");
      file.fileHandler = handle;

      const headerBuffer = Buffer.alloc(this.HEADER_PREFIX_BYTES);
      const { bytesRead: headerBytesRead } = await handle.read(
        headerBuffer,
        0, // offset in the buffer to start reading
        this.HEADER_PREFIX_BYTES, // number of bytes to read
        0 // position in the file to start reading from
      );

      if (headerBytesRead !== this.HEADER_PREFIX_BYTES) {
        throw new Error("Failed to read complete header.");
      }

      file.binaryData = new Binary.Bitmask(headerBuffer[0]);
      if (file.binaryData.has(Binary.IPv4Map)) {
        file.valid = true;
        file.IPv6 = false;
      }

      if (file.binaryData.has(Binary.IPv6Map)) {
        file.valid = true;
        file.IPv6 = true;
      }

      if (file.binaryData.has(Binary.IsBlacklistFile)) {
        file.blacklistFile = true;
      }

      if (file.valid === false) {
        throw new Error("Invalid file format, invalid first byte, EID 1.");
      }

      if (headerBuffer[1] !== this.IPQS_READER_VERSION) {
        throw new Error("Invalid file version, EID 1.");
      }

      file.treeStart = Utility.uVarInt([
        headerBuffer[2],
        headerBuffer[3],
        headerBuffer[4],
      ]);
      if (file.treeStart === 0) {
        throw new Error("Invalid file format, invalid header bytes, EID 2.");
      }

      file.recordBytes = Utility.uVarInt([headerBuffer[5], headerBuffer[6]]);
      if (file.recordBytes === 0) {
        throw new Error("Invalid file format, invalid record bytes, EID 3.");
      }

      file.totalBytes = headerBuffer.readInt32LE(7);
      if (file.totalBytes === 0) {
        throw new Error("Invalid file format, EID 4.");
      }

      const column_bytes = file.treeStart - this.HEADER_PREFIX_BYTES;
      const columnsBuffer = Buffer.alloc(column_bytes);

      // Read column data
      const { bytesRead: columnBytesRead } = await handle.read(
        columnsBuffer,
        0, // offset in the buffer to start writing
        column_bytes, // number of bytes to read
        this.HEADER_PREFIX_BYTES // position in the file to start reading from
      );

      if (columnBytesRead !== column_bytes) {
        throw new Error("Failed to read complete column data.");
      }

      for (let i = 0; i < columnsBuffer.length / 24; i++) {
        file.columns[i] = new Column(
          columnsBuffer
            .toString("ascii", i * 24, (i + 1) * 24 - 1)
            .split("\x00", 1)[0],
          new Binary.Bitmask(columnsBuffer.readUInt8((i + 1) * 24 - 1))
        );
      }

      if (file.columns.length === 0) {
        throw new Error(
          "File does not appear to be valid, no column data found. EID: 5"
        );
      }

      const treeheaderBuffer = Buffer.alloc(FileReader.TREE_PREFIX_BYTES);

      // Read tree header
      const { bytesRead: treeHeaderBytesRead } = await handle.read(
        treeheaderBuffer,
        0, // offset in the buffer to start writing
        FileReader.TREE_PREFIX_BYTES, // number of bytes to read
        file.treeStart // position in the file to start reading from
      );

      if (treeHeaderBytesRead !== FileReader.TREE_PREFIX_BYTES) {
        throw new Error("Failed to read complete tree header.");
      }

      const treetype = new Binary.Bitmask(treeheaderBuffer[0]);
      if (!treetype.has(Binary.TreeData)) {
        throw new Error(
          "File does not appear to be valid, bad binary tree. EID: 6"
        );
      }

      const totaltree = treeheaderBuffer.readUInt32LE(1);
      if (totaltree === 0) {
        throw new Error(
          "File does not appear to be valid, tree size is too small. EID: 7"
        );
      }

      file.treeEnd = file.treeStart + totaltree;

      return file;
    } catch (err: unknown) {
      // Ensure the file handle is closed if an error occurs during setup
      if (file.fileHandler) {
        await file.fileHandler.close();
      }

      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to open/setup file: ${errorMessage}`); // Re-throw for external handling
    }
  }
}
