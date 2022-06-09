import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { Category } from './entities/Category';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':category')
  async findOne(@Param('category') category: string): Promise<Category> {
    return await this.categoriesService.findOne(category);
  }

  @Put(':category')
  @UsePipes(ValidationPipe)
  async update(
    @Param('category') category: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return await this.categoriesService.update(category, updateCategoryDto);
  }

  @Post('/:category/players/:player_id')
  async addPlayerToCategory(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.addPlayerToCategory(params);
  }
}
