import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { Category } from './entities/Category';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  private async categoryExists(category: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    return categoryExists;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryAlreadyExists = await this.categoryModel
      .findOne({
        category,
      })
      .exec();

    if (categoryAlreadyExists) {
      throw new BadRequestException('Category already exists');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(category: string): Promise<Category> {
    return await this.categoryExists(category);
  }

  async update(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoryExists(category);
    await this.categoryModel.findOneAndUpdate(
      { category },
      { $set: updateCategoryDto },
    );
  }
}
