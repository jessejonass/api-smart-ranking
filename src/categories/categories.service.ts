import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { Category } from './entities/Category';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
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
    return await this.categoryModel.find().populate('players').exec();
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

  async addPlayerToCategory(params: string[]): Promise<void> {
    const categoryId = params['category'];
    const playerId = params['player_id'];

    // check category exists
    const category = await this.categoryExists(categoryId);

    // check player exists
    await this.playersService.findOne(playerId);

    // check player already exists in category
    const playerAlreadyExistsInCategory = await this.categoryModel
      .find({
        categoryId,
      })
      .where('players')
      .in(playerId)
      .exec();

    if (playerAlreadyExistsInCategory.length > 0) {
      throw new BadRequestException(
        `Player ${playerId} already exists in category ${categoryId}`,
      );
    }

    category.players.push(playerId);
    await this.categoryModel.findOneAndUpdate(
      { category: categoryId },
      { $set: category },
    );
  }
}
