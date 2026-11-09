
import { SqlDataSource } from '../config/sql.config';
import { MongoDataSource } from '../config/mongo.config';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Product } from '../schemas/product.schema';
import { ObjectId } from 'mongodb';

const orderRepository = SqlDataSource.getRepository(Order);
const userRepository = SqlDataSource.getRepository(User);
const productRepository = MongoDataSource.getMongoRepository(Product);

export class OrderService {

  async create(userId: number, productIds: string[]) {

    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('At least one product is required');
    }

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    if (productIds.some(id => !ObjectId.isValid(id))) {
      throw new Error('Invalid product ID');
    }

    const products = await productRepository.findBy({
      _id: { $in: productIds.map(id => new ObjectId(id)) }
    });

    if (products.length !== productIds.length) {
      throw new Error('One or more products do not exist');
    }

    const totalAmount = products.reduce(
      (total, product) => total + Number(product.price),
      0
    );

    const order = orderRepository.create({
      userId,
      productIds: JSON.stringify(productIds),
      totalAmount
    });

    return await orderRepository.save(order);
  }

  async getById(orderId: number, userId: number) {

    const order = await orderRepository.findOneBy({
      orderId,
      userId
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      ...order,
      productIds: JSON.parse(order.productIds)
    };
  }

  async getAll(userId: number) {
    const orders = await orderRepository.find({
      where: { userId }
    });

    return orders.map(order => ({
      ...order,
      productIds: JSON.parse(order.productIds)
    }));
  }

  async update(
    orderId: number,
    userId: number,
    productIds: string[]
  ) {

    await this.getById(orderId, userId);

    const updatedOrder = await this.createUpdatedOrder(
      orderId,
      userId,
      productIds
    );

    return updatedOrder;
  }

  private async createUpdatedOrder(
    orderId: number,
    userId: number,
    productIds: string[]
  ) {

    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('At least one product is required');
    }

    if (productIds.some(id => !ObjectId.isValid(id))) {
      throw new Error('Invalid product ID');
    }

    const products = await productRepository.findBy({
      _id: { $in: productIds.map(id => new ObjectId(id)) }
    });

    if (products.length !== productIds.length) {
      throw new Error('One or more products do not exist');
    }

    const order = await orderRepository.findOneBy({
      orderId,
      userId
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.productIds = JSON.stringify(productIds);
    order.totalAmount = products.reduce(
      (total, product) => total + Number(product.price),
      0
    );

    return await orderRepository.save(order);
  }

  async delete(orderId: number, userId: number) {
    const order = await orderRepository.findOneBy({
      orderId,
      userId
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await orderRepository.remove(order);
  }
}
