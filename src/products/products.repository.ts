import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { GetProductsFilterDao } from './dao/get-products-filter.dao';
import { ProductEntity } from './entities/product.entity';
import { MetaData } from '../common/models/meta.model';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@EntityRepository(ProductEntity)
export class ProductsRepository extends Repository<ProductEntity> {
  private init(user: UserEntity): SelectQueryBuilder<ProductEntity> {
    const user_id = user ? user.id : null;
    return this.createQueryBuilder('a')
      .innerJoin('product_category', 'b', 'a.id = b.product_id')
      .innerJoinAndMapMany(
        'a.categories',
        'category',
        'c',
        'b.category_id = c.id',
      )
      .innerJoinAndMapMany(
        'a.thumbnails',
        'thumbnail',
        'd',
        'a.id = d.product_id',
      )
      .innerJoinAndMapMany('a.thumbnails', 'image', 'e', 'd.image_id = e.id')
      .leftJoin('product_tag', 'f', 'a.id = f.product_id')
      .leftJoinAndMapMany('a.tags', 'tag', 'g', 'f.tag_id = g.id')
      .innerJoinAndMapOne('a.store', 'store', 'h', 'a.store_id = h.id')
      .leftJoinAndMapOne(
        'a.favorite',
        'favorite',
        'x',
        'a.id = x.product_id and x.user_id = :user_id',
        { user_id },
      );
  }

  private end(product: ProductEntity): void {
    product.categories.sort((a, b) => a.priority - b.priority);
    product.favorite_yn = product['favorite'] ? 'Y' : 'N';
    delete product['favorite'];
  }

  async filter(dto: GetProductsFilterDao): Promise<MetaData> {
    const { category_id, q, user, page, rows } = dto;
    const query = this.init(user).where('1 = 1');

    if (category_id) {
      query
        .innerJoin('product_category', 'aa', 'a.id = aa.product_id')
        .andWhere('aa.category_id = :category_id', { category_id });
    }
    if (q) {
      query
        .leftJoin('product_tag', 'bb', 'a.id = bb.product_id')
        .leftJoin('tag', 'cc', 'bb.tag_id = cc.id')
        .andWhere('cc.title like concat("%", :q, "%")', { q });
    }

    const total = await query.getCount();

    query.take(rows).skip((page - 1) * rows);
    const data = await query.getMany();
    data.forEach((product) => this.end(product));

    return { meta: { total }, data };
  }

  async getItems(dto: GetProductsFilterDto): Promise<ProductEntity[]> {
    // const products = await this.init(null).getMany();
    // products.forEach(product => this.end(product))
    // return products;
    const { store_id } = dto;
    const query = this.createQueryBuilder('product');
    if (store_id) {
      query.andWhere('product.store_id = :store_id', { store_id });
    }

    const products = await query.getMany();

    return products;
  }

  //   async getItemById(id: number, user: UserEntity): Promise<ProductEntity> {
  //     const product = await this.init(user).where('a.id = :id', { id }).getOne();
  //     this.end(product);
  //     return product;
  //   }
}
