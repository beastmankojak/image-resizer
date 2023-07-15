import { readdirSync } from 'fs';
import { join } from 'path';
import { mkdirp } from 'mkdirp';
import { cluster } from 'radash';
import sharp from 'sharp';
import { BASE_DIR, IMPORT_TYPE, OFFSET, SIZES, SKIP } from './config';

const importTypeMap: Record<
  string,
  { filenameFilter: (filename: string) => boolean }
> = {
  png: {
    filenameFilter: (filename: string) => /\.png$/.test(filename),
  },
};

const batch = async ({
  arr,
  batchSize,
  fn,
}: {
  arr: string[];
  batchSize: number;
  fn: (arr: string[]) => Promise<sharp.OutputInfo>[];
}) => {
  const result = [];
  for (const chunk of cluster(arr, batchSize)) {
    console.log(chunk);
    result.push(...(await Promise.all(fn(chunk))));
    console.log(result.length / SIZES.length + OFFSET);
  }
};

(async () => {
  const sourceImages = readdirSync(BASE_DIR).filter(
    importTypeMap[IMPORT_TYPE]?.filenameFilter
  );
  const dirnames = sourceImages.map((filename) => filename.slice(0, -4));
  await Promise.all(dirnames.map((dirname) => mkdirp(join(BASE_DIR, dirname))));
  await batch({
    arr: sourceImages.slice(OFFSET).filter((img) => !SKIP.includes(img)),
    batchSize: 10,
    fn: (arr) =>
      arr.flatMap((filename) => {
        const basename = filename.slice(0, -4);
        const pipeline = sharp(join(BASE_DIR, filename));
        return SIZES.map((width) =>
          pipeline
            .clone()
            .resize({ width })
            .webp()
            .toFile(join(BASE_DIR, `${basename}`, `${width}.webp`))
        );
      }),
  });
})();
