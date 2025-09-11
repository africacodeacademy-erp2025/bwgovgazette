import { Readable } from "stream";

// Create a File-like object that matches the browser File API
export class FileWrapper implements File {
  public readonly name: string;
  public readonly size: number;
  public readonly type: string;
  public readonly lastModified: number;
  public readonly webkitRelativePath: string = "";
  private readonly _buffer: Buffer;

  constructor(multerFile: {
    originalname: string;
    size: number;
    mimetype: string;
    buffer: Buffer;
  }) {
    this.name = multerFile.originalname;
    this.size = multerFile.size;
    this.type = multerFile.mimetype;
    this.lastModified = Date.now();
    this._buffer = multerFile.buffer;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const buffer = this._buffer.buffer;
    if (buffer instanceof ArrayBuffer) {
      return buffer.slice(
        this._buffer.byteOffset,
        this._buffer.byteOffset + this._buffer.byteLength
      );
    }
    // Convert SharedArrayBuffer to ArrayBuffer if needed
    const arrayBuffer = new ArrayBuffer(this._buffer.length);
    const view = new Uint8Array(arrayBuffer);
    view.set(this._buffer);
    return arrayBuffer;
  }

  stream(): ReadableStream<Uint8Array<ArrayBuffer>> {
    const readable = Readable.from(this._buffer);
    return new ReadableStream({
      start(controller) {
        readable.on("data", (chunk: Buffer) => {
          const arrayBuffer = new ArrayBuffer(chunk.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < chunk.length; i++) {
            uint8Array[i] = chunk[i]!;
          }
          controller.enqueue(uint8Array as Uint8Array<ArrayBuffer>);
        });
        readable.on("end", () => {
          controller.close();
        });
        readable.on("error", (err) => {
          controller.error(err);
        });
      },
    }) as ReadableStream<Uint8Array<ArrayBuffer>>;
  }

  async text(): Promise<string> {
    return this._buffer.toString("utf8");
  }

  async bytes(): Promise<Uint8Array<ArrayBuffer>> {
    const arrayBuffer = new ArrayBuffer(this._buffer.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < this._buffer.length; i++) {
      uint8Array[i] = this._buffer[i]!;
    }
    return uint8Array as Uint8Array<ArrayBuffer>;
  }

  slice(start?: number, end?: number, contentType?: string): File {
    const sliced = this._buffer.slice(start, end);
    const wrapper = Object.create(FileWrapper.prototype) as FileWrapper;

    // Manually set properties since they're readonly
    Object.defineProperties(wrapper, {
      name: {
        value: this.name,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      size: {
        value: sliced.length,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      type: {
        value: contentType || this.type,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      lastModified: {
        value: this.lastModified,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      webkitRelativePath: {
        value: "",
        writable: false,
        enumerable: true,
        configurable: false,
      },
      _buffer: {
        value: sliced,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    return wrapper;
  }
}
