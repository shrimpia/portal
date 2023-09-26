export class R2BucketRepository {
  async upload(r2: R2Bucket, file: File) {
    const obj = await r2.put(crypto.randomUUID(), file);
    if (obj === null) throw new Error('object is null');
    return obj.key;
  }

  async get(r2: R2Bucket, key: string) {
    const obj = await r2.get(key);
    if (!obj) return null;
    return obj.blob();
  }

  async delete(r2: R2Bucket, key: string) {
    await r2.delete(key);
  }
}
