import 'dotenv/config';

const {
  BASE_DIR = '',
  IMPORT_TYPE = 'png',
  OFFSET: _OFFSET = '0',
  SIZES: _SIZES = '200, 600, 1024, 2048',
  SKIP: _SKIP = '',
} = process.env;

const OFFSET = parseInt(_OFFSET, 10);

const SIZES = _SIZES
  .trim()
  .split(/,\s*/)
  .filter((size) => !!size)
  .map((size) => parseInt(size, 10));

const SKIP = _SKIP
  .trim()
  .split(/,\s*/)
  .filter((skip) => !!skip);

export { BASE_DIR, IMPORT_TYPE, OFFSET, SIZES, SKIP };
