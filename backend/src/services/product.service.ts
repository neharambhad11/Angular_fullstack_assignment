
import { MongoDataSource } from '../config/mongo.config';
import { Product } from '../schemas/product.schema';
import { ObjectId } from 'mongodb';

const productRepository =
  MongoDataSource.getMongoRepository(Product);

export class ProductService {

  async create(data: Partial<Product>) {
    const product = productRepository.create(data);
    return await productRepository.save(product);
  }

  async getAll() {
    return await productRepository.find();
  }

  async getById(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    const product = await productRepository.findOneBy({
      _id: new ObjectId(id)
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.getById(id);

    Object.assign(product, data);

    return await productRepository.save(product);
  }

  async delete(id: string) {
    const product = await this.getById(id);

    return await productRepository.remove(product);
  }
}
